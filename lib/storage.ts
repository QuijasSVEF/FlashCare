import { supabase } from './supabase';
import { Platform } from 'react-native';
import { databaseService } from './database';
import * as ImagePicker from 'expo-image-picker';

export const storageService = {
  async uploadFile(uri: string, fileName: string, bucket: string = 'avatars') {
    try {
      let fileData;
      
      if (Platform.OS === 'web') {
        // For web, handle file input or blob
        if (uri.startsWith('blob:') || uri.startsWith('data:')) {
          const response = await fetch(uri);
          fileData = await response.blob();
        } else {
          throw new Error('Invalid file URI for web platform');
        }
      } else {
        // For mobile, convert URI to blob
        const response = await fetch(uri);
        fileData = await response.blob();
      }

      const fileExt = fileName.split('.').pop()?.toLowerCase() || 'jpg';
      const filePath = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, fileData, {
          contentType: this.getContentType(fileExt),
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      // Track the uploaded file in our database
      if (bucket !== 'temp') {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await databaseService.supabase
              .from('user_documents')
              .insert({
                user_id: user.id,
                file_name: fileName,
                file_url: urlData.publicUrl,
                file_path: filePath,
                file_type: this.getContentType(fileExt || ''),
                file_size: fileData.size || 0,
                document_type: this.getDocumentType(bucket)
              });
          }
        } catch (dbError) {
          console.warn('Failed to track file in database:', dbError);
          // Don't fail the upload if database tracking fails
        }
      }

      return {
        path: filePath,
        url: urlData.publicUrl,
        fileName
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  async uploadAvatar(uri: string, userId: string) {
    try {
      const fileName = `avatar-${userId}.jpg`;
      const result = await this.uploadFile(uri, fileName, 'avatars');
      
      // Update user profile with new avatar URL
      const { error } = await supabase
        .from('users')
        .update({ avatar_url: result.url })
        .eq('id', userId);

      if (error) throw error;

      return result;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  },

  async pickAndUploadImage(userId: string, type: 'avatar' | 'attachment' = 'avatar') {
    try {
      // Request permissions
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          throw new Error('Permission to access media library is required');
        }
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: type === 'avatar' ? [1, 1] : [4, 3],
        quality: 0.8,
        base64: false,
      });

      if (result.canceled || !result.assets[0]) {
        return null;
      }

      const asset = result.assets[0];
      
      if (type === 'avatar') {
        return await this.uploadAvatar(asset.uri, userId);
      } else {
        const fileName = asset.fileName || `image-${Date.now()}.jpg`;
        return await this.uploadFile(asset.uri, fileName, 'attachments');
      }
    } catch (error) {
      console.error('Error picking and uploading image:', error);
      throw error;
    }
  },

  async takeAndUploadPhoto(userId: string, type: 'avatar' | 'attachment' = 'avatar') {
    try {
      // Request camera permissions
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          throw new Error('Permission to access camera is required');
        }
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: type === 'avatar' ? [1, 1] : [4, 3],
        quality: 0.8,
        base64: false,
      });

      if (result.canceled || !result.assets[0]) {
        return null;
      }

      const asset = result.assets[0];
      
      if (type === 'avatar') {
        return await this.uploadAvatar(asset.uri, userId);
      } else {
        const fileName = `photo-${Date.now()}.jpg`;
        return await this.uploadFile(asset.uri, fileName, 'attachments');
      }
    } catch (error) {
      console.error('Error taking and uploading photo:', error);
      throw error;
    }
  },

  // Web-specific file upload
  async uploadFileFromInput(file: File, userId: string, type: 'avatar' | 'attachment' = 'avatar') {
    try {
      if (Platform.OS !== 'web') {
        throw new Error('This method is only available on web');
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      if (type === 'avatar') {
        // Create object URL for the file
        const objectUrl = URL.createObjectURL(file);
        const result = await this.uploadAvatar(objectUrl, userId);
        URL.revokeObjectURL(objectUrl);
        return result;
      } else {
        const objectUrl = URL.createObjectURL(file);
        const result = await this.uploadFile(objectUrl, file.name, 'attachments');
        URL.revokeObjectURL(objectUrl);
        return result;
      }
    } catch (error) {
      console.error('Error uploading file from input:', error);
      throw error;
    }
  },

  // Create file input for web
  createFileInput(onFileSelect: (file: File) => void, accept: string = 'image/*') {
    if (Platform.OS !== 'web') {
      throw new Error('File input is only available on web');
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.style.display = 'none';
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        onFileSelect(file);
      }
      document.body.removeChild(input);
    };
    
    document.body.appendChild(input);
    input.click();
  },

  async resizeImage(uri: string, maxWidth: number = 800, maxHeight: number = 600, quality: number = 0.8) {
    try {
      if (Platform.OS === 'web') {
        return new Promise<string>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
              reject(new Error('Could not get canvas context'));
              return;
            }

            // Calculate new dimensions
            let { width, height } = img;
            if (width > height) {
              if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
              }
            }

            canvas.width = width;
            canvas.height = height;

            // Draw and compress
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(dataUrl);
          };
          img.onerror = reject;
          img.src = uri;
        });
      } else {
        // For mobile, use expo-image-manipulator if needed
        return uri; // Return original for now
      }
    } catch (error) {
      console.error('Error resizing image:', error);
      return uri; // Return original on error
    }
  },

  async uploadDocument(uri: string, fileName: string, userId: string) {
    try {
      const result = await this.uploadFile(uri, fileName, 'documents');
      
      // Optionally store document reference in database
      const { error } = await supabase
        .from('user_documents')
        .insert({
          user_id: userId,
          file_name: fileName,
          file_url: result.url,
          file_path: result.path,
          uploaded_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error storing document reference:', error);
        // Don't throw here, file upload was successful
      }

      return result;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },

  getDocumentType(bucket: string): string {
    switch (bucket) {
      case 'avatars':
        return 'avatar';
      case 'attachments':
        return 'attachment';
      case 'documents':
        return 'document';
      default:
        return 'document';
    }
  },

  getContentType(extension: string): string {
        
    const types: Record<string, string> = {
      // Images
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      // Documents
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'txt': 'text/plain',
      'rtf': 'application/rtf',
      // Spreadsheets
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'csv': 'text/csv',
    };
    
    return types[extension.toLowerCase()] || 'application/octet-stream';
  },

  async deleteFile(filePath: string, bucket: string = 'avatars') {
    try {
      // Remove from database tracking first
      try {
        await databaseService.supabase
          .from('user_documents')
          .delete()
          .eq('file_path', filePath);
      } catch (dbError) {
        console.warn('Failed to remove file tracking from database:', dbError);
      }

      // Then remove from storage
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  async getFileInfo(url: string) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentLength = response.headers.get('content-length');
      const contentType = response.headers.get('content-type');
      
      return {
        size: contentLength ? parseInt(contentLength) : 0,
        type: contentType || 'unknown'
      };
    } catch (error) {
      console.error('Error getting file info:', error);
      return { size: 0, type: 'unknown' };
    }
  },

  async getUserDocuments(userId: string, documentType?: string) {
    try {
      let query = databaseService.supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', userId)
        .order('uploaded_at', { ascending: false });

      if (documentType) {
        query = query.eq('document_type', documentType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting user documents:', error);
      return [];
    }
  },

  async createStorageBuckets() {
    // This function documents the required storage buckets
    // These should be created manually in the Supabase Dashboard
    const buckets = [
      {
        id: 'avatars',
        name: 'avatars',
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      },
      {
        id: 'attachments', 
        name: 'attachments',
        public: false,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain']
      },
      {
        id: 'documents',
        name: 'documents', 
        public: false,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'image/jpeg', 'image/png']
      }
    ];

    console.log('Required storage buckets:', buckets);
    console.log('Please create these buckets manually in the Supabase Dashboard under Storage');
    return buckets;
  },

  // Utility function to validate image files
  validateImageFile(file: File | { uri: string; type?: string; size?: number }) {
    const errors: string[] = [];

    // Check file type
    const fileType = 'type' in file ? file.type : 'image/jpeg';
    if (!fileType?.startsWith('image/')) {
      errors.push('File must be an image');
    }

    // Check file size (max 5MB)
    const fileSize = 'size' in file ? file.size : 0;
    if (fileSize && fileSize > 5 * 1024 * 1024) {
      errors.push('File size must be less than 5MB');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};