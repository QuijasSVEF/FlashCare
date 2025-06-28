/*
  # Fix users table RLS policy for profile creation

  1. Security Updates
    - Update RLS policy to allow authenticated users to insert their own profile
    - Ensure proper policy for profile creation during signup
    - Fix policy conditions to match auth.uid() with user id

  2. Changes
    - Drop existing restrictive insert policy
    - Create new policy that allows users to create their own profile
    - Maintain security while enabling proper signup flow
*/

-- Drop the existing restrictive insert policy
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;

-- Create a new policy that allows users to create their own profile
CREATE POLICY "Users can create own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Ensure the existing policies are properly configured
DROP POLICY IF EXISTS "Enable read for own profile" ON users;
DROP POLICY IF EXISTS "Enable read for other profiles" ON users;

-- Recreate read policies with proper conditions
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read other profiles"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- Ensure update policy is correct
DROP POLICY IF EXISTS "Enable update for own profile" ON users;

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);