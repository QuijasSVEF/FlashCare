/*
  # User Documents Table Migration

  1. New Tables
    - `user_documents`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `file_name` (text)
      - `file_url` (text)
      - `file_path` (text)
      - `file_type` (text, optional)
      - `file_size` (integer, optional)
      - `document_type` (text, constrained values)
      - `uploaded_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `user_documents` table
    - Add policies for users to manage their own documents
    - Add policy for viewing public document types (certifications, avatars)
    - Add policy for viewing documents from matched users

  3. Performance
    - Add indexes on user_id, uploaded_at, and document_type
    - Add trigger for updating uploaded_at timestamp

  4. Storage
    - Note: Storage bucket policies must be created manually in Supabase Dashboard
*/

-- Create user_documents table for tracking uploaded documents
CREATE TABLE IF NOT EXISTS user_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_path text NOT NULL,
  file_type text,
  file_size integer,
  document_type text CHECK (document_type IN ('avatar', 'attachment', 'document', 'certification')),
  uploaded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on user_documents
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_documents_user_id ON user_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_uploaded_at ON user_documents(uploaded_at);
CREATE INDEX IF NOT EXISTS idx_user_documents_type ON user_documents(document_type);

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own documents" ON user_documents;
DROP POLICY IF EXISTS "Users can view public document types" ON user_documents;
DROP POLICY IF EXISTS "Users can insert their own documents" ON user_documents;
DROP POLICY IF EXISTS "Users can update their own documents" ON user_documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON user_documents;

-- Policies for user_documents table
CREATE POLICY "Users can view their own documents"
  ON user_documents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public document types"
  ON user_documents FOR SELECT
  TO authenticated
  USING (
    document_type IN ('certification', 'avatar') OR
    EXISTS (
      SELECT 1 FROM matches m
      WHERE (m.family_id = auth.uid() OR m.caregiver_id = auth.uid())
      AND (m.family_id = user_documents.user_id OR m.caregiver_id = user_documents.user_id)
    )
  );

CREATE POLICY "Users can insert their own documents"
  ON user_documents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents"
  ON user_documents FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents"
  ON user_documents FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create or replace trigger function for updating uploaded_at
CREATE OR REPLACE FUNCTION update_user_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.uploaded_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists, then create it
DROP TRIGGER IF EXISTS update_user_documents_updated_at ON user_documents;

CREATE TRIGGER update_user_documents_updated_at
  BEFORE UPDATE ON user_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_user_documents_updated_at();

-- Note: Storage bucket policies must be created manually in the Supabase Dashboard
-- See docs/STORAGE_SETUP_MANUAL.md for instructions