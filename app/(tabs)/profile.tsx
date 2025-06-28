import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { router } from 'expo-router';
import { User, Settings, Star, Shield, CreditCard, LogOut, CreditCard as Edit3, Phone, MapPin, Award, Bell, Calendar, MessageCircle } from 'lucide-react-native';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { EmergencyButton } from '../../components/EmergencyButton';
import { AppHeader } from '../../components/AppHeader';
import { ProfileEditModal } from '../../components/ProfileEditModal';
import { ReviewModal } from '../../components/ReviewModal';
import { NotificationCenter } from '../../components/NotificationCenter';
import { QuickStatsCard } from '../../components/QuickStatsCard';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { databaseService } from '../../lib/database';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { isSubscriber } = useSubscription();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [userRating, setUserRating] = useState({ average: 0, count: 0 });
  const [userStats, setUserStats] = useState({
    totalMatches: 0,
    activeChats: 0,
    upcomingSchedules: 0,
    completedJobs: 0,
  });

  useEffect(() => {
    if (user?.id) {
      loadUserReviews();
      loadUserRating();
      loadUserStats();
    }
  }, [user?.id]);

  const loadUserReviews = async () => {
    try {
      const reviews = await databaseService.getUserReviews(user!.id);
      setUserReviews(reviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const loadUserRating = async () => {
    try {
      const rating = await databaseService.getUserRating(user!.id);
      setUserRating(rating);
    } catch (error) {
      console.error('Error loading rating:', error);
    }
  };

  const loadUserStats = async () => {
    try {
      // Load user statistics
      const matches = await databaseService.getUserMatches(user!.id);
      const schedules = await databaseService.getUserSchedules(user!.id);
      
      setUserStats({
        totalMatches: matches.length,
        activeChats: matches.length, // Simplified - in production, count active conversations
        upcomingSchedules: schedules.filter(s => 
          s.status === 'confirmed' && new Date(s.start_ts) > new Date()
        ).length,
        completedJobs: schedules.filter(s => 
          s.status === 'confirmed' && new Date(s.end_ts) < new Date()
        ).length,
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleProfileSaved = () => {
    // Refresh profile data if needed
    console.log('Profile saved successfully');
    loadUserReviews();
    loadUserRating();
    loadUserStats();
  };

  const profileStats = [
    { label: 'Rating', value: userRating.average > 0 ? userRating.average.toString() : 'N/A', icon: Star },
    { label: 'Reviews', value: userRating.count.toString(), icon: Award },
    { label: 'Years', value: '3+', icon: Shield },
  ];

  return (
    <ScrollView style={styles.container}>
      <AppHeader
        title="Profile"
        emergencyPhone={user?.emergency_phone}
        rightComponent={
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => setShowNotifications(true)}
          >
            <Bell size={24} color="#6B7280" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>2</Text>
            </View>
          </TouchableOpacity>
        }
      />

      {/* Profile Info */}
      <Card style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <Image
            source={{ 
              uri: user?.avatar_url || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'
            }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileRole}>
              {user?.role === 'family' ? 'Family Member' : 'Caregiver'}
            </Text>
            {isSubscriber && (
              <View style={styles.subscriberBadge}>
                <Shield size={16} color="#059669" />
                <Text style={styles.subscriberText}>FlashCare Plus</Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
            <Edit3 size={20} color="#2563EB" />
          </TouchableOpacity>
        </View>

        {user?.bio && (
          <Text style={styles.profileBio}>{user.bio}</Text>
        )}

        <View style={styles.profileDetails}>
          {user?.phone && (
            <View style={styles.detailItem}>
              <Phone size={16} color="#6B7280" />
              <Text style={styles.detailText}>{user.phone}</Text>
            </View>
          )}
          {user?.location && (
            <View style={styles.detailItem}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.detailText}>{user.location}</Text>
            </View>
          )}
        </View>
      </Card>

      {/* Quick Stats */}
      <QuickStatsCard 
        userRole={user?.role || 'family'}
        stats={{
          ...userStats,
          rating: userRating.average,
          reviewCount: userRating.count,
        }}
      />

      {/* Recent Reviews (for caregivers) */}
      {user?.role === 'caregiver' && (
        <>
          {/* Recent Reviews */}
          {userReviews.length > 0 && (
            <Card style={styles.reviewsCard}>
              <View style={styles.reviewsHeader}>
                <Text style={styles.reviewsTitle}>Recent Reviews</Text>
                <TouchableOpacity onPress={() => setShowReviewModal(true)}>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              {userReviews.slice(0, 2).map((review) => (
                <View key={review.id} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewerName}>{review.reviewer.name}</Text>
                    <View style={styles.reviewRating}>
                      {[...Array(review.rating_int)].map((_, i) => (
                        <Star key={i} size={12} color="#F59E0B" fill="#F59E0B" />
                      ))}
                    </View>
                  </View>
                  {review.comment_text && (
                    <Text style={styles.reviewComment} numberOfLines={2}>
                      {review.comment_text}
                    </Text>
                  )}
                  <Text style={styles.reviewDate}>
                    {new Date(review.created_at).toLocaleDateString()}
                  </Text>
                </View>
              ))}
            </Card>
          )}
        </>
      )}

      {/* Quick Actions */}
      <Card style={styles.actionsCard}>
        <Text style={styles.actionsTitle}>Quick Actions</Text>
        <View style={styles.actionsList}>
          <TouchableOpacity style={styles.actionItem}>
            <Calendar size={20} color="#2563EB" />
            <Text style={styles.actionText}>View Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <MessageCircle size={20} color="#2563EB" />
            <Text style={styles.actionText}>Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <Star size={20} color="#2563EB" />
            <Text style={styles.actionText}>Reviews</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <CreditCard size={20} color="#2563EB" />
            <Text style={styles.actionText}>Billing</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Settings Menu */}
      <Card style={styles.settingsCard}>
        <TouchableOpacity style={styles.settingItem}>
          <Settings size={20} color="#6B7280" />
          <Text style={styles.settingText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Shield size={20} color="#6B7280" />
          <Text style={styles.settingText}>Privacy & Safety</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <User size={20} color="#6B7280" />
          <Text style={styles.settingText}>Help & Support</Text>
        </TouchableOpacity>
      </Card>

      {/* Sign Out */}
      <Card style={styles.signOutCard}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut size={20} color="#DC2626" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </Card>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Built with Bolt</Text>
        <Text style={styles.versionText}>FlashCare v1.0.0</Text>
      </View>

      <ProfileEditModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleProfileSaved}
      />

      <NotificationCenter
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#DC2626',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  profileCard: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  subscriberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  subscriberText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
    marginLeft: 4,
  },
  editButton: {
    padding: 8,
  },
  profileBio: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  profileDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  statsCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  subscriptionCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subscriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 8,
  },
  subscriptionStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  subscriptionDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  upgradeButton: {
    alignSelf: 'flex-start',
  },
  settingsCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  signOutCard: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 12,
    color: '#D1D5DB',
  },
  reviewsCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },
  reviewItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  actionsCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  actionsList: {
    gap: 12,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  actionText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
});