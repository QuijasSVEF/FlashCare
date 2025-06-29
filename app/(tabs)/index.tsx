import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { router, useRouter } from 'expo-router';
import { ArrowLeft, Heart } from 'lucide-react-native';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button'; 
import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../constants/Colors';

export default function SignInScreen() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false); 
  const [errors, setErrors] = useState<Record<string, string>>({});

  const routerInstance = useRouter();
  const { signIn, user } = useAuth();
  
  // If user is already signed in, redirect to tabs
  useEffect(() => {
      const result = await signIn(formData.email, formData.password);
      console.log('Signin successful, result:', !!result);
      
      // Small delay to ensure auth state is properly set
      setTimeout(() => {
        console.log('Navigating to tabs after signin');
        routerInstance.replace('/(tabs)');
      }, 100);
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    
    try {
      console.log('Attempting signin with:', formData.email);
      const result = await signIn(formData.email, formData.password);
      console.log('Signin successful, result:', !!result);
      
      // Small delay to ensure auth state is properly set
      setTimeout(() => {
        console.log('Navigating to tabs after signin');
        routerInstance.replace('/(tabs)');
      }, 100);
interface QuickMenuModalProps {
  visible: boolean;
  onClose: () => void;
  userRole: 'family' | 'caregiver';
}
      console.error('Signin error:', error);
function QuickMenuModal({ visible, onClose, userRole }: QuickMenuModalProps) {
  const menuItems = [
    {
      icon: Users,
      title: 'Matches',
      subtitle: 'View your connections',
      color: Colors.primary[500],
      onPress: () => {
        onClose();
        router.push('/(tabs)/matches');
      }
    },
    {
      icon: Search,
      title: 'Advanced Search',
      subtitle: 'Find specific caregivers',
      color: Colors.secondary[500],
      onPress: () => {
        onClose();
        router.push('/(tabs)/search');
      }
    }
  ];
import { useNotifications } from '../../hooks/useNotifications';
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
          <View style={styles.quickMenuHeader}>
  React.useEffect(() => {
    if (user?.role === 'family') {
      loadCaregivers();
    } else if (user?.role === 'caregiver') {
      loadJobPosts();
    }
  }, [user]);
          </View>
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

              style={styles.quickMenuItem}
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
  const { user } = useAuth();

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
  const [jobPosts, setJobPosts] = useState<any[]>([]);
      showError('Error', errorMessage);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});

  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
    console.log('Applied filters:', filters);
  };

  const currentItem = user?.role === 'family' ? caregivers[currentIndex] : jobPosts[currentIndex];

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingSpinner}>
            <View style={[styles.spinnerRing, styles.spinnerRing1]} />
            <View style={[styles.spinnerRing, styles.spinnerRing2]} />
            <View style={[styles.spinnerRing, styles.spinnerRing3]} />
          </View>
          <Text style={styles.loadingText}>
            {user?.role === 'family' ? 'Finding perfect caregivers...' : 'Loading amazing opportunities...'}
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <View style={styles.errorContainer}>
          <View style={styles.errorIcon}>
            <X size={48} color={Colors.error} />
          </View>
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
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
        rightComponent={
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.quickMenuButton}
              onPress={() => setShowQuickMenu(true)}
              activeOpacity={0.7}
            >
              <Menu size={20} color={Colors.primary[500]} strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowFilterModal(true)}
              activeOpacity={0.7}
            >
              <Filter size={20} color={Colors.primary[500]} strokeWidth={2} />
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
                activeOpacity={0.8}
              >
                <X size={28} color="#FFFFFF" strokeWidth={2.5} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.likeButton]}
                onPress={() => handleSwipe('like')}
                activeOpacity={0.8}
              >
                <Heart size={28} color="#FFFFFF" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.noMoreCards}>
            <View style={styles.noMoreIcon}>
              <Search size={64} color={Colors.gray[300]} strokeWidth={1.5} />
            </View>
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
              activeOpacity={0.8}
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
    backgroundColor: Colors.surface,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingSpinner: {
    width: 60,
    height: 60,
    marginBottom: 24,
    position: 'relative',
  },
  spinnerRing: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  spinnerRing1: {
    borderTopColor: Colors.primary[500],
    transform: [{ rotate: '0deg' }],
  },
  spinnerRing2: {
    borderRightColor: Colors.secondary[500],
    transform: [{ rotate: '120deg' }],
  },
  spinnerRing3: {
    borderBottomColor: Colors.primary[300],
    transform: [{ rotate: '240deg' }],
  },
  loadingText: {
    fontSize: 18,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 40,
  },
  errorIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.error + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
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
  retryButtonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  quickMenuButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.primary[50],
    shadowColor: Colors.primary[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.primary[50],
    shadowColor: Colors.primary[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 60,
    marginTop: 30,
    paddingBottom: 20,
  },
  actionButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  passButton: {
    backgroundColor: Colors.error,
  },
  likeButton: {
    backgroundColor: Colors.primary[500],
  },
  noMoreCards: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 80,
  },
  noMoreIcon: {
    marginBottom: 24,
  },
  noMoreTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  noMoreText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  resetButton: {
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
  resetButtonText: {
    color: Colors.text.inverse,
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
    backgroundColor: Colors.background,
    borderRadius: 24,
    padding: 24,
    margin: 20,
    minWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  quickMenuHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  quickMenuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  quickMenuAccent: {
    width: 40,
    height: 3,
    backgroundColor: Colors.primary[500],
    borderRadius: 2,
  },
  quickMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
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
    color: Colors.text.primary,
    marginBottom: 4,
  },
  quickMenuItemSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
});