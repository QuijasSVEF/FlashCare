import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Platform 
} from 'react-native';
import { Send, Paperclip, Camera, Image as ImageIcon, Mic } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSubscription } from '../contexts/SubscriptionContext';
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
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);

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

  const pickImage = async (source: 'camera' | 'library') => {
    try {
      let result;
      
      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Camera permission is required to take photos.');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Photo library permission is required to select images.');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        onAttachment?.({
          type: 'image',
          uri: asset.uri,
          name: asset.fileName || 'image.jpg'
        });
        setShowAttachmentOptions(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
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
            onPress={() => pickImage('camera')}
          >
            <Camera size={20} color="#2563EB" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.attachmentOption}
            onPress={() => pickImage('library')}
          >
            <ImageIcon size={20} color="#2563EB" />
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