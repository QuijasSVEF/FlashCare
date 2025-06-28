import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { MessageCircle, Star, Clock } from 'lucide-react-native';
import { Card } from '../../components/ui/Card';
import { EmergencyButton } from '../../components/EmergencyButton';
import { useAuth } from '../../contexts/AuthContext';

// Mock matches data
const mockMatches = [
  {
    id: '1',
    caregiver: {
      id: '1',
      name: 'Sarah Johnson',
      avatar_url: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      experience: '7+ years',
    },
    family: {
      id: '2',
      name: 'The Anderson Family',
      avatar_url: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'San Francisco, CA',
    },
    lastMessage: 'Looking forward to meeting you!',
    lastMessageTime: '2m ago',
    unreadCount: 2,
  },
  {
    id: '2',
    caregiver: {
      id: '3',
      name: 'Emily Chen',
      avatar_url: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      experience: '6+ years',
    },
    family: {
      id: '4',
      name: 'The Williams Family',
      avatar_url: 'https://images.pexels.com/photos/1128317/pexels-photo-1128317.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Oakland, CA',
    },
    lastMessage: 'What time works best for you?',
    lastMessageTime: '1h ago',
    unreadCount: 0,
  },
];

export default function MatchesScreen() {
  const { user } = useAuth();

  const renderMatch = ({ item }: { item: typeof mockMatches[0] }) => {
    const otherUser = user?.role === 'family' ? item.caregiver : item.family;
    const isCaregiver = user?.role === 'caregiver';

    return (
      <TouchableOpacity
        onPress={() => router.push(`/chat/${item.id}`)}
        style={styles.matchItem}
      >
        <Card>
          <View style={styles.matchContent}>
            <Image
              source={{ uri: otherUser.avatar_url }}
              style={styles.avatar}
            />
            
            <View style={styles.matchInfo}>
              <View style={styles.matchHeader}>
                <Text style={styles.matchName}>{otherUser.name}</Text>
                {item.unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.unreadCount}</Text>
                  </View>
                )}
              </View>
              
              {isCaregiver ? (
                <Text style={styles.matchLocation}>{otherUser.location}</Text>
              ) : (
                <View style={styles.caregiverDetails}>
                  <Star size={14} color="#F59E0B" />
                  <Text style={styles.rating}>{otherUser.rating}</Text>
                  <Clock size={14} color="#6B7280" />
                  <Text style={styles.experience}>{otherUser.experience}</Text>
                </View>
              )}
              
              <Text style={styles.lastMessage} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>
            
            <View style={styles.matchActions}>
              <Text style={styles.timeStamp}>{item.lastMessageTime}</Text>
              <MessageCircle size={20} color="#2563EB" />
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  if (mockMatches.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Matches</Text>
          <EmergencyButton phoneNumber={user?.emergency_phone} />
        </View>
        
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No matches yet</Text>
          <Text style={styles.emptyText}>
            {user?.role === 'family' 
              ? "Start swiping on caregivers to find your perfect match!"
              : "Keep browsing job posts to connect with families!"
            }
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Matches</Text>
        <EmergencyButton phoneNumber={user?.emergency_phone} />
      </View>

      <FlatList
        data={mockMatches}
        renderItem={renderMatch}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.matchesList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
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
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});