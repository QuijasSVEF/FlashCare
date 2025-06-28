/*
  # FlashCare Database Schema

  1. New Tables
    - `users` - User profiles for families and caregivers
    - `job_posts` - Job postings created by families
    - `swipes` - Swipe actions (like/pass) between users
    - `matches` - Mutual matches between families and caregivers
    - `messages` - Chat messages between matched users
    - `schedules` - Scheduled care sessions
    - `reviews` - User reviews and ratings
    - `credentials` - Caregiver certifications and credentials

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Implement proper access controls for matches and messages

  3. Features
    - Real-time messaging with Supabase subscriptions
    - Geolocation-based matching
    - Rating and review system
    - Scheduling system with status tracking
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('family', 'caregiver')),
  name text NOT NULL,
  avatar_url text,
  bio text,
  phone text,
  emergency_phone text,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Job posts table
CREATE TABLE IF NOT EXISTS job_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  hours_per_week integer NOT NULL DEFAULT 0,
  rate_hour numeric(10,2) NOT NULL DEFAULT 0,
  location text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Swipes table
CREATE TABLE IF NOT EXISTS swipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  caregiver_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  direction text NOT NULL CHECK (direction IN ('like', 'pass')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(family_id, caregiver_id, job_id)
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  family_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(caregiver_id, family_id, job_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body text NOT NULL,
  sent_at timestamptz DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating_int integer NOT NULL CHECK (rating_int >= 1 AND rating_int <= 5),
  comment_text text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(reviewer_id, reviewee_id)
);

-- Schedules table
CREATE TABLE IF NOT EXISTS schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  start_ts timestamptz NOT NULL,
  end_ts timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Credentials table
CREATE TABLE IF NOT EXISTS credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  certification_url text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE credentials ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read other profiles"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- Job posts policies
CREATE POLICY "Families can manage their job posts"
  ON job_posts
  FOR ALL
  TO authenticated
  USING (auth.uid() = family_id);

CREATE POLICY "Caregivers can read job posts"
  ON job_posts
  FOR SELECT
  TO authenticated
  USING (true);

-- Swipes policies
CREATE POLICY "Users can manage their swipes"
  ON swipes
  FOR ALL
  TO authenticated
  USING (auth.uid() = family_id OR auth.uid() = caregiver_id);

-- Matches policies
CREATE POLICY "Users can read their matches"
  ON matches
  FOR SELECT
  TO authenticated
  USING (auth.uid() = family_id OR auth.uid() = caregiver_id);

CREATE POLICY "System can create matches"
  ON matches
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Messages policies
CREATE POLICY "Users can read messages in their matches"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches 
      WHERE matches.id = messages.match_id 
      AND (matches.family_id = auth.uid() OR matches.caregiver_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in their matches"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM matches 
      WHERE matches.id = messages.match_id 
      AND (matches.family_id = auth.uid() OR matches.caregiver_id = auth.uid())
    )
  );

-- Reviews policies
CREATE POLICY "Users can read reviews about them"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (auth.uid() = reviewee_id OR auth.uid() = reviewer_id);

CREATE POLICY "Users can create reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reviewer_id);

-- Schedules policies
CREATE POLICY "Users can manage schedules in their matches"
  ON schedules
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches 
      WHERE matches.id = schedules.match_id 
      AND (matches.family_id = auth.uid() OR matches.caregiver_id = auth.uid())
    )
  );

-- Credentials policies
CREATE POLICY "Users can manage their credentials"
  ON credentials
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Others can read credentials"
  ON credentials
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_location ON users(location);
CREATE INDEX IF NOT EXISTS idx_job_posts_family_id ON job_posts(family_id);
CREATE INDEX IF NOT EXISTS idx_job_posts_location ON job_posts(location);
CREATE INDEX IF NOT EXISTS idx_swipes_family_caregiver ON swipes(family_id, caregiver_id);
CREATE INDEX IF NOT EXISTS idx_matches_family_id ON matches(family_id);
CREATE INDEX IF NOT EXISTS idx_matches_caregiver_id ON matches(caregiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_match_id ON messages(match_id);
CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON messages(sent_at);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_schedules_match_id ON schedules(match_id);
CREATE INDEX IF NOT EXISTS idx_schedules_start_ts ON schedules(start_ts);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_posts_updated_at BEFORE UPDATE ON job_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();