import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
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
  const { matches, loading } = useMatches();
  const [showPaywall, setShowPaywall] = useState(false);

  const handleStartMessaging = () => {
    if (!isSubscriber) {
      setShowPaywall(true);
    } else {
      // Navigate to messages list
      console.log('Access messaging features');
    }
  };

  const renderConversation = ({ item }: { item: any }) => {
    const otherUser = user?.role === 'family' ? item.caregiver : item.family;
    
    return (
      <TouchableOpacity
        onPress={() => {
          if (!isSubscriber) {
            setShowPaywall(true);
            return;
          }
          router.push(`/chat/${item.id}`);
        }}
        style={styles.conversationItem}
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
          emergencyPhone={user?.emergency_phone}
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
        emergencyPhone={user?.emergency_phone}
      />

      {!isSubscriber && matches.length > 0 ? (
        <View style={styles.upgradePrompt}>
          <Text style={styles.upgradeTitle}>Unlock Messaging</Text>
          <Text style={styles.upgradeText}>
            Connect with caregivers and families through secure messaging. 
            Upgrade to FlashCare Plus to start conversations.
          </Text>
          <Button
            title="Upgrade Now"
            onPress={handleStartMessaging}
            size="large"
            style={styles.upgradeButton}
          />
        </View>
      ) : matches.length === 0 ? (
        <View style={styles.upgradePrompt}>
          <Text style={styles.upgradeTitle}>No conversations yet</Text>
          <Text style={styles.upgradeText}>
            Start matching with caregivers to begin conversations!
          </Text>
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