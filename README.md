# FlashCare

A modern caregiving platform connecting families with trusted caregivers.

## Setup Instructions

### Storage Buckets

The following storage buckets need to be created manually in the Supabase Dashboard:

1. **avatars** (Public)
   - File size limit: 5MB
   - Allowed types: image/jpeg, image/png, image/gif, image/webp

2. **attachments** (Private)
   - File size limit: 10MB  
   - Allowed types: image/jpeg, image/png, image/gif, image/webp, application/pdf, text/plain

3. **documents** (Private)
   - File size limit: 10MB
   - Allowed types: application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain, image/jpeg, image/png

### Storage Policies

After creating the buckets, add these RLS policies in the Supabase Dashboard:

#### Avatars Bucket
- **Public read**: Allow anyone to view avatar images
- **Authenticated upload**: Users can upload to their own folder (user_id/filename)
- **Owner update/delete**: Users can modify their own avatars

#### Attachments Bucket  
- **Match-based access**: Users can view attachments from their matches
- **Owner upload/delete**: Users can upload and delete their own attachments

#### Documents Bucket
- **Owner only**: Users can only access their own documents
- **Full CRUD**: Users have complete control over their documents

## Development

```bash
npm install
npm run dev
```

## Features

- ✅ User authentication and profiles
- ✅ Job posting and browsing
- ✅ Swipe-based matching system
- ✅ Real-time messaging
- ✅ File upload and document management
- ✅ Scheduling system
- ✅ Review and rating system
- ✅ Subscription management
- 🔄 Push notifications (in progress)
- 🔄 Advanced search and filtering (in progress)
