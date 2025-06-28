import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Alert 
} from 'react-native';
import { Camera, Edit3 } from 'lucide-react-native';
import { ImageUploadModal } from './ImageUploadModal';
import { Colors } from '../constants/Colors';

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl?: string;
  onAvatarUpdated: (newAvatarUrl: string) => void;
  size?: number;
  editable?: boolean;
}

export function AvatarUpload({ 
  userId, 
  currentAvatarUrl, 
  onAvatarUpdated, 
  size = 100,
  editable = true 
}: AvatarUploadProps) {
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    onAvatarUpdated(newAvatarUrl);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.avatarContainer, { width: size, height: size }]}>
        {currentAvatarUrl ? (
          <Image 
            source={{ uri: currentAvatarUrl }} 
            style={[styles.avatar, { width: size, height: size }]} 
          />
        ) : (
          <View style={[styles.avatarPlaceholder, { width: size, height: size }]}>
            <Camera size={size * 0.3} color={Colors.text.secondary} />
          </View>
        )}
        
        {editable && (
          <TouchableOpacity 
            style={[styles.editButton, { 
              width: size * 0.3, 
              height: size * 0.3,
              borderRadius: size * 0.15 
            }]}
            onPress={() => setShowImageUpload(true)}
          >
            <Edit3 size={size * 0.15} color={Colors.primary[500]} />
          </TouchableOpacity>
        )}
      </View>

      <ImageUploadModal
        visible={showImageUpload}
        onClose={() => setShowImageUpload(false)}
        onImageUploaded={handleAvatarUpdate}
        userId={userId}
        type="avatar"
        title="Update Profile Photo"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.background,
  },
  avatarPlaceholder: {
    borderRadius: 50,
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.gray[200],
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.gray[200],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});