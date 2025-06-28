import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

export const storageService = {
  async uploadFile(uri: string, fileName: string, bucket: string = 'attachments') {
    try {
      let fileData;
      
      if (Platform.OS === 'web') {
        // For web, convert URI to blob
        const response = await fetch(uri);
        fileData = await response.blob();
      } else {
        // For mobile, read file as base64
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

      const fileExt = fileName.split('.').pop();
      const filePath = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, fileData, {
          contentType: this.getContentType(fileExt || ''),
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

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

  async deleteFile(filePath: string, bucket: string = 'attachments') {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  getContentType(extension: string): string {
    const types: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'txt': 'text/plain',
    };
    
    return types[extension.toLowerCase()] || 'application/octet-stream';
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
  }
};