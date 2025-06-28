import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Heart, X, MapPin } from 'lucide-react-native';
import { CaregiverCard } from '../../components/CaregiverCard';
import { EmergencyButton } from '../../components/EmergencyButton';
import { useAuth } from '../../contexts/AuthContext';
import { matchingService } from '../../lib/matching';
import { databaseService } from '../../lib/database';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (user?.role === 'family') {
      loadCaregivers();
    }
  }, [user]);

  const loadCaregivers = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const caregivers = await matchingService.getRecommendedCaregivers(
        user.id,
        user.location || undefined
      );
      setCards(caregivers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load caregivers');
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction: 'like' | 'pass') => {
    if (currentIndex >= cards.length) return;

    const currentCaregiver = cards[currentIndex];

    try {
      if (user?.role === 'family') {
        const result = await matchingService.handleSwipe(
          user.id,
          currentCaregiver.id,
          direction
        );

        if (direction === 'like') {
          if (result.isMatch) {
            Alert.alert(
              '🎉 It\'s a Match!', 
              `You matched with ${currentCaregiver.name}! Start chatting to schedule care.`,
              [{ text: 'Great!', style: 'default' }]
            );
          }
        }
      }

      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      Alert.alert('Error', 'Failed to process swipe. Please try again.');
      console.error('Error saving swipe:', error);
    }

    setCurrentIndex(prev => prev + 1);
  };

  const currentCaregiver = cards[currentIndex];

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Finding caregivers...</Text>
      </View>
    );
  }

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
                loadCaregivers();
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#6B7280',
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