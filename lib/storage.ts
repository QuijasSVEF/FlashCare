import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface BucketConfig {
  maxSize: number;
  allowedTypes: string[];
}

const BUCKET_CONFIGS: Record<string, BucketConfig> = {
  avatars: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  },
  attachments: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  },
  documents: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'application/pdf', 'text/plain',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg', 'image/png'
    ]
  }
};

export const storageService = {
  validateFile(file: File | { type?: string; size?: number }, bucket: string = 'avatars') {
    const errors: string[] = [];
    const config = BUCKET_CONFIGS[bucket];

    if (!config) {
      errors.push('Invalid storage bucket');
      return { isValid: false, errors };
    }

    // Check file type
    const fileType = file.type || '';
    if (!config.allowedTypes.includes(fileType)) {
      errors.push(`File type ${fileType} is not allowed for ${bucket}`);
    }

    // Check file size
    const fileSize = file.size || 0;
    if (fileSize > config.maxSize) {
      const maxSizeMB = config.maxSize / (1024 * 1024);
      errors.push(`File size must be less than ${maxSizeMB}MB`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  async uploadFile(uri: string, fileName: string, bucket: string = 'avatars', userId?: string) {
    try {
      // Demo implementation
      console.log('Demo: Uploading file', { uri, fileName, bucket, userId });
      
      // Return a mock result
      return {
        path: `${userId}/${fileName}`,
        url: uri, // Just use the provided URI as the URL for demo
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
      const result = await this.uploadFile(uri, fileName, 'avatars', userId);
      
      // In a real app, we would update the user profile here
      console.log('Demo: Avatar uploaded', result);

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
        return await this.uploadFile(asset.uri, fileName, 'attachments', userId);
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
        return await this.uploadFile(asset.uri, fileName, 'attachments', userId);
      }
    } catch (error) {
      console.error('Error taking and uploading photo:', error);
      throw error;
    }
  },

  // Web-specific file upload
  async uploadFileFromInput(file: File, userId: string, type: 'avatar' | 'attachment' | 'document' = 'avatar') {
    try {
      if (Platform.OS !== 'web') {
        throw new Error('This method is only available on web');
      }

      // Determine bucket based on type
      const bucket = type === 'avatar' ? 'avatars' : 
                    type === 'attachment' ? 'attachments' : 'documents';

      // Validate file
      const validation = this.validateFile(file, bucket);
      if (!validation.isValid) {
        throw new Error(validation.errors.join('\n'));
      }

      // Create object URL for the file
      const objectUrl = URL.createObjectURL(file);
      
      if (type === 'avatar') {
        const result = await this.uploadAvatar(objectUrl, userId);
        URL.revokeObjectURL(objectUrl);
        return result;
      } else {
        const result = await this.uploadFile(objectUrl, file.name, bucket, userId);
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
      // Demo implementation
      console.log('Demo: Uploading document', { uri, fileName, userId });
      
      return {
        path: `${userId}/${fileName}`,
        url: uri,
        fileName
      };
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
      // Demo implementation
      console.log('Demo: Deleting file', { filePath, bucket });
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  async getFileInfo(url: string) {
    try {
      // Demo implementation
      return {
        size: 1024 * 1024, // 1MB
        type: 'image/jpeg'
      };
    } catch (error) {
      console.error('Error getting file info:', error);
      return { size: 0, type: 'unknown' };
    }
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