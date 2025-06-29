import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Phone, Video } from 'lucide-react-native';
import { EnhancedMessageInput } from '../../components/EnhancedMessageInput';
import { MessageAttachment } from '../../components/MessageAttachment';
import { TypingIndicator } from '../../components/TypingIndicator';
import { VideoCallModal } from '../../components/VideoCallModal';
import { useAuth } from '../contexts/AuthContext';
import { useRealTimeMessages } from '../hooks/useRealTimeMessages';
import { Colors } from '../constants/Colors';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { 
    messages, 
    loading, 
    error, 
    sendMessage, 
    isTyping,
    simulateTyping
  } = useRealTimeMessages(id as string);
  
  const [messageText, setMessageText] = useState('');
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [otherUser, setOtherUser] = useState<any>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Get match details to determine the other user
    const getMatchDetails = async () => {
      try {
        // In a real app, fetch match details from the database
        // For demo, we'll simulate this
        setTimeout(() => {
          const mockOtherUser = {
            id: user?.role === 'family' ? 'caregiver-1' : 'family-1',
            name: user?.role === 'family' ? 'Sarah Johnson' : 'The Smiths',
            avatar_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
          };
          setOtherUser(mockOtherUser);
        }, 500);
      } catch (error) {
        console.error('Error getting match details:', error);
      }
    };

    if (id) {
      getMatchDetails();
    }
  }, [id, user]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !user?.id) return;
    
    try {
      await sendMessage(messageText, user.id);
      setMessageText('');
      
      // Simulate typing response after a short delay
      setTimeout(() => {
        simulateTyping(3000);
        
        // Then simulate a response message
        setTimeout(async () => {
          if (user?.role === 'family') {
            await sendMessage("I'd be happy to discuss the care position. When would be a good time to meet?", 'caregiver-1');
          } else {
            await sendMessage("Thanks for your message. I'm looking forward to learning more about the care needs.", 'family-1');
          }
        }, 3000);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleAttachment = (attachment: any) => {
    console.log('Attachment:', attachment);
    // In a real app, upload the attachment and send a message with the attachment
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isCurrentUser = item.sender_id === user?.id;
    
    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.sentMessage : styles.receivedMessage
      ]}>
        <View style={[
          styles.messageBubble,
          isCurrentUser ? styles.sentBubble : styles.receivedBubble
        ]}>
          {item.attachment && (
            <MessageAttachment
              type={item.attachment.type}
              uri={item.attachment.uri}
              name={item.attachment.name}
              onPress={() => console.log('View attachment')}
            />
          )}
          
          <Text style={[
            styles.messageText,
            isCurrentUser ? styles.sentText : styles.receivedText
          ]}>
            {item.body}
          </Text>
          
          <Text style={[
            styles.messageTime,
            isCurrentUser ? styles.sentTime : styles.receivedTime
          ]}>
            {formatTime(item.sent_at)}
          </Text>
        </View>
      </View>
    );
  };

  if (loading && messages.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chat</Text>
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary[500]} />
          <Text style={styles.loadingText}>Loading conversation...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chat</Text>
        </View>
        
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load messages. Please try again.</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>
          {otherUser?.name || 'Chat'}
        </Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowVideoCall(true)}
          >
            <Video size={20} color={Colors.primary[500]} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.headerButton}>
            <Phone size={20} color={Colors.primary[500]} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No messages yet. Start the conversation!
            </Text>
          </View>
        }
      />

      <TypingIndicator 
        visible={isTyping} 
        userName={otherUser?.name || 'Someone'} 
      />

      <EnhancedMessageInput
        value={messageText}
        onChangeText={setMessageText}
        onSend={handleSendMessage}
        onAttachment={handleAttachment}
        placeholder="Type a message..."
      />

      <VideoCallModal
        visible={showVideoCall}
        onClose={() => setShowVideoCall(false)}
        otherUserName={otherUser?.name || 'User'}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.primary[50],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
  },
  messagesList: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  messageContainer: {
    marginBottom: 16,
    flexDirection: 'row',
  },
  sentMessage: {
    justifyContent: 'flex-end',
  },
  receivedMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  sentBubble: {
    backgroundColor: Colors.primary[500],
    borderTopRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  sentText: {
    color: Colors.text.inverse,
  },
  receivedText: {
    color: Colors.text.primary,
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  sentTime: {
    color: Colors.text.inverse + '99',
  },
  receivedTime: {
    color: Colors.text.tertiary,
  },
});