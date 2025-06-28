import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Linking, Platform } from 'react-native';
import { router } from 'expo-router';
import { User, Settings, Star, Shield, CreditCard, LogOut, CreditCard as Edit3, Phone, MapPin, Award, Bell, Calendar, MessageCircle, ChevronDown, ChevronUp, Users, Clock, TrendingUp } from 'lucide-react-native';
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

interface CollapsibleSectionProps {
  title: string;
  icon: React.ComponentType<any>;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

function CollapsibleSection({ title, icon: Icon, children, defaultExpanded = true }: CollapsibleSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Card style={styles.collapsibleCard}>
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.sectionTitleContainer}>
          <View style={styles.sectionIconContainer}>
            <Icon size={20} color="#2563EB" />
          </View>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={styles.chevronContainer}>
          {expanded ? (
            <ChevronUp size={20} color="#6B7280" />
          ) : (
            <ChevronDown size={20} color="#6B7280" />
          )}
        </View>
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.sectionContent}>
          {children}
        </View>
      )}
    </Card>
  );
}

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
      const matches = await databaseService.getUserMatches(user!.id);
      const schedules = await databaseService.getUserSchedules(user!.id);
      
      setUserStats({
        totalMatches: matches.length,
        activeChats: matches.length,
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
        { 
          text: 'Sign Out', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await signOut();
              // Force navigation to auth screen
              router.replace('/(auth)/welcome');
            } catch (error) {
              console.error('Sign out error:', error);
              // Force navigation even if there's an error
              router.replace('/(auth)/welcome');
            }
          }
        },
      ]
    );
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleProfileSaved = () => {
    console.log('Profile saved successfully');
    loadUserReviews();
    loadUserRating();
    loadUserStats();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <AppHeader
        title="Profile"
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

      <View style={styles.content}>
        {/* Profile Header */}
        <CollapsibleSection title="Profile Information" icon={User} defaultExpanded={true}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ 
                  uri: user?.avatar_url || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'
                }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.editAvatarButton}>
                <Edit3 size={16} color="#2563EB" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.profileName}>{user?.name}</Text>
                <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
                  <Edit3 size={18} color="#2563EB" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.profileRole}>
                {user?.role === 'family' ? 'Family Member' : 'Professional Caregiver'}
              </Text>
              
              {isSubscriber && (
                <View style={styles.subscriberBadge}>
                  <Shield size={16} color="#059669" />
                  <Text style={styles.subscriberText}>FlashCare Plus</Text>
                </View>
              )}
            </View>
          </View>

          {user?.bio && (
            <View style={styles.bioContainer}>
              <Text style={styles.bioLabel}>About</Text>
              <Text style={styles.profileBio}>{user.bio}</Text>
            </View>
          )}

          <View style={styles.contactDetails}>
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
        </CollapsibleSection>

        {/* Performance Stats */}
        <CollapsibleSection title="Performance Overview" icon={TrendingUp} defaultExpanded={true}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: '#EEF2FF' }]}>
                <Users size={20} color="#2563EB" />
              </View>
              <Text style={styles.statValue}>{userStats.totalMatches}</Text>
              <Text style={styles.statLabel}>Total Matches</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: '#F0FDF4' }]}>
                <MessageCircle size={20} color="#059669" />
              </View>
              <Text style={styles.statValue}>{userStats.activeChats}</Text>
              <Text style={styles.statLabel}>Active Chats</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: '#FEF3C7' }]}>
                <Calendar size={20} color="#D97706" />
              </View>
              <Text style={styles.statValue}>{userStats.upcomingSchedules}</Text>
              <Text style={styles.statLabel}>Upcoming</Text>
            </View>
          </View>

          {user?.role === 'caregiver' && (
            <View style={styles.ratingContainer}>
              <View style={styles.ratingItem}>
                <Star size={24} color="#F59E0B" fill="#F59E0B" />
                <View style={styles.ratingDetails}>
                  <Text style={styles.ratingValue}>
                    {userRating.average > 0 ? userRating.average.toFixed(1) : 'N/A'}
                  </Text>
                  <Text style={styles.ratingLabel}>
                    {userRating.count} review{userRating.count !== 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </CollapsibleSection>

        {/* Quick Actions */}
        <CollapsibleSection title="Quick Actions" icon={Clock} defaultExpanded={true}>
          <View style={styles.actionsList}>
            <TouchableOpacity style={styles.actionItem}>
              <View style={styles.actionIconContainer}>
                <Calendar size={20} color="#2563EB" />
              </View>
              <Text style={styles.actionText}>View Schedule</Text>
              <ChevronDown size={16} color="#9CA3AF" style={{ transform: [{ rotate: '-90deg' }] }} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem}>
              <View style={styles.actionIconContainer}>
                <MessageCircle size={20} color="#2563EB" />
              </View>
              <Text style={styles.actionText}>Messages</Text>
              <ChevronDown size={16} color="#9CA3AF" style={{ transform: [{ rotate: '-90deg' }] }} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem}>
              <View style={styles.actionIconContainer}>
                <Star size={20} color="#2563EB" />
              </View>
              <Text style={styles.actionText}>Reviews</Text>
              <ChevronDown size={16} color="#9CA3AF" style={{ transform: [{ rotate: '-90deg' }] }} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem}>
              <View style={styles.actionIconContainer}>
                <CreditCard size={20} color="#2563EB" />
              </View>
              <Text style={styles.actionText}>Billing & Subscription</Text>
              <ChevronDown size={16} color="#9CA3AF" style={{ transform: [{ rotate: '-90deg' }] }} />
            </TouchableOpacity>
          </View>
        </CollapsibleSection>

        {/* Recent Reviews (for caregivers) */}
        {user?.role === 'caregiver' && userReviews.length > 0 && (
          <CollapsibleSection title="Recent Reviews" icon={Award} defaultExpanded={false}>
            {userReviews.slice(0, 3).map((review) => (
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
            
            {userReviews.length > 3 && (
              <TouchableOpacity style={styles.viewAllButton} onPress={() => setShowReviewModal(true)}>
                <Text style={styles.viewAllText}>View All Reviews</Text>
              </TouchableOpacity>
            )}
          </CollapsibleSection>
        )}

        {/* Settings */}
        <CollapsibleSection title="Settings & Support" icon={Settings} defaultExpanded={false}>
          <View style={styles.settingsList}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => {
                const number = user?.emergency_phone || '911';
                const url = Platform.OS === 'ios' ? `tel:${number}` : `tel:${number}`;
                Linking.openURL(url).catch((err) => {
                  console.error('Error making emergency call:', err);
                });
              }}
            >
              <Phone size={20} color="#DC2626" />
              <Text style={[styles.settingText, styles.emergencyText]}>Emergency Call</Text>
              <Text style={styles.emergencyNumber}>
                {user?.emergency_phone || '911'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Settings size={20} color="#6B7280" />
              <Text style={styles.settingText}>App Settings</Text>
              <ChevronDown size={16} color="#9CA3AF" style={{ transform: [{ rotate: '-90deg' }] }} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Shield size={20} color="#6B7280" />
              <Text style={styles.settingText}>Privacy & Safety</Text>
              <ChevronDown size={16} color="#9CA3AF" style={{ transform: [{ rotate: '-90deg' }] }} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <User size={20} color="#6B7280" />
              <Text style={styles.settingText}>Help & Support</Text>
              <ChevronDown size={16} color="#9CA3AF" style={{ transform: [{ rotate: '-90deg' }] }} />
            </TouchableOpacity>
          </View>
        </CollapsibleSection>

        {/* Sign Out */}
        <CollapsibleSection title="Account Actions" icon={LogOut} defaultExpanded={false}>
          <View style={styles.accountActions}>
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
              <LogOut size={20} color="#DC2626" />
              <Text style={styles.signOutText}>Sign Out of FlashCare</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.deleteAccountButton}>
              <Text style={styles.deleteAccountText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </CollapsibleSection>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Built with Bolt</Text>
          <Text style={styles.versionText}>FlashCare v1.0.0</Text>
        </View>
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
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
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
  collapsibleCard: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  chevronContainer: {
    padding: 4,
  },
  sectionContent: {
    paddingTop: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  profileInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  editButton: {
    padding: 8,
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
  bioContainer: {
    marginBottom: 16,
  },
  bioLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  profileBio: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  contactDetails: {
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  ratingContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  ratingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingDetails: {
    marginLeft: 12,
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  ratingLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionsList: {
    gap: 0,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  actionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
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
  viewAllButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },
  settingsList: {
    gap: 0,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  emergencyText: {
    color: '#DC2626',
    fontWeight: '600',
  },
  emergencyNumber: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '500',
  },
  accountActions: {
    gap: 12,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginLeft: 8,
  },
  deleteAccountButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  deleteAccountText: {
    fontSize: 14,
    color: '#9CA3AF',
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
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
});