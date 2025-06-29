import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Modal } from 'react-native';
import { router } from 'expo-router';
import { MessageCircle, Star, Clock, Users, Heart } from 'lucide-react-native';
import { Card } from '../../components/ui/Card';
import { EmergencyButton } from '../../components/EmergencyButton';
import { AppHeader } from '../../components/AppHeader';
import { PaywallModal } from '../../components/PaywallModal';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useMatches } from '../../hooks/useMatches';
import { Colors } from '../../constants/Colors';

export default function MatchesScreen() {
  const { user } = useAuth();
  const { isSubscriber } = useSubscription();
  const { matches, loading, error } = useMatches();
  const [showPaywall, setShowPaywall] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [showChatModal, setShowChatModal] = useState(false);

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
    
    const handleMatchPress = () => {
      if (!isSubscriber) {
        setShowPaywall(true);
        return;
      }
      setSelectedMatch(item);
      setShowChatModal(true);
    };

    return (
      <TouchableOpacity
        onPress={handleMatchPress}
        style={styles.matchItem}
        activeOpacity={0.7}
      >
        <Card style={styles.matchCard}>
          <View style={styles.matchContent}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: otherUser.avatar_url || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                style={styles.avatar}
              />
              <View style={styles.onlineIndicator} />
            </View>
            
            <View style={styles.matchInfo}>
              <View style={styles.matchHeader}>
                <Text style={styles.matchName}>{otherUser.name}</Text>
                <Text style={styles.timeStamp}>{formatTimeAgo(item.created_at)}</Text>
              </View>
              
              {isCaregiver ? (
                <Text style={styles.matchLocation}>{otherUser.location}</Text>
              ) : (
                <View style={styles.caregiverDetails}>
                  <Star size={14} color={Colors.warning} fill={Colors.warning} />
                  <Text style={styles.rating}>4.8</Text>
                  <Clock size={14} color={Colors.text.secondary} />
                  <Text style={styles.experience}>5+ years</Text>
                </View>
              )}
              
              <Text style={styles.lastMessage} numberOfLines={1}>
                {isSubscriber ? 'Tap to start chatting!' : 'Upgrade to message'}
              </Text>
            </View>
            
            <View style={styles.matchActions}>
              <View style={[
                styles.messageButton,
                { backgroundColor: isSubscriber ? Colors.primary[500] : Colors.gray[300] }
              ]}>
                <MessageCircle size={20} color={Colors.text.inverse} />
              </View>
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
        />
        
        <View style={styles.loadingContainer}>
          <View style={styles.loadingSpinner}>
            <Heart size={48} color={Colors.primary[500]} />
          </View>
          <Text style={styles.loadingTitle}>Finding your matches...</Text>
          <Text style={styles.loadingText}>
            We're gathering all your connections
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <AppHeader
          title="Matches"
        />
        
        <View style={styles.errorContainer}>
          <Users size={64} color={Colors.gray[300]} />
          <Text style={styles.errorTitle}>Unable to Load Matches</Text>
          <Text style={styles.errorText}>
            We're having trouble loading your matches. Please try again later.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Your Matches"
        subtitle={`${matches.length} connection${matches.length !== 1 ? 's' : ''}`}
      />

      <FlatList
        data={matches}
        renderItem={renderMatch}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.matchesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Heart size={64} color={Colors.gray[300]} />
            </View>
            <Text style={styles.emptyTitle}>No matches yet</Text>
            <Text style={styles.emptyText}>
              {user?.role === 'family' 
                ? "Start swiping on caregivers to find your perfect match!"
                : "Keep browsing job posts to connect with families!"
              }
            </Text>
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => router.push('/(tabs)')}
            >
              <Text style={styles.browseButtonText}>
                {user?.role === 'family' ? 'Find Caregivers' : 'Browse Jobs'}
              </Text>
            </TouchableOpacity>
          </View>
        }
      />

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
            <View style={styles.chatContent}>
              <Text style={styles.chatPlaceholder}>
                🎉 You matched! This is where your conversation would appear.
              </Text>
              <Text style={styles.chatSubtext}>
                In the full app, you'd see real-time messaging here.
              </Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingSpinner: {
    marginBottom: 24,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  matchesList: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  matchItem: {
    marginBottom: 12,
  },
  matchCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  matchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: Colors.background,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  matchInfo: {
    flex: 1,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  matchName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    flex: 1,
  },
  timeStamp: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  matchLocation: {
    fontSize: 14,
    color: Colors.text.secondary,
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
    color: Colors.text.primary,
    marginLeft: 4,
    marginRight: 12,
  },
  experience: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  lastMessage: {
    fontSize: 16,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  matchActions: {
    alignItems: 'center',
  },
  messageButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  browseButton: {
    backgroundColor: Colors.primary[500],
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: Colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  browseButtonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  chatModal: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  closeButton: {
    fontSize: 16,
    color: Colors.primary[500],
    fontWeight: '600',
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  chatPlaceholder: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  chatSubtext: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});