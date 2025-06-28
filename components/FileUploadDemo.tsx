import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Upload, Image as ImageIcon, FileText } from 'lucide-react-native';
import { Card } from './ui/Card';
import { AvatarUpload } from './AvatarUpload';
import { DocumentUpload } from './DocumentUpload';
import { ImageUploadModal } from './ImageUploadModal';
import { Button } from './ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { Colors } from '../constants/Colors';

export function FileUploadDemo() {
  const { user } = useAuth();
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Please sign in to test file uploads</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>File Upload System Demo</Text>
      <Text style={styles.subtitle}>
        Test all file upload features in your FlashCare app
      </Text>

      {/* Avatar Upload Demo */}
      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <ImageIcon size={24} color={Colors.primary[500]} />
          <Text style={styles.sectionTitle}>Profile Photo Upload</Text>
        </View>
        <Text style={styles.sectionDescription}>
          Upload and manage your profile avatar image
        </Text>
        
        <View style={styles.demoContent}>
          <AvatarUpload
            userId={user.id}
            currentAvatarUrl={avatarUrl}
            onAvatarUpdated={setAvatarUrl}
            size={120}
          />
        </View>
      </Card>

      {/* Message Attachment Demo */}
      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <Upload size={24} color={Colors.secondary[500]} />
          <Text style={styles.sectionTitle}>Message Attachments</Text>
        </View>
        <Text style={styles.sectionDescription}>
          Send images and files in chat conversations
        </Text>
        
        <Button
          title="Test Image Upload"
          onPress={() => setShowImageUpload(true)}
          style={styles.testButton}
        />
      </Card>

      {/* Document Management Demo */}
      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <FileText size={24} color={Colors.accent[500]} />
          <Text style={styles.sectionTitle}>Document Management</Text>
        </View>
        <Text style={styles.sectionDescription}>
          Upload and organize important documents
        </Text>
        
        <DocumentUpload
          userId={user.id}
          documentType="document"
          title="My Documents"
          maxFiles={5}
        />
      </Card>

      {/* Features Overview */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>✅ Available Features</Text>
        <View style={styles.featuresList}>
          <Text style={styles.featureItem}>🖼️ Profile photo upload and management</Text>
          <Text style={styles.featureItem}>📎 Message attachments (images and files)</Text>
          <Text style={styles.featureItem}>📄 Document storage and organization</Text>
          <Text style={styles.featureItem}>🔒 User-based access controls</Text>
          <Text style={styles.featureItem}>📱 Multi-platform support (web and mobile)</Text>
          <Text style={styles.featureItem}>🗂️ Automatic file organization</Text>
        </View>
      </Card>

      <ImageUploadModal
        visible={showImageUpload}
        onClose={() => setShowImageUpload(false)}
        onImageUploaded={(url) => console.log('Image uploaded:', url)}
        userId={user.id}
        type="attachment"
        title="Test Image Upload"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginLeft: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  demoContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  testButton: {
    alignSelf: 'flex-start',
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
    marginTop: 40,
  },
});