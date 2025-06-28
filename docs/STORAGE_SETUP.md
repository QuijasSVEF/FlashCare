# Storage Setup Guide

## Required Storage Buckets

The following buckets should be created in your Supabase Dashboard under Storage:

### 1. Avatars Bucket
- **Name**: `avatars`
- **Public**: ✅ Yes
- **File size limit**: 5MB (5,242,880 bytes)
- **Allowed MIME types**: `image/jpeg`, `image/png`, `image/gif`, `image/webp`

### 2. Attachments Bucket  
- **Name**: `attachments`
- **Public**: ❌ No
- **File size limit**: 10MB (10,485,760 bytes)
- **Allowed MIME types**: `image/jpeg`, `image/png`, `image/gif`, `image/webp`, `application/pdf`, `text/plain`

### 3. Documents Bucket
- **Name**: `documents` 
- **Public**: ❌ No
- **File size limit**: 10MB (10,485,760 bytes)
- **Allowed MIME types**: `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `text/plain`, `image/jpeg`, `image/png`

## Storage Policies

After creating the buckets, you need to add these RLS policies in the Supabase Dashboard:

### For Avatars Bucket

#### 1. Public Read Policy
```sql
-- Policy Name: "Avatar images are publicly accessible"
-- Operation: SELECT
-- Target roles: public

bucket_id = 'avatars'
```

#### 2. Authenticated Upload Policy
```sql
-- Policy Name: "Users can upload their own avatar"
-- Operation: INSERT  
-- Target roles: authenticated

bucket_id = 'avatars' AND
auth.uid()::text = (storage.foldername(name))[1]
```

#### 3. Owner Update Policy
```sql
-- Policy Name: "Users can update their own avatar"
-- Operation: UPDATE
-- Target roles: authenticated

bucket_id = 'avatars' AND
auth.uid()::text = (storage.foldername(name))[1]
```

#### 4. Owner Delete Policy
```sql
-- Policy Name: "Users can delete their own avatar"
-- Operation: DELETE
-- Target roles: authenticated

bucket_id = 'avatars' AND
auth.uid()::text = (storage.foldername(name))[1]
```

### For Attachments Bucket

#### 1. Match-based Read Policy
```sql
-- Policy Name: "Users can view attachments in their matches"
-- Operation: SELECT
-- Target roles: authenticated

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

#### 2. Owner Upload Policy
```sql
-- Policy Name: "Users can upload attachments"
-- Operation: INSERT
-- Target roles: authenticated

bucket_id = 'attachments' AND
auth.uid()::text = (storage.foldername(name))[1]
```

#### 3. Owner Delete Policy
```sql
-- Policy Name: "Users can delete their own attachments"
-- Operation: DELETE
-- Target roles: authenticated

bucket_id = 'attachments' AND
auth.uid()::text = (storage.foldername(name))[1]
```

### For Documents Bucket

#### 1. Owner Read Policy
```sql
-- Policy Name: "Users can view their own documents"
-- Operation: SELECT
-- Target roles: authenticated

bucket_id = 'documents' AND
auth.uid()::text = (storage.foldername(name))[1]
```

#### 2. Owner Upload Policy
```sql
-- Policy Name: "Users can upload their own documents"
-- Operation: INSERT
-- Target roles: authenticated

bucket_id = 'documents' AND
auth.uid()::text = (storage.foldername(name))[1]
```

#### 3. Owner Update Policy
```sql
-- Policy Name: "Users can update their own documents"
-- Operation: UPDATE
-- Target roles: authenticated

bucket_id = 'documents' AND
auth.uid()::text = (storage.foldername(name))[1]
```

#### 4. Owner Delete Policy
```sql
-- Policy Name: "Users can delete their own documents"
-- Operation: DELETE
-- Target roles: authenticated

bucket_id = 'documents' AND
auth.uid()::text = (storage.foldername(name))[1]
```

## How to Add Policies

1. Go to **Supabase Dashboard** → **Storage** → **Policies**
2. Click **"New Policy"**
3. Select the appropriate bucket
4. Choose the operation type (SELECT, INSERT, UPDATE, DELETE)
5. Set target roles (public or authenticated)
6. Add the policy expression from above
7. Give it a descriptive name
8. Click **"Save"**

## File Organization

Files will be organized in the following structure:
```
avatars/
  ├── {user_id}/
  │   └── avatar-{user_id}.jpg

attachments/
  ├── {user_id}/
  │   ├── {timestamp}-{random}.jpg
  │   └── {timestamp}-{random}.pdf

documents/
  ├── {user_id}/
  │   ├── {timestamp}-{random}.pdf
  │   └── {timestamp}-{random}.docx
```

## Testing

After setting up the policies, test the file upload functionality:

1. **Avatar Upload**: Try updating your profile photo
2. **Message Attachments**: Send an image in a chat
3. **Document Upload**: Upload a document (web only for now)

## Troubleshooting

### Common Issues:

1. **"Access denied" errors**: Check that RLS policies are correctly configured
2. **File not uploading**: Verify bucket exists and has correct permissions
3. **Can't view files**: Ensure public read policy is set for avatars bucket
4. **Large file errors**: Check file size limits in bucket settings

### Debug Steps:

1. Check browser console for detailed error messages
2. Verify user is authenticated before upload
3. Confirm bucket names match exactly
4. Test with smaller files first
5. Check Supabase logs for server-side errors