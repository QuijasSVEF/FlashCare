import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal } from 'react-native';
import { router } from 'expo-router';
import { MessageCircle } from 'lucide-react-native';
import { Card } from '../../components/ui/Card';
import { PaywallModal } from '../../components/PaywallModal';
import { EmergencyButton } from '../../components/EmergencyButton';
import { AppHeader } from '../../components/AppHeader';
import { DetailedProfileModal } from '../../components/DetailedProfileModal';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useMatches } from '../../hooks/useMatches';
import { Button } from '../../components/ui/Button';

export default function MessagesScreen() {
  const { user } = useAuth();
  const { isSubscriber } = useSubscription();
  const { matches, loading, error } = useMatches();
  const [showPaywall, setShowPaywall] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);

  const handleStartMessaging = () => {
    if (!isSubscriber) {
      setShowPaywall(true);
    } else {
      // For demo, show first match
      if (matches.length > 0) {
        router.push(`/chat/${matches[0].id}`);
      }
    }
  };

  const handleOpenChat = (match: any) => {
    if (!isSubscriber) {
      setShowPaywall(true);
    } else {
      router.push(`/chat/${match.id}`);
    }
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
            <TouchableOpacity onPress={() => {
              setSelectedProfile(otherUser);
              setShowProfileModal(true);
            }}>
              <Image
                source={{ uri: otherUser.avatar_url || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                style={styles.avatar}
              />
            </TouchableOpacity>
            
            <View style={styles.conversationInfo}>
              <Text style={styles.conversationName}>{otherUser.name}</Text>
              <Text style={styles.conversationPreview}>
                {isSubscriber ? 'Tap to start chatting!' : 'Upgrade to message'}
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

      {selectedProfile && (
        <DetailedProfileModal
          visible={showProfileModal}
          onClose={() => {
            setShowProfileModal(false);
            setSelectedProfile(null);
          }}
          user={selectedProfile}
          onStartConversation={() => {
            setShowProfileModal(false);
            if (!isSubscriber) {
              setShowPaywall(true);
            } else {
              // Navigate to chat
              const matchId = matches.find(m => 
                (user?.role === 'family' ? m.caregiver.id : m.family.id) === selectedProfile.id
              )?.id;
              if (matchId) {
                router.push(`/chat/${matchId}`);
              }
            }
          }}
        />
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
});