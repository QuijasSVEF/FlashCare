import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Image, Modal } from 'react-native';
import { Heart, X, MapPin, Clock, DollarSign, User, Filter, Search, Users, Menu } from 'lucide-react-native';
import { SwipeableCard } from '../../components/SwipeableCard';
import { Card } from '../../components/ui/Card';
import { FilterModal } from '../../components/FilterModal';
import { AdvancedFilterModal } from '../../components/AdvancedFilterModal';
import { EmergencyButton } from '../../components/EmergencyButton';
import { AppHeader } from '../../components/AppHeader';
import { useAuth } from '../../contexts/AuthContext';
import { matchingService } from '../../lib/matching';
import { databaseService } from '../../lib/database';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationBanner } from '../../components/NotificationBanner';
import { router } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

interface QuickMenuModalProps {
  visible: boolean;
  onClose: () => void;
  userRole: 'family' | 'caregiver';
}

function QuickMenuModal({ visible, onClose, userRole }: QuickMenuModalProps) {
  const menuItems = [
    {
      icon: Users,
      title: 'Matches',
      subtitle: 'View your connections',
      color: '#059669',
      onPress: () => {
        onClose();
        router.push('/(tabs)/matches');
      }
    },
    {
      icon: Search,
      title: 'Advanced Search',
      subtitle: 'Find specific caregivers',
      color: '#2563EB',
      onPress: () => {
        onClose();
        router.push('/(tabs)/search');
      }
    }
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.quickMenu}>
          <Text style={styles.quickMenuTitle}>Quick Actions</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickMenuItem}
              onPress={item.onPress}
            >
              <View style={[styles.quickMenuIcon, { backgroundColor: `${item.color}15` }]}>
                <item.icon size={24} color={item.color} />
              </View>
              <View style={styles.quickMenuContent}>
                <Text style={styles.quickMenuItemTitle}>{item.title}</Text>
                <Text style={styles.quickMenuItemSubtitle}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export default function HomeScreen() {
  const { user } = useAuth();
  const { notifications, showSuccess, showError, hideNotification } = useNotifications();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [caregivers, setCaregivers] = useState<any[]>([]);
  const [jobPosts, setJobPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
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
    if (currentIndex >= items.length || !user?.id) {
      showError('Error', 'No more items to swipe');
      return;
    }

    const currentItem = items[currentIndex];

    try {
      if (user?.role === 'family') {
        const currentCaregiver = currentItem;
        const result = await matchingService.handleSwipe(
          user.id,
          currentCaregiver.id,
          direction
        );

        if (direction === 'like' && result.isMatch) {
          showSuccess(
            '🎉 It\'s a Match!',
            `You matched with ${currentCaregiver.name}! Start chatting to schedule care.`
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
          showSuccess(
            '🎉 It\'s a Match!',
            `You matched with ${currentJob.family?.name}! Start chatting to discuss the position.`
          );
        }
      }

      // Move to next item after successful swipe
      setCurrentIndex(prev => prev + 1);

    } catch (error) {
      console.error('Error saving swipe:', error);
      
      let errorMessage = 'Failed to process swipe. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('No job posts found')) {
          errorMessage = 'Please create a job posting first before browsing caregivers.';
        } else {
          errorMessage = error.message;
        }
      }
      showError('Error', errorMessage);
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

  return (
    <View style={styles.container}>
      {notifications.map((notification) => (
        <NotificationBanner
          key={notification.id}
          visible={notification.visible}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onDismiss={() => hideNotification(notification.id)}
        />
      ))}
      
      <AppHeader
        title={user?.role === 'family' ? 'Find Caregivers' : 'Browse Jobs'}
        subtitle={`📍 ${user?.location || 'San Francisco, CA'}`}
        emergencyPhone={user?.emergency_phone}
        rightComponent={
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.quickMenuButton}
              onPress={() => setShowQuickMenu(true)}
            >
              <Menu size={20} color="#2563EB" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowFilterModal(true)}
            >
              <Filter size={20} color="#2563EB" />
            </TouchableOpacity>
          </View>
        }
      />

      <View style={styles.cardContainer}>
        {currentIndex < (user?.role === 'family' ? caregivers : jobPosts).length ? (
          <>
            <SwipeableCard
              data={currentItem}
              onSwipeLeft={() => handleSwipe('pass')}
              onSwipeRight={() => handleSwipe('like')}
              userRole={user?.role || 'family'}
            />

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

      <QuickMenuModal
        visible={showQuickMenu}
        onClose={() => setShowQuickMenu(false)}
        userRole={user?.role || 'family'}
      />

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
        userRole={user?.role || 'family'}
      />

      <AdvancedFilterModal
        visible={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        onApplyFilters={handleApplyFilters}
        userRole={user?.role || 'family'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  quickMenuButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginTop: 40,
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
    paddingTop: 100,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  quickMenuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  quickMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  quickMenuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  quickMenuContent: {
    flex: 1,
  },
  quickMenuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  quickMenuItemSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
});