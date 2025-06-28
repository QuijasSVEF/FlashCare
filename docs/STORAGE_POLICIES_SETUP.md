# Storage Policies Setup Guide

## Quick Setup Instructions

Since you've already created the storage buckets in the Supabase dashboard, you can now set up the storage policies using SQL.

### Method 1: Run Migration File (Recommended)

The easiest way is to run the migration file that was just created:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy and paste the contents of `supabase/migrations/20250628191500_storage_policies.sql`
3. Click **"Run"** to execute all policies at once

### Method 2: Manual Policy Setup

If you prefer to add policies manually through the dashboard:

1. Go to **Supabase Dashboard** → **Storage** → **Policies**
2. Click **"New Policy"** for each bucket
3. Use the policy expressions from the migration file

## What These Policies Do

### 🖼️ **Avatars Bucket** (Public)
- ✅ **Anyone can view** avatar images (public read)
- ✅ **Users can upload** to their own folder (`user_id/filename`)
- ✅ **Users can update/delete** their own avatars only

### 📎 **Attachments Bucket** (Private)
- ✅ **Match-based access**: Users can view attachments from people they're matched with
- ✅ **Owner upload**: Users can upload to their own folder
- ✅ **Owner delete**: Users can delete their own attachments

### 📄 **Documents Bucket** (Private)
- ✅ **Owner-only access**: Users can only see their own documents
- ✅ **Full CRUD**: Users have complete control over their documents
- ✅ **Privacy protection**: No one else can access private documents

## File Organization Structure

Files will be automatically organized like this:

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

## Testing the Setup

After running the migration, test these features:

1. **Profile Photo Upload**: 
   - Go to Profile → Edit Profile → Change Photo
   - Try uploading a new avatar image

2. **Message Attachments**:
   - Open a chat conversation
   - Click the attachment button
   - Send an image

3. **Document Management**:
   - Use the DocumentUpload component
   - Upload a PDF or document file

## Troubleshooting

### Common Issues:

1. **"Access denied" errors**: 
   - Check that the migration ran successfully
   - Verify RLS is enabled on storage.objects

2. **Policies not working**:
   - Ensure bucket names match exactly (`avatars`, `attachments`, `documents`)
   - Check that user is authenticated before upload

3. **File upload fails**:
   - Verify file size limits (5MB for avatars, 10MB for others)
   - Check file type restrictions

### Debug Steps:

1. Check Supabase logs for detailed error messages
2. Verify policies exist in Storage → Policies
3. Test with smaller files first
4. Ensure user authentication is working

## Security Notes

- **Avatars**: Public read access allows profile photos to be displayed to all users
- **Attachments**: Only matched users can view each other's attachments
- **Documents**: Completely private, only the owner can access
- **File paths**: User ID is embedded in the file path for access control