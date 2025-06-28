/*
  # Fix Users Table RLS Policies

  1. Security Updates
    - Add policy for users to insert their own profile during signup
    - Ensure users can read their own profile
    - Allow users to update their own profile
    - Allow authenticated users to read other profiles (for matching)

  2. Changes
    - Drop existing restrictive policies
    - Add comprehensive policies for user operations
    - Ensure signup process works correctly
*/

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can read other profiles" ON users;
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Allow users to insert their own profile during signup
CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow authenticated users to read other profiles (needed for matching)
CREATE POLICY "Users can read other profiles"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);