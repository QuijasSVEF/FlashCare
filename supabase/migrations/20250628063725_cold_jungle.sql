/*
  # Fix Authentication and Database Issues

  1. Database Setup
    - Fix RLS policies for proper user creation
    - Add missing database functions
    - Ensure proper user profile creation flow

  2. Authentication Flow
    - Allow user profile creation during signup
    - Fix policy conflicts
    - Enable proper user data access
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can read other profiles" ON users;

-- Create comprehensive user policies
CREATE POLICY "Enable insert for authenticated users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable read for own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Enable update for own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable read for other profiles"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- Ensure the updated_at trigger function exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Recreate the trigger
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- This function can be used to automatically create user profiles
  -- when a new auth user is created, but we'll handle it manually in the app
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Ensure job posts policies are correct
DROP POLICY IF EXISTS "Caregivers can read job posts" ON job_posts;
DROP POLICY IF EXISTS "Families can manage their job posts" ON job_posts;

CREATE POLICY "Enable read for authenticated users"
  ON job_posts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for families"
  ON job_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'family'
      AND users.id = family_id
    )
  );

CREATE POLICY "Enable update for job owners"
  ON job_posts
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.id = family_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.id = family_id
    )
  );

CREATE POLICY "Enable delete for job owners"
  ON job_posts
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.id = family_id
    )
  );

-- Fix swipes policies
DROP POLICY IF EXISTS "Users can manage their swipes" ON swipes;

CREATE POLICY "Enable insert for authenticated users"
  ON swipes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = family_id OR auth.uid() = caregiver_id
  );

CREATE POLICY "Enable read for involved users"
  ON swipes
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = family_id OR auth.uid() = caregiver_id
  );

-- Fix matches policies
DROP POLICY IF EXISTS "System can create matches" ON matches;
DROP POLICY IF EXISTS "Users can read their matches" ON matches;

CREATE POLICY "Enable insert for authenticated users"
  ON matches
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = family_id OR auth.uid() = caregiver_id
  );

CREATE POLICY "Enable read for matched users"
  ON matches
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = family_id OR auth.uid() = caregiver_id
  );

-- Fix messages policies
DROP POLICY IF EXISTS "Users can read messages in their matches" ON messages;
DROP POLICY IF EXISTS "Users can send messages in their matches" ON messages;

CREATE POLICY "Enable read for match participants"
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

CREATE POLICY "Enable insert for match participants"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = messages.match_id
      AND (matches.family_id = auth.uid() OR matches.caregiver_id = auth.uid())
    )
  );

-- Fix schedules policies
DROP POLICY IF EXISTS "Users can manage schedules in their matches" ON schedules;

CREATE POLICY "Enable all for match participants"
  ON schedules
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = schedules.match_id
      AND (matches.family_id = auth.uid() OR matches.caregiver_id = auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = schedules.match_id
      AND (matches.family_id = auth.uid() OR matches.caregiver_id = auth.uid())
    )
  );

-- Fix reviews policies
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Users can read reviews about them" ON reviews;

CREATE POLICY "Enable insert for authenticated users"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Enable read for involved users"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = reviewer_id OR auth.uid() = reviewee_id
  );

-- Fix credentials policies
DROP POLICY IF EXISTS "Others can read credentials" ON credentials;
DROP POLICY IF EXISTS "Users can manage their credentials" ON credentials;

CREATE POLICY "Enable read for authenticated users"
  ON credentials
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable all for credential owners"
  ON credentials
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);