import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Image } from 'react-native';
import { Heart, X, MapPin, Clock, DollarSign, User, Filter } from 'lucide-react-native';
import { CaregiverCard } from '../../components/CaregiverCard';
import { Card } from '../../components/ui/Card';
import { FilterModal } from '../../components/FilterModal';
import { EmergencyButton } from '../../components/EmergencyButton';
import { useAuth } from '../../contexts/AuthContext';
import { matchingService } from '../../lib/matching';
import { databaseService } from '../../lib/database';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [caregivers, setCaregivers] = useState<any[]>([]);
  const [jobPosts, setJobPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});

  React.useEffect(() => {
    if (user?.role === 'family') {
      loadCaregivers();
    } else if (user?.role === 'caregiver') {
      loadJobPosts();
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
      setCaregivers(caregivers);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load caregivers');
    } finally {
      setLoading(false);
    }
  };

  const loadJobPosts = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const jobs = await matchingService.getRecommendedJobs(
        user.id,
        user.location || undefined,
        20
      );
      setJobPosts(jobs);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load job posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction: 'like' | 'pass') => {
    const items = user?.role === 'family' ? caregivers : jobPosts;
    if (currentIndex >= items.length || !user?.id) return;

    const currentItem = items[currentIndex];
    setCurrentIndex(prev => prev + 1);

    try {
      if (user?.role === 'family') {
        const currentCaregiver = currentItem;
        const result = await matchingService.handleSwipe(
          user.id,
          currentCaregiver.id,
          direction
        );

        if (direction === 'like' && result.isMatch) {
          Alert.alert(
            '🎉 It\'s a Match!', 
            `You matched with ${currentCaregiver.name}! Start chatting to schedule care.`,
            [{ text: 'Great!', style: 'default' }]
          );
        }
      } else if (user?.role === 'caregiver') {
        const currentJob = currentItem;
        const result = await matchingService.handleJobSwipe(
          user.id,
          currentJob.family_id,
          currentJob.id,
          direction
        );

        if (direction === 'like' && result.isMatch) {
          Alert.alert(
            '🎉 It\'s a Match!', 
            `You matched with ${currentJob.family?.name}! Start chatting to discuss the position.`,
            [{ text: 'Great!', style: 'default' }]
          );
        }
      }

    } catch (error) {
      console.error('Error saving swipe:', error);
      // Reset index on error
      setCurrentIndex(prev => prev - 1);
      
      let errorMessage = 'Failed to process swipe. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('No job posts found')) {
          errorMessage = 'Please create a job posting first before browsing caregivers.';
        } else {
          errorMessage = error.message;
        }
      }
      Alert.alert('Error', errorMessage);
    }
  };

  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
    // TODO: Implement filtering logic
    console.log('Applied filters:', filters);
  };

  const currentItem = user?.role === 'family' ? caregivers[currentIndex] : jobPosts[currentIndex];

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>
          {user?.role === 'family' ? 'Finding caregivers...' : 'Loading job opportunities...'}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            user?.role === 'family' ? loadCaregivers() : loadJobPosts();
          }}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderJobCard = (job: any) => {
    const weeklyEarnings = job.hours_per_week * job.rate_hour;
    const timeAgo = new Date(job.created_at);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - timeAgo.getTime()) / (1000 * 60 * 60));
    
    let timeText = '';
    if (diffInHours < 1) timeText = 'Just posted';
    else if (diffInHours < 24) timeText = `${diffInHours}h ago`;
    else timeText = `${Math.floor(diffInHours / 24)}d ago`;

    return (
      <Card style={styles.jobCard}>
        <View style={styles.jobCardHeader}>
          <Text style={styles.jobCardTitle}>{job.title}</Text>
          
          <View style={styles.familyInfo}>
            <View style={styles.familyHeader}>
              <Image
                source={{ 
                  uri: job.family?.avatar_url || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'
                }}
                style={styles.familyAvatar}
              />
              <View>
                <Text style={styles.familyName}>{job.family?.name || 'Family Member'}</Text>
                <View style={styles.jobLocation}>
                  <MapPin size={14} color="#6B7280" />
                  <Text style={styles.jobLocationText}>{job.location}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.jobCardDescription} numberOfLines={4}>
          {job.description}
        </Text>

        <View style={styles.jobCardDetails}>
          <View style={styles.jobDetailItem}>
            <Clock size={16} color="#6B7280" />
            <Text style={styles.jobDetailText}>{job.hours_per_week} hrs/week</Text>
          </View>
          <View style={styles.jobDetailItem}>
            <DollarSign size={16} color="#6B7280" />
            <Text style={styles.jobDetailText}>${job.rate_hour}/hour</Text>
          </View>
        </View>

        <View style={styles.jobCardFooter}>
          <View style={styles.weeklyEarnings}>
            <Text style={styles.weeklyEarningsText}>
              ${weeklyEarnings.toFixed(2)}/week
            </Text>
          </View>
          <Text style={styles.postedTime}>{timeText}</Text>
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            {user?.role === 'family' ? 'Find Caregivers' : 'Browse Jobs'}
          </Text>
          <View style={styles.location}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.locationText}>{user?.location || 'San Francisco, CA'}</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Filter size={20} color="#2563EB" />
          </TouchableOpacity>
          <EmergencyButton phoneNumber={user?.emergency_phone} />
        </View>
      </View>

      <View style={styles.cardContainer}>
        {currentIndex < (user?.role === 'family' ? caregivers : jobPosts).length ? (
          <>
            <View style={styles.cardWrapper}>
              {user?.role === 'family' ? (
                <CaregiverCard caregiver={currentItem} />
              ) : (
                renderJobCard(currentItem)
              )}
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
            <Text style={styles.noMoreTitle}>
              {user?.role === 'family' ? 'No more caregivers nearby' : 'No more jobs available'}
            </Text>
            <Text style={styles.noMoreText}>
              {user?.role === 'family' 
                ? 'Check back later for new caregivers in your area, or expand your search radius.'
                : 'Check back later for new job postings in your area.'
              }
            </Text>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setCurrentIndex(0);
                user?.role === 'family' ? loadCaregivers() : loadJobPosts();
              }}
            >
              <Text style={styles.resetButtonText}>Start Over</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
        userRole={user?.role || 'family'}
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
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
  familyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  familyAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  jobBrowsingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobCard: {
    width: '100%',
    maxWidth: 350,
    alignSelf: 'center',
  },
  jobCardHeader: {
    marginBottom: 16,
  },
  jobCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  familyInfo: {
    marginBottom: 8,
  },
  familyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  jobLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobLocationText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  jobCardDescription: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  jobCardDetails: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  jobDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobDetailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  jobCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weeklyEarnings: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  weeklyEarningsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
  },
  postedTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});