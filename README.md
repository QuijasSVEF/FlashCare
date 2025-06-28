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

After creating the buckets, you need to add RLS policies. See the detailed setup guide:

📖 **[Complete Storage Setup Guide](./docs/STORAGE_SETUP.md)**

### Quick Policy Setup

1. Go to **Supabase Dashboard** → **Storage** → **Policies**
2. Add the policies listed in the setup guide for each bucket
3. Test file uploads in the app

### File Upload Features

✅ **Avatar Upload**: Profile photo management  
✅ **Message Attachments**: Send images in chats  
✅ **Document Management**: Upload and organize files  
✅ **Multi-platform Support**: Web and mobile compatibility  
✅ **Security**: User-based access controls  

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
- ✅ Storage and file management
- ✅ Review and rating system
- ✅ Subscription management
- 🔄 Push notifications (in progress)
- 🔄 Advanced search and filtering (in progress)

## File Upload System

The app includes a comprehensive file upload system with:

- **Avatar Management**: Profile photo upload and management
- **Message Attachments**: Send images and files in conversations  
- **Document Storage**: Organize important documents
- **Security**: User-based access controls and RLS policies
- **Multi-platform**: Works on web and mobile devices

### Components Available:

- `<AvatarUpload />` - Profile photo management
- `<ImageUploadModal />` - Image upload interface
- `<DocumentUpload />` - Document management
- `<EnhancedMessageInput />` - Message input with attachments
