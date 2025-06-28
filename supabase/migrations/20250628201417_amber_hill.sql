/*
  # Create user_documents table for file tracking

  1. New Tables
    - `user_documents` - Track uploaded files with metadata
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `file_name` (text, original filename)
      - `file_url` (text, public URL)
      - `file_path` (text, storage path)
      - `file_type` (text, MIME type)
      - `file_size` (integer, bytes)
      - `document_type` (text, category)
      - `uploaded_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `user_documents` table
    - Add policies for users to manage their own documents
    - Allow viewing of public document types (avatars, certifications)
    - Allow matched users to view each other's attachments

  3. Performance
    - Add indexes on user_id, uploaded_at, and document_type
    - Add trigger for automatic timestamp updates
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

-- Create trigger function for updating updated_at (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'update_user_documents_updated_at'
  ) THEN
    CREATE FUNCTION update_user_documents_updated_at()
    RETURNS TRIGGER AS $func$
    BEGIN
        NEW.uploaded_at = now();
        RETURN NEW;
    END;
    $func$ language 'plpgsql';
  END IF;
END $$;

-- Add trigger for updating updated_at (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_user_documents_updated_at'
    AND tgrelid = 'user_documents'::regclass
  ) THEN
    CREATE TRIGGER update_user_documents_updated_at
      BEFORE UPDATE ON user_documents
      FOR EACH ROW
      EXECUTE FUNCTION update_user_documents_updated_at();
  END IF;
END $$;

-- Note: Storage bucket policies must be created manually in the Supabase Dashboard
-- See docs/STORAGE_SETUP_MANUAL.md for instructions