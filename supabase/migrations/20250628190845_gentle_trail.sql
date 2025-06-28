/*
  # Storage Setup for FlashCare

  1. Storage Buckets
    - Create avatars bucket (public)
    - Create attachments bucket (private)
    - Create documents bucket (private)

  2. User Documents Tracking
    - Create user_documents table for tracking uploaded files
    - Add RLS policies for secure access

  3. Security
    - Enable RLS on user_documents table
    - Add policies for authenticated users to manage their own documents

  Note: Storage bucket policies are managed through Supabase Dashboard or API,
  not through SQL migrations. The buckets and their policies should be created
  via the Supabase Dashboard under Storage settings.
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

-- Policies for user_documents
CREATE POLICY "Users can view their own documents"
  ON user_documents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

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

-- Allow other users to view certain document types (like certifications for caregivers)
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_documents_user_id ON user_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_uploaded_at ON user_documents(uploaded_at);
CREATE INDEX IF NOT EXISTS idx_user_documents_type ON user_documents(document_type);

-- Add a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.uploaded_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_documents_updated_at
    BEFORE UPDATE ON user_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_user_documents_updated_at();