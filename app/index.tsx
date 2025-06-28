import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, User, Users, Star, MapPin } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

const demoAccounts = [
  {
    id: 'family1',
    type: 'family',
    name: 'Sarah Johnson',
    location: 'San Francisco, CA',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    description: 'Mother of 2, looking for reliable childcare',
    rating: 4.8,
    jobsPosted: 12
  },
  {
    id: 'family2',
    type: 'family',
    name: 'Michael Chen',
    location: 'Austin, TX',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    description: 'Single dad, needs evening care for 8-year-old',
    rating: 4.9,
    jobsPosted: 8
  },
  {
    id: 'caregiver1',
    type: 'caregiver',
    name: 'Emma Rodriguez',
    location: 'Los Angeles, CA',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    description: 'Certified childcare provider with 5+ years experience',
    rating: 4.9,
    completedJobs: 47
  },
  {
    id: 'caregiver2',
    type: 'caregiver',
    name: 'David Kim',
    location: 'Seattle, WA',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    description: 'Male caregiver specializing in special needs care',
    rating: 4.7,
    completedJobs: 23
  }
];

export default function DemoAccountSelection() {
  const router = useRouter();
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  const handleAccountSelect = (accountId: string) => {
    setSelectedAccount(accountId);
    // Navigate to the main app with the selected demo account
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 500);
  };

  const renderAccountCard = (account: typeof demoAccounts[0]) => (
    <TouchableOpacity
      key={account.id}
      style={[
        styles.accountCard,
        selectedAccount === account.id && styles.selectedCard
      ]}
      onPress={() => handleAccountSelect(account.id)}
    >
      <View style={styles.cardHeader}>
        <Image source={{ uri: account.avatar }} style={styles.avatar} />
        <View style={styles.accountInfo}>
          <Text style={styles.accountName}>{account.name}</Text>
          <View style={styles.locationRow}>
            <MapPin size={14} color={Colors.text.secondary} />
            <Text style={styles.location}>{account.location}</Text>
          </View>
          <View style={styles.ratingRow}>
            <Star size={14} color="#FFD700" />
            <Text style={styles.rating}>{account.rating}</Text>
            <Text style={styles.statText}>
              {account.type === 'family' 
                ? `• ${account.jobsPosted} jobs posted`
                : `• ${account.completedJobs} jobs completed`
              }
            </Text>
          </View>
        </View>
        <View style={[styles.typeBadge, account.type === 'family' ? styles.familyBadge : styles.caregiverBadge]}>
          {account.type === 'family' ? <Users size={16} color="white" /> : <User size={16} color="white" />}
        </View>
      </View>
      <Text style={styles.description}>{account.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Heart size={28} color={Colors.primary[500]} />
          <Text style={styles.logo}>FlashCare</Text>
          <Image
            source={{ uri: 'https://raw.githubusercontent.com/kickiniteasy/bolt-hackathon-badge/main/src/public/bolt-badge/white_circle_360x360/white_circle_360x360.png' }}
            style={styles.boltBadge}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Choose Demo Account</Text>
        <Text style={styles.subtitle}>
          Select an account type to explore FlashCare's features
        </Text>

        <ScrollView style={styles.accountsList} showsVerticalScrollIndicator={false}>
          <View style={styles.sectionHeader}>
            <Users size={20} color={Colors.primary[500]} />
            <Text style={styles.sectionTitle}>Family Accounts</Text>
          </View>
          {demoAccounts.filter(account => account.type === 'family').map(renderAccountCard)}

          <View style={[styles.sectionHeader, styles.caregiverSection]}>
            <User size={20} color={Colors.primary[500]} />
            <Text style={styles.sectionTitle}>Caregiver Accounts</Text>
          </View>
          {demoAccounts.filter(account => account.type === 'caregiver').map(renderAccountCard)}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary[500],
    marginLeft: 8,
  },
  boltBadge: {
    position: 'absolute',
    right: -60,
    width: 35,
    height: 35,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  accountsList: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  caregiverSection: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: 8,
  },
  accountCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedCard: {
    borderColor: Colors.primary[500],
    backgroundColor: Colors.primary[50],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: 4,
  },
  statText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  familyBadge: {
    backgroundColor: Colors.primary[500],
  },
  caregiverBadge: {
    backgroundColor: '#10B981',
  },
  description: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});