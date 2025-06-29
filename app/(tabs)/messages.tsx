import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal } from 'react-native';
import { router } from 'expo-router';
import { MessageCircle } from 'lucide-react-native';
import { Card } from '../../components/ui/Card';
import { PaywallModal } from '../../components/PaywallModal';
import { EmergencyButton } from '../../components/EmergencyButton';
import { AppHeader } from '../../components/AppHeader';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useMatches } from '../../hooks/useMatches';
import { Button } from '../../components/ui/Button';

export default function MessagesScreen() {
  const { user } = useAuth();
  const { isSubscriber } = useSubscription();
  const { matches, loading, error } = useMatches();
  const [showPaywall, setShowPaywall] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [showChatModal, setShowChatModal] = useState(false);

  const handleStartMessaging = () => {
    if (!isSubscriber) {
      setShowPaywall(true);
    } else {
      // For demo, show first match
      if (matches.length > 0) {
        setSelectedMatch(matches[0]);
        setShowChatModal(true);
      }
    }
  };

  const handleOpenChat = (match: any) => {
    if (!isSubscriber) {
      setShowPaywall(true);
      return;
    }
    setSelectedMatch(match);
    setShowChatModal(true);
  };

  const renderConversation = ({ item }: { item: any }) => {
    const otherUser = user?.role === 'family' ? item.caregiver : item.family;
    
    return (
      <TouchableOpacity
        onPress={() => handleOpenChat(item)}
        style={styles.conversationItem}
        activeOpacity={0.7}
      >
        <Card>
          <View style={styles.conversationContent}>
            <Image
              source={{ uri: otherUser.avatar_url || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400' }}
              style={styles.avatar}
            />
            
            <View style={styles.conversationInfo}>
              <Text style={styles.conversationName}>{otherUser.name}</Text>
              <Text style={styles.conversationPreview}>
                {isSubscriber ? 'Tap to open chat' : 'Upgrade to message'}
              </Text>
            </View>
            
            <View style={styles.conversationActions}>
              <MessageCircle size={20} color="#2563EB" />
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <AppHeader
          title="Messages"
        />
        
        <View style={styles.upgradePrompt}>
          <Text style={styles.upgradeTitle}>Loading conversations...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Messages"
      />

      {matches.length === 0 ? (
        <View style={styles.upgradePrompt}>
          <Text style={styles.upgradeTitle}>No conversations yet</Text>
          <Text style={styles.upgradeText}>
            Start matching with caregivers to begin conversations!
          </Text>
          <Button
            title="Find Matches"
            onPress={() => router.push('/(tabs)')}
            size="large"
            style={styles.upgradeButton}
          />
        </View>
      ) : (
        <FlatList
          data={matches}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.conversationsList}
          showsVerticalScrollIndicator={false}
        />
      )}

      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature="messaging"
      />

      {selectedMatch && (
        <Modal
          visible={showChatModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={styles.chatModal}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatTitle}>
                Chat with {user?.role === 'family' ? selectedMatch.caregiver.name : selectedMatch.family.name}
              </Text>
              <TouchableOpacity onPress={() => setShowChatModal(false)}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.chatPlaceholder}>Demo chat interface would go here</Text>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  upgradePrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  upgradeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  upgradeText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  upgradeButton: {
    width: '100%',
  },
  conversationsList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  conversationItem: {
    marginBottom: 0,
  },
  conversationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  conversationPreview: {
    fontSize: 16,
    color: '#6B7280',
  },
  conversationActions: {
    padding: 8,
  },
  chatModal: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
  },
  chatPlaceholder: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    color: '#6B7280',
  },
});