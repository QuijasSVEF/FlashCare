# Storage Bucket Policies - Manual Setup Required

## Important: Manual Configuration Required

The storage bucket policies **cannot** be created through SQL migrations due to permission restrictions. You must set them up manually through the Supabase Dashboard.

## Step-by-Step Instructions

### 1. Create Storage Buckets

First, create these three buckets in the Supabase Dashboard:

1. **avatars** (Public bucket)
   - File size limit: 5MB
   - Allowed MIME types: image/jpeg, image/png, image/gif, image/webp

2. **attachments** (Private bucket)
   - File size limit: 10MB
   - Allowed MIME types: image/jpeg, image/png, image/gif, image/webp, application/pdf, text/plain

3. **documents** (Private bucket)
   - File size limit: 10MB
   - Allowed MIME types: application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain, image/jpeg, image/png

### 2. Create Storage Policies

Go to **Storage** → **Policies** in the Supabase Dashboard and create the following policies:

#### For "avatars" Bucket:

1. **Public Read Policy**
   - Policy name: "Avatar images are publicly accessible"
   - Operation: SELECT
   - Target roles: public
   - Policy definition: `bucket_id = 'avatars'`

2. **User Upload Policy**
   - Policy name: "Users can upload their own avatar"
   - Operation: INSERT
   - Target roles: authenticated
   - Policy definition: `bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]`

3. **User Update Policy**
   - Policy name: "Users can update their own avatar"
   - Operation: UPDATE
   - Target roles: authenticated
   - Policy definition: `bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]`

4. **User Delete Policy**
   - Policy name: "Users can delete their own avatar"
   - Operation: DELETE
   - Target roles: authenticated
   - Policy definition: `bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]`

#### For "attachments" Bucket:

1. **Match-based Read Policy**
   - Policy name: "Users can view attachments in their matches"
   - Operation: SELECT
   - Target roles: authenticated
   - Policy definition:
     ```sql
     bucket_id = 'attachments' AND
     (
       auth.uid()::text = (storage.foldername(name))[1] OR
       EXISTS (
         SELECT 1 FROM matches m
         WHERE (m.family_id = auth.uid() OR m.caregiver_id = auth.uid())
         AND (m.family_id::text = (storage.foldername(name))[1] OR m.caregiver_id::text = (storage.foldername(name))[1])
       )
     )
     ```

2. **User Upload Policy**
   - Policy name: "Users can upload attachments"
   - Operation: INSERT
   - Target roles: authenticated
   - Policy definition: `bucket_id = 'attachments' AND auth.uid()::text = (storage.foldername(name))[1]`

3. **User Delete Policy**
   - Policy name: "Users can delete their own attachments"
   - Operation: DELETE
   - Target roles: authenticated
   - Policy definition: `bucket_id = 'attachments' AND auth.uid()::text = (storage.foldername(name))[1]`

#### For "documents" Bucket:

1. **User Read Policy**
   - Policy name: "Users can view their own documents"
   - Operation: SELECT
   - Target roles: authenticated
   - Policy definition: `bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]`

2. **User Upload Policy**
   - Policy name: "Users can upload their own documents"
   - Operation: INSERT
   - Target roles: authenticated
   - Policy definition: `bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]`

3. **User Update Policy**
   - Policy name: "Users can update their own documents"
   - Operation: UPDATE
   - Target roles: authenticated
   - Policy definition: `bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]`

4. **User Delete Policy**
   - Policy name: "Users can delete their own documents"
   - Operation: DELETE
   - Target roles: authenticated
   - Policy definition: `bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]`

## Verification

After creating all policies, verify they work correctly:

1. Sign in to your app
2. Try uploading a profile photo
3. Try sending an image in a chat
4. Try uploading a document

## Troubleshooting

If you encounter issues:

1. Check that RLS is enabled on the `storage.objects` table
2. Verify all policies are correctly created with the exact policy definitions
3. Ensure the bucket names match exactly (`avatars`, `attachments`, `documents`)
4. Test with a simple file upload first before trying more complex operations

## Security Notes

- The `avatars` bucket is public to allow profile photos to be visible to all users
- The `attachments` bucket allows matched users to see each other's files
- The `documents` bucket is strictly private - only the owner can access files