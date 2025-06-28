import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FileText, Download, Eye } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

interface MessageAttachmentProps {
  type: 'image' | 'file';
  uri: string;
  name?: string;
  size?: number;
  onPress?: () => void;
  onDownload?: () => void;
}

export function MessageAttachment({
  type,
  uri,
  name,
  size,
  onPress,
  onDownload
}: MessageAttachmentProps) {
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  if (type === 'image') {
    return (
      <TouchableOpacity style={styles.imageContainer} onPress={onPress}>
        <Image source={{ uri }} style={styles.image} />
        <View style={styles.imageOverlay}>
          <Eye size={20} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.fileContainer} onPress={onPress}>
      <View style={styles.fileIcon}>
        <FileText size={24} color="#2563EB" />
      </View>
      
      <View style={styles.fileInfo}>
        <Text style={styles.fileName} numberOfLines={1}>
          {name || 'Unknown file'}
        </Text>
        {size && (
          <Text style={styles.fileSize}>{formatFileSize(size)}</Text>
        )}
      </View>
      
      {onDownload && (
        <TouchableOpacity style={styles.downloadButton} onPress={onDownload}>
          <Download size={20} color="#6B7280" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 4,
  },
  image: {
    width: 200,
    height: 150,
    borderRadius: 12,
  },
  imageOverlay: {
    position: 'absolute',
    top: 8,
    right: 8, 
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center', 
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    marginVertical: 4,
    maxWidth: 250,
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  downloadButton: {
    padding: 8,
  },
});