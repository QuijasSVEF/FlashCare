import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { MessageCircle, Star, Clock } from 'lucide-react-native';
import { Card } from '../../components/ui/Card';
import { EmergencyButton } from '../../components/EmergencyButton';
import { AppHeader } from '../../components/AppHeader';
import { PaywallModal } from '../../components/PaywallModal';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useMatches } from '../../hooks/useMatches';

export default function MatchesScreen() {
  const { user } = useAuth();
  const { isSubscriber } = useSubscription();
  const { matches, loading, error } = useMatches();
  const [showPaywall, setShowPaywall] = useState(false);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const renderMatch = ({ item }: { item: any }) => {
    const otherUser = user?.role === 'family' ? item.caregiver : item.family;
    const isCaregiver = user?.role === 'caregiver';

    return (
      <TouchableOpacity
        onPress={() => {
          if (!isSubscriber) {
            setShowPaywall(true);
            return;
          }
          router.push(`/chat/${item.id}`);
        }}
        style={styles.matchItem}
      >
        <Card>
          <View style={styles.matchContent}>
            <Image
              source={{ uri: otherUser.avatar_url || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400' }}
              style={styles.avatar}
            />
            
            <View style={styles.matchInfo}>
              <View style={styles.matchHeader}>
                <Text style={styles.matchName}>{otherUser.name}</Text>
                {false && ( // Unread count - implement when adding message status
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>0</Text>
                  </View>
                )}
              </View>
              
              {isCaregiver ? (
                <Text style={styles.matchLocation}>{otherUser.location}</Text>
              ) : (
                <View style={styles.caregiverDetails}>
                  <Star size={14} color="#F59E0B" />
                  <Text style={styles.rating}>4.8</Text>
                  <Clock size={14} color="#6B7280" />
                  <Text style={styles.experience}>5+ years</Text>
                </View>
              )}
              
              <Text style={styles.lastMessage} numberOfLines={1}>
                {isSubscriber ? 'Tap to start chatting!' : 'Upgrade to message'}
              </Text>
            </View>
            
            <View style={styles.matchActions}>
              <Text style={styles.timeStamp}>{formatTimeAgo(item.created_at)}</Text>
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
          title="Matches"
          emergencyPhone={user?.emergency_phone}
        />
        
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Loading matches...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <AppHeader
          title="Matches"
          emergencyPhone={user?.emergency_phone}
        />
        
        <View style={styles.emptyState}>
          <Text style={styles.errorTitle}>Failed to load matches</Text>
          <Text style={styles.emptyText}>Please try again later</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Matches"
        emergencyPhone={user?.emergency_phone}
      />

      <FlatList
        data={matches}
        renderItem={renderMatch}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.matchesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No matches yet</Text>
            <Text style={styles.emptyText}>
              {user?.role === 'family' 
                ? "Start swiping on caregivers to find your perfect match!"
                : "Keep browsing job posts to connect with families!"
              }
            </Text>
          </View>
        }
      />

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
  matchesList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  matchItem: {
    marginBottom: 0,
  },
  matchContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  matchInfo: {
    flex: 1,
  },
  matchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  matchName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  matchLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  caregiverDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 4,
    marginRight: 12,
  },
  experience: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  lastMessage: {
    fontSize: 16,
    color: '#6B7280',
  },
  matchActions: {
    alignItems: 'flex-end',
  },
  timeStamp: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});