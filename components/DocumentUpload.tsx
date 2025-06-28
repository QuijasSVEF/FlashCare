import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  Alert,
  Platform 
} from 'react-native';
import { FileText, Upload, Trash2, Download, Eye } from 'lucide-react-native';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { storageService } from '../lib/storage';
import { databaseService } from '../lib/database';
import { Colors } from '../constants/Colors';

interface DocumentUploadProps {
  userId: string;
  documentType?: string;
  title?: string;
  allowedTypes?: string[];
  maxFiles?: number;
}

interface Document {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
  document_type: string;
}

export function DocumentUpload({ 
  userId, 
  documentType = 'document',
  title = 'Documents',
  allowedTypes = ['application/pdf', 'application/msword', 'text/plain'],
  maxFiles = 10
}: DocumentUploadProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [userId, documentType]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const docs = await databaseService.getUserDocuments(userId, documentType);
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = () => {
    if (documents.length >= maxFiles) {
      Alert.alert('Limit Reached', `You can only upload up to ${maxFiles} documents.`);
      return;
    }

    if (Platform.OS === 'web') {
      const acceptTypes = allowedTypes.join(',');
      storageService.createFileInput(async (file) => {
        try {
          setUploading(true);
          
          // Validate file type
          const validation = storageService.validateFile(file, 'documents');
          if (!validation.isValid) {
            Alert.alert('Invalid File', validation.errors.join('\n'));
            return;
          }

          const result = await storageService.uploadFileFromInput(file, userId, 'document');
          if (result) {
            // Create document record
            await databaseService.createUserDocument({
              user_id: userId,
              file_name: result.fileName,
              file_url: result.url,
              file_path: result.path,
              file_type: file.type,
              file_size: file.size,
              document_type: documentType,
            });

            await loadDocuments();
            Alert.alert('Success', 'Document uploaded successfully!');
          }
        } catch (error: any) {
          Alert.alert('Error', error.message || 'Failed to upload document');
        } finally {
          setUploading(false);
        }
      }, acceptTypes);
    } else {
      Alert.alert('Document Upload', 'Document upload is currently available on web only.');
    }
  };

  const handleDelete = async (document: Document) => {
    Alert.alert(
      'Delete Document',
      `Are you sure you want to delete "${document.file_name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await storageService.deleteFile(document.file_path, 'documents');
              await databaseService.deleteUserDocument(document.id);
              await loadDocuments();
              Alert.alert('Success', 'Document deleted successfully!');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete document');
            }
          }
        }
      ]
    );
  };

  const handleView = (document: Document) => {
    if (Platform.OS === 'web') {
      window.open(document.file_url, '_blank');
    } else {
      Alert.alert('View Document', 'Document viewing feature coming soon on mobile!');
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word')) return '📝';
    if (fileType.includes('text')) return '📃';
    if (fileType.includes('image')) return '🖼️';
    return '📁';
  };

  const renderDocument = ({ item }: { item: Document }) => (
    <Card style={styles.documentCard}>
      <View style={styles.documentHeader}>
        <View style={styles.documentInfo}>
          <Text style={styles.documentIcon}>{getFileIcon(item.file_type)}</Text>
          <View style={styles.documentDetails}>
            <Text style={styles.documentName} numberOfLines={1}>
              {item.file_name}
            </Text>
            <Text style={styles.documentMeta}>
              {formatFileSize(item.file_size)} • {new Date(item.uploaded_at).toLocaleDateString()}
            </Text>
          </View>
        </View>
        
        <View style={styles.documentActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleView(item)}
          >
            <Eye size={16} color={Colors.primary[500]} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDelete(item)}
          >
            <Trash2 size={16} color={Colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>
          {documents.length} of {maxFiles} documents
        </Text>
      </View>

      <Button
        title={uploading ? "Uploading..." : "Upload Document"}
        onPress={handleUpload}
        disabled={uploading || documents.length >= maxFiles}
        style={styles.uploadButton}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading documents...</Text>
        </View>
      ) : (
        <FlatList
          data={documents}
          renderItem={renderDocument}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <FileText size={48} color={Colors.gray[300]} />
              <Text style={styles.emptyTitle}>No documents uploaded</Text>
              <Text style={styles.emptyText}>
                Upload documents to keep them organized and accessible.
              </Text>
            </View>
          }
        />
      )}

      <View style={styles.guidelines}>
        <Text style={styles.guidelinesTitle}>Upload Guidelines:</Text>
        <Text style={styles.guidelinesText}>
          • Maximum file size: 10MB{'\n'}
          • Supported formats: PDF, DOC, DOCX, TXT{'\n'}
          • Maximum {maxFiles} documents per category
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  uploadButton: {
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  documentCard: {
    marginBottom: 12,
    padding: 16,
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  documentIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  documentDetails: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  documentMeta: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  documentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.gray[100],
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  guidelines: {
    backgroundColor: Colors.gray[50],
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  guidelinesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  guidelinesText: {
    fontSize: 12,
    color: Colors.text.secondary,
    lineHeight: 16,
  },
});