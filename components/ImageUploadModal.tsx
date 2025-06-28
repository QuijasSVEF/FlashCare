import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Platform,
  ActivityIndicator
} from 'react-native';
import { X, Camera, Image as ImageIcon, Upload } from 'lucide-react-native';
import { Button } from './ui/Button';
import { storageService } from '../lib/storage';
import { Colors } from '../constants/Colors';

interface ImageUploadModalProps {
  visible: boolean;
  onClose: () => void;
  onImageUploaded: (imageUrl: string) => void;
  userId: string;
  type?: 'avatar' | 'attachment';
  title?: string;
}

export function ImageUploadModal({ 
  visible, 
  onClose, 
  onImageUploaded, 
  userId,
  type = 'avatar',
  title 
}: ImageUploadModalProps) {
  const [uploading, setUploading] = useState(false);

  const handleTakePhoto = async () => {
    try {
      setUploading(true);
      const result = await storageService.takeAndUploadPhoto(userId, type);
      
      if (result) {
        onImageUploaded(result.url);
        onClose();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to take photo');
    } finally {
      setUploading(false);
    }
  };

  const handlePickImage = async () => {
    try {
      setUploading(true);
      const result = await storageService.pickAndUploadImage(userId, type);
      
      if (result) {
        onImageUploaded(result.url);
        onClose();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to pick image');
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = () => {
    if (Platform.OS !== 'web') {
      handlePickImage();
      return;
    }

    try {
      setUploading(true);
      storageService.createFileInput(async (file) => {
        try {
          const validation = storageService.validateImageFile(file);
          if (!validation.isValid) {
            Alert.alert('Invalid File', validation.errors.join('\n'));
            return;
          }

          const result = await storageService.uploadFileFromInput(file, userId, type);
          if (result) {
            onImageUploaded(result.url);
            onClose();
          }
        } catch (error: any) {
          Alert.alert('Error', error.message || 'Failed to upload file');
        } finally {
          setUploading(false);
        }
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to open file picker');
      setUploading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {title || (type === 'avatar' ? 'Update Profile Photo' : 'Upload Image')}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.subtitle}>
            Choose how you'd like to {type === 'avatar' ? 'update your profile photo' : 'add an image'}
          </Text>

          <View style={styles.options}>
            {Platform.OS !== 'web' && (
              <TouchableOpacity
                style={[styles.option, uploading && styles.optionDisabled]}
                onPress={handleTakePhoto}
                disabled={uploading}
              >
                <View style={[styles.optionIcon, { backgroundColor: Colors.primary[50] }]}>
                  <Camera size={32} color={Colors.primary[500]} />
                </View>
                <Text style={styles.optionTitle}>Take Photo</Text>
                <Text style={styles.optionDescription}>
                  Use your camera to take a new photo
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.option, uploading && styles.optionDisabled]}
              onPress={handlePickImage}
              disabled={uploading}
            >
              <View style={[styles.optionIcon, { backgroundColor: Colors.secondary[50] }]}>
                <ImageIcon size={32} color={Colors.secondary[500]} />
              </View>
              <Text style={styles.optionTitle}>Choose from Gallery</Text>
              <Text style={styles.optionDescription}>
                Select an existing photo from your device
              </Text>
            </TouchableOpacity>

            {Platform.OS === 'web' && (
              <TouchableOpacity
                style={[styles.option, uploading && styles.optionDisabled]}
                onPress={handleFileUpload}
                disabled={uploading}
              >
                <View style={[styles.optionIcon, { backgroundColor: Colors.accent[50] }]}>
                  <Upload size={32} color={Colors.accent[500]} />
                </View>
                <Text style={styles.optionTitle}>Upload File</Text>
                <Text style={styles.optionDescription}>
                  Choose a file from your computer
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {uploading && (
            <View style={styles.uploadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary[500]} />
              <Text style={styles.uploadingText}>Uploading...</Text>
            </View>
          )}

          <View style={styles.guidelines}>
            <Text style={styles.guidelinesTitle}>Guidelines:</Text>
            <Text style={styles.guidelinesText}>
              • Maximum file size: 5MB{'\n'}
              • Supported formats: JPG, PNG, GIF, WebP{'\n'}
              • {type === 'avatar' ? 'Square images work best for profile photos' : 'High quality images recommended'}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  options: {
    gap: 16,
    marginBottom: 32,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
    flex: 1,
  },
  optionDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
  },
  uploadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  uploadingText: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 12,
  },
  guidelines: {
    backgroundColor: Colors.gray[50],
    padding: 16,
    borderRadius: 12,
    marginTop: 'auto',
    marginBottom: 20,
  },
  guidelinesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  guidelinesText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});