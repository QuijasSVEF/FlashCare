import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { router } from 'expo-router';
import { User, Settings, Star, Shield, CreditCard, LogOut, CreditCard as Edit3, Phone, MapPin, Award } from 'lucide-react-native';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { EmergencyButton } from '../../components/EmergencyButton';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { isSubscriber } = useSubscription();

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
    console.log('Edit profile');
  };

  const profileStats = [
    { label: 'Rating', value: '4.9', icon: Star },
    { label: 'Reviews', value: '127', icon: Award },
    { label: 'Years', value: '3+', icon: Shield },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <EmergencyButton phoneNumber={user?.emergency_phone} />
      </View>

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

      {/* Stats (for caregivers) */}
      {user?.role === 'caregiver' && (
        <Card style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            {profileStats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <stat.icon size={24} color="#2563EB" />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </Card>
      )}

      {/* Subscription Status */}
      <Card style={styles.subscriptionCard}>
        <View style={styles.subscriptionHeader}>
          <CreditCard size={24} color="#2563EB" />
          <Text style={styles.subscriptionTitle}>Subscription</Text>
        </View>
        {isSubscriber ? (
          <View>
            <Text style={styles.subscriptionStatus}>FlashCare Plus Active</Text>
            <Text style={styles.subscriptionDetails}>
              Full access to messaging, video calls, and advanced features
            </Text>
          </View>
        ) : (
          <View>
            <Text style={styles.subscriptionStatus}>Free Plan</Text>
            <Text style={styles.subscriptionDetails}>
              Upgrade to unlock messaging and premium features
            </Text>
            <Button
              title="Upgrade to Plus"
              onPress={() => console.log('Upgrade subscription')}
              style={styles.upgradeButton}
            />
          </View>
        )}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  profileCard: {
    marginHorizontal: 20,
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
});