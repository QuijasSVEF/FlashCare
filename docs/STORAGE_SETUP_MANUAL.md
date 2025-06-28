# Storage Setup - Manual Configuration Required

Since storage policies cannot be created through SQL migrations, you need to set them up manually in the Supabase Dashboard.

## 🚨 Important: Manual Setup Required

The storage policies need to be created through the Supabase Dashboard because they require special permissions that migrations don't have.

## 📋 Step-by-Step Setup

### 1. Go to Supabase Dashboard
- Navigate to your project
- Go to **Storage** → **Policies**

### 2. Enable RLS on storage.objects
If not already enabled, run this in the SQL Editor:
```sql
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
```

### 3. Create Policies for Each Bucket

#### Avatars Bucket (Public)
Create these 4 policies:

**Policy 1: Public Read**
```sql
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');
```

**Policy 2: User Upload**
```sql
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

**Policy 3: User Update**
```sql
CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

**Policy 4: User Delete**
```sql
CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

#### Attachments Bucket (Private)
Create these 3 policies:

**Policy 1: Match-based Read**
```sql
CREATE POLICY "Users can view attachments in their matches"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'attachments' AND
    (
      auth.uid()::text = (storage.foldername(name))[1] OR
      EXISTS (
        SELECT 1 FROM matches m
        WHERE (m.family_id = auth.uid() OR m.caregiver_id = auth.uid())
        AND (m.family_id::text = (storage.foldername(name))[1] OR m.caregiver_id::text = (storage.foldername(name))[1])
      )
    )
  );
```

**Policy 2: User Upload**
```sql
CREATE POLICY "Users can upload attachments"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

**Policy 3: User Delete**
```sql
CREATE POLICY "Users can delete their own attachments"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

#### Documents Bucket (Private)
Create these 4 policies:

**Policy 1: User Read**
```sql
CREATE POLICY "Users can view their own documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

**Policy 2: User Upload**
```sql
CREATE POLICY "Users can upload their own documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

**Policy 3: User Update**
```sql
CREATE POLICY "Users can update their own documents"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

**Policy 4: User Delete**
```sql
CREATE POLICY "Users can delete their own documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

## ✅ Verification

After creating all policies, test the setup:

1. **Upload a file** to each bucket
2. **Verify access controls** work correctly
3. **Test file deletion** permissions

## 🔧 Alternative: Use Supabase CLI

If you prefer command line:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to your project
supabase login

# Apply policies via CLI
supabase db push
```

## 📝 Notes

- Storage policies require special database permissions
- They cannot be created through standard SQL migrations
- Manual setup ensures proper security configuration
- Test thoroughly before deploying to production