import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Image,
  Alert
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Send, Phone, Video } from 'lucide-react-native';
import { AppHeader } from '../../components/AppHeader';
import { EnhancedMessageInput } from '../../components/EnhancedMessageInput';
import { TypingIndicator } from '../../components/TypingIndicator';
import { MessageAttachment } from '../../components/MessageAttachment';
import { VideoCallModal } from '../../components/VideoCallModal';
import { useAuth } from '../../contexts/AuthContext';
import { useMessages } from '../../hooks/useMessages';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { PaywallModal } from '../../components/PaywallModal';
import { databaseService } from '../../lib/database';

export default function ChatScreen() {
  const { id: matchId } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { isSubscriber } = useSubscription();
  const { messages, loading, sendMessage, error } = useMessages(matchId);
  const [messageText, setMessageText] = useState('');
  const [showPaywall, setShowPaywall] = useState(false);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (matchId && user?.id) {
      loadMatchData();
    }
  }, [matchId, user?.id]);

  const loadMatchData = async () => {
    try {
      const matches = await databaseService.getUserMatches(user!.id);
      const currentMatch = matches.find(m => m.id === matchId);
      
      if (currentMatch) {
        const other = user?.role === 'family' ? currentMatch.caregiver : currentMatch.family;
        setOtherUser(other);
      }
    } catch (error) {
      console.error('Error loading match data:', error);
    }
  };

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !user?.id) return;

    if (!isSubscriber) {
      setShowPaywall(true);
      return;
    }

    try {
      await sendMessage(messageText.trim(), user.id);
      setMessageText('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const handleAttachment = async (attachment: { type: 'image' | 'file'; uri: string; name?: string }) => {
    if (!isSubscriber) {
      setShowPaywall(true);
      return;
    }

    try {
      // In a real app, you would upload the file to storage first
      // For now, we'll just send a message with attachment info
      const attachmentMessage = `[${attachment.type.toUpperCase()}] ${attachment.name || 'Attachment'}`;
      await sendMessage(attachmentMessage, user!.id);
    } catch (error) {
      Alert.alert('Error', 'Failed to send attachment. Please try again.');
    }
  };

  const handleVideoCall = () => {
    if (!isSubscriber) {
      setShowPaywall(true);
      return;
    }
    setShowVideoCall(true);
  };

  const handlePhoneCall = () => {
    Alert.alert('Phone Call', 'Phone calling feature coming soon!');
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isOwnMessage = item.sender_id === user?.id;
    
    return (
      <View style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      ]}>
        <Text style={[
          styles.messageText,
          isOwnMessage ? styles.ownMessageText : styles.otherMessageText
        ]}>
          {item.body}
        </Text>
        <Text style={[
          styles.messageTime,
          isOwnMessage ? styles.ownMessageTime : styles.otherMessageTime
        ]}>
          {new Date(item.sent_at).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Failed to load messages</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => window.location.reload()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!otherUser) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Loading conversation...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <AppHeader
        title={otherUser.name}
        subtitle={otherUser.role === 'caregiver' ? 'Caregiver' : 'Family Member'}
        showEmergencyButton={false}
        rightComponent={
          <View style={styles.chatActions}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePhoneCall} style={styles.actionButton}>
              <Phone size={20} color="#2563EB" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleVideoCall} style={styles.actionButton}>
              <Video size={20} color="#2563EB" />
            </TouchableOpacity>
          </View>
        }
      />

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyMessages}>
            <Text style={styles.emptyTitle}>Start the conversation!</Text>
            <Text style={styles.emptyText}>
              Send a message to {otherUser.name} to get started.
            </Text>
          </View>
        }
      />

      <TypingIndicator visible={isTyping} userName={otherUser?.name} />

      <EnhancedMessageInput
        value={messageText}
        onChangeText={setMessageText}
        onSend={handleSendMessage}
        onAttachment={handleAttachment}
        disabled={!isSubscriber}
        placeholder={isSubscriber ? "Type a message..." : "Upgrade to send messages"}
      />

      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature="messaging and video calls"
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
    backgroundColor: '#F9FAFB',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  chatActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  actionButton: {
    padding: 8,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 100,
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 16,
    padding: 12,
    borderRadius: 16,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2563EB',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  ownMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#111827',
  },
  messageTime: {
    fontSize: 12,
  },
  ownMessageTime: {
    color: '#DBEAFE',
    textAlign: 'right',
  },
  otherMessageTime: {
    color: '#9CA3AF',
  },
  emptyMessages: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});