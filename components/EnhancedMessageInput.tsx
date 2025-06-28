import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Platform 
} from 'react-native';
import { Send, Paperclip, Camera, Image as ImageIcon, Mic, FileText } from 'lucide-react-native';
import { ImageUploadModal } from './ImageUploadModal';
import { storageService } from '../lib/storage';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useAuth } from '../contexts/AuthContext';
import { Colors } from '../constants/Colors';

interface EnhancedMessageInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onAttachment?: (attachment: { type: 'image' | 'file'; uri: string; name?: string }) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function EnhancedMessageInput({
  value,
  onChangeText,
  onSend,
  onAttachment,
  disabled = false,
  placeholder = "Type a message..."
}: EnhancedMessageInputProps) {
  const { isSubscriber } = useSubscription();
  const { user } = useAuth();
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSend();
    }
  };

  const handleAttachmentPress = () => {
    if (!isSubscriber) {
      Alert.alert(
        'Premium Feature',
        'File attachments are available with FlashCare Plus. Upgrade to send photos and files.',
        [{ text: 'OK' }]
      );
      return;
    }
    setShowAttachmentOptions(!showAttachmentOptions);
  };

  const handleImageUpload = () => {
    setShowAttachmentOptions(false);
    setShowImageUpload(true);
  };

  const handleImageUploaded = (imageUrl: string) => {
    onAttachment?.({
      type: 'image',
      uri: imageUrl,
      name: 'image.jpg'
    });
  };

  const handleDocumentUpload = () => {
    try {
      setShowAttachmentOptions(false);
      
      if (Platform.OS === 'web') {
        storageService.createFileInput(async (file) => {
          try {
            if (!user?.id) return;
            
            const result = await storageService.uploadFileFromInput(file, user.id, 'attachment');
            if (result) {
              onAttachment?.({
                type: 'file',
                uri: result.url,
                name: result.fileName
              });
            }
          } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to upload file');
          }
        }, 'application/pdf,text/plain,.doc,.docx');
      } else {
        Alert.alert('Document Upload', 'Document upload feature coming soon on mobile!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    }
  };

  const handleVoiceMessage = () => {
    if (!isSubscriber) {
      Alert.alert(
        'Premium Feature',
        'Voice messages are available with FlashCare Plus. Upgrade to send voice messages.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    Alert.alert('Voice Messages', 'Voice message feature coming soon!');
  };

  return (
    <View style={styles.container}>
      {showAttachmentOptions && (
        <View style={styles.attachmentOptions}>
          <TouchableOpacity 
            style={styles.attachmentOption}
            onPress={handleImageUpload}
          >
            <ImageIcon size={20} color="#2563EB" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.attachmentOption}
            onPress={handleDocumentUpload}
          >
            <FileText size={20} color="#2563EB" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.attachmentOption}
            onPress={handleVoiceMessage}
          >
            <Mic size={20} color="#2563EB" />
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.attachmentButton}
          onPress={handleAttachmentPress}
        >
          <Paperclip size={20} color="#6B7280" />
        </TouchableOpacity>
        
        <TextInput
          style={[
            styles.textInput,
            disabled && styles.textInputDisabled
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={disabled ? "Upgrade to send messages" : placeholder}
          placeholderTextColor="#9CA3AF"
          multiline
          maxLength={500}
          editable={!disabled}
        />
        
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!value.trim() || disabled) && styles.sendButtonDisabled
          ]}
          onPress={handleSend}
          disabled={!value.trim() || disabled}
        >
          <Send size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ImageUploadModal
        visible={showImageUpload}
        onClose={() => setShowImageUpload(false)}
        onImageUploaded={handleImageUploaded}
        userId={user?.id || ''}
        type="attachment"
        title="Send Image"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  attachmentOptions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  attachmentOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  attachmentButton: {
    width: 40,
    height: 40,
    borderRadius: 20, 
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: Colors.surface,
  },
  textInputDisabled: {
    backgroundColor: Colors.gray[100],
    color: Colors.gray[400],
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.gray[300],
  },
});