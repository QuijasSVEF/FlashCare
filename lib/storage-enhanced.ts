import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { databaseService } from './database';

export interface FileUploadResult {
  path: string;
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

export interface DocumentRecord {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  file_path: string;
  file_type?: string;
  file_size?: number;
  document_type?: 'avatar' | 'attachment' | 'document' | 'certification';
  uploaded_at: string;
  created_at: string;
}

export const storageService = {
  /**
   * Upload a file to a specific bucket with automatic document tracking
   */
  async uploadFile(
    uri: string, 
    fileName: string, 
    bucket: 'avatars' | 'attachments' | 'documents' = 'attachments',
    documentType?: 'avatar' | 'attachment' | 'document' | 'certification'
  ): Promise<FileUploadResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let fileData: Blob;
      let fileSize = 0;
      
      if (Platform.OS === 'web') {
        // For web, convert URI to blob
        const response = await fetch(uri);
        fileData = await response.blob();
        fileSize = fileData.size;
      } else {
        // For mobile, read file info and convert to blob
        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (!fileInfo.exists) throw new Error('File does not exist');
        
        fileSize = fileInfo.size || 0;
        
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        // Convert base64 to blob
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        fileData = new Blob([byteArray]);
      }

      const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2);
      const filePath = `${user.id}/${timestamp}-${randomId}.${fileExt}`;

      // Upload to Supabase Storage
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

      const result: FileUploadResult = {
        path: filePath,
        url: urlData.publicUrl,
        fileName,
        fileSize,
        fileType: this.getContentType(fileExt)
      };

      // Track in user_documents table
      await this.trackDocument({
        user_id: user.id,
        file_name: fileName,
        file_url: result.url,
        file_path: result.path,
        file_type: result.fileType,
        file_size: fileSize,
        document_type: documentType || this.inferDocumentType(bucket, fileName)
      });

      return result;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  /**
   * Delete a file from storage and remove tracking record
   */
  async deleteFile(filePath: string, bucket: 'avatars' | 'attachments' | 'documents' = 'attachments'): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (storageError) throw storageError;

      // Remove tracking record
      const { error: dbError } = await supabase
        .from('user_documents')
        .delete()
        .eq('file_path', filePath)
        .eq('user_id', user.id);

      if (dbError) throw dbError;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  /**
   * Get user's documents with filtering options
   */
  async getUserDocuments(
    documentType?: 'avatar' | 'attachment' | 'document' | 'certification'
  ): Promise<DocumentRecord[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false });

      if (documentType) {
        query = query.eq('document_type', documentType);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error getting user documents:', error);
      throw error;
    }
  },

  /**
   * Update user's avatar
   */
  async updateAvatar(uri: string, fileName: string): Promise<FileUploadResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Delete existing avatar if it exists
      const existingAvatars = await this.getUserDocuments('avatar');
      for (const avatar of existingAvatars) {
        await this.deleteFile(avatar.file_path, 'avatars');
      }

      // Upload new avatar
      const result = await this.uploadFile(uri, fileName, 'avatars', 'avatar');

      // Update user profile with new avatar URL
      await databaseService.updateUser(user.id, {
        avatar_url: result.url
      });

      return result;
    } catch (error) {
      console.error('Error updating avatar:', error);
      throw error;
    }
  },

  /**
   * Get file info from URL
   */
  async getFileInfo(url: string): Promise<{ size: number; type: string }> {
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

  /**
   * Track document in database
   */
  async trackDocument(documentData: Omit<DocumentRecord, 'id' | 'uploaded_at' | 'created_at'>): Promise<void> {
    const { error } = await supabase
      .from('user_documents')
      .insert(documentData);

    if (error) throw error;
  },

  /**
   * Get content type from file extension
   */
  getContentType(extension: string): string {
    const types: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'txt': 'text/plain',
      'csv': 'text/csv',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'xls': 'application/vnd.ms-excel'
    };
    
    return types[extension.toLowerCase()] || 'application/octet-stream';
  },

  /**
   * Infer document type from bucket and filename
   */
  inferDocumentType(bucket: string, fileName: string): 'avatar' | 'attachment' | 'document' | 'certification' {
    if (bucket === 'avatars') return 'avatar';
    if (bucket === 'documents') {
      if (fileName.toLowerCase().includes('cert') || fileName.toLowerCase().includes('license')) {
        return 'certification';
      }
      return 'document';
    }
    return 'attachment';
  },

  /**
   * Validate file before upload
   */
  validateFile(fileName: string, fileSize: number, bucket: 'avatars' | 'attachments' | 'documents'): void {
    const maxSizes = {
      avatars: 5 * 1024 * 1024, // 5MB
      attachments: 10 * 1024 * 1024, // 10MB
      documents: 10 * 1024 * 1024 // 10MB
    };

    const allowedTypes = {
      avatars: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      attachments: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'txt'],
      documents: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png']
    };

    const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
    
    if (fileSize > maxSizes[bucket]) {
      throw new Error(`File size exceeds ${maxSizes[bucket] / (1024 * 1024)}MB limit`);
    }

    if (!allowedTypes[bucket].includes(fileExt)) {
      throw new Error(`File type .${fileExt} not allowed for ${bucket}`);
    }
  }
};