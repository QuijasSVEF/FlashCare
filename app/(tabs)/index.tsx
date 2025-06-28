import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Heart, X, MapPin } from 'lucide-react-native';
import { CaregiverCard } from '../../components/CaregiverCard';
import { EmergencyButton } from '../../components/EmergencyButton';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const { width: screenWidth } = Dimensions.get('window');

// Mock caregiver data
const mockCaregivers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar_url: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Experienced caregiver with 7 years helping families. Specializing in senior care and disability support. Certified in CPR and first aid.',
    location: 'San Francisco, CA',
    rating: 4.9,
    experience: '7+ years',
    hourlyRate: 28,
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    avatar_url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Compassionate care professional with specialized training in autism support and behavioral therapy.',
    location: 'San Francisco, CA',
    rating: 4.8,
    experience: '5+ years',
    hourlyRate: 25,
  },
  {
    id: '3',
    name: 'Emily Chen',
    avatar_url: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Certified nursing assistant with experience in post-surgical care and medication management.',
    location: 'Oakland, CA',
    rating: 4.9,
    experience: '6+ years',
    hourlyRate: 30,
  },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState(mockCaregivers);

  const handleSwipe = async (direction: 'like' | 'pass') => {
    if (currentIndex >= cards.length) return;

    const currentCaregiver = cards[currentIndex];

    // Mock swipe action - in real app, this would save to database
    try {
      if (user?.role === 'family') {
        // Insert swipe record
        console.log(`Swiped ${direction} on caregiver ${currentCaregiver.id}`);
        
        // If it's a like, check for match (mock implementation)
        if (direction === 'like') {
          // Simulate 30% chance of match for demo
          const isMatch = Math.random() > 0.7;
          if (isMatch) {
            Alert.alert(
              '🎉 It\'s a Match!', 
              `You matched with ${currentCaregiver.name}! Start chatting to schedule care.`,
              [{ text: 'Great!', style: 'default' }]
            );
          }
        }
      }
    } catch (error) {
      console.error('Error saving swipe:', error);
    }

    setCurrentIndex(prev => prev + 1);
  };

  const currentCaregiver = cards[currentIndex];

  if (user?.role === 'caregiver') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Available Jobs</Text>
          <EmergencyButton phoneNumber={user.emergency_phone} />
        </View>
        
        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonTitle}>Job Listings Coming Soon!</Text>
          <Text style={styles.comingSoonText}>
            We're working on the job browsing feature for caregivers. 
            You'll be able to see and apply to family job posts here.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Find Caregivers</Text>
          <View style={styles.location}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.locationText}>San Francisco, CA</Text>
          </View>
        </View>
        <EmergencyButton phoneNumber={user?.emergency_phone} />
      </View>

      <View style={styles.cardContainer}>
        {currentIndex < cards.length ? (
          <>
            <View style={styles.cardWrapper}>
              <CaregiverCard caregiver={currentCaregiver} />
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.passButton]}
                onPress={() => handleSwipe('pass')}
              >
                <X size={32} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.likeButton]}
                onPress={() => handleSwipe('like')}
              >
                <Heart size={32} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.noMoreCards}>
            <Text style={styles.noMoreTitle}>No more caregivers nearby</Text>
            <Text style={styles.noMoreText}>
              Check back later for new caregivers in your area, or expand your search radius.
            </Text>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setCurrentIndex(0);
                setCards([...mockCaregivers]);
              }}
            >
              <Text style={styles.resetButtonText}>Start Over</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 4,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cardWrapper: {
    width: '100%',
    marginBottom: 40,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  passButton: {
    backgroundColor: '#EF4444',
  },
  likeButton: {
    backgroundColor: '#059669',
  },
  noMoreCards: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noMoreTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  noMoreText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  resetButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  comingSoon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  comingSoonText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});