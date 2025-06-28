import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Star, Clock, Award, Shield, MessageCircle } from 'lucide-react-native';
import { Card } from './ui/Card';
import { Colors } from '../constants/Colors';

interface CaregiverProfileCardProps {
  caregiver: {
    id: string;
    name: string;
    avatar_url?: string;
    bio?: string;
    location?: string;
    role: 'family' | 'caregiver';
    phone?: string;
    emergency_phone?: string;
    created_at: string;
    updated_at: string;
  };
  onMessage?: () => void;
  onViewProfile?: () => void;
  showActions?: boolean;
}

export function CaregiverProfileCard({ 
  caregiver, 
  onMessage, 
  onViewProfile,
  showActions = true 
}: CaregiverProfileCardProps) {
  const memberSince = new Date(caregiver.created_at).getFullYear();
  
  // Mock data - in production, fetch from database
  const mockData = {
    rating: 4.8,
    reviewCount: 127,
    experience: '5+ years',
    hourlyRate: 25,
    skills: ['Senior Care', 'CPR Certified', 'First Aid', 'Companionship'],
    certifications: ['Background Check', 'References'],
    languages: ['English', 'Spanish'],
    availability: ['Weekdays', 'Weekends'],
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Image
          source={{ 
            uri: caregiver.avatar_url || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'
          }}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{caregiver.name}</Text>
          <View style={styles.rating}>
            <Star size={16} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>{mockData.rating}</Text>
            <Text style={styles.ratingCount}>({mockData.reviewCount} reviews)</Text>
          </View>
          <View style={styles.location}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.locationText}>{caregiver.location || 'San Francisco, CA'}</Text>
          </View>
          <View style={styles.experience}>
            <Clock size={14} color="#6B7280" />
            <Text style={styles.experienceText}>{mockData.experience}</Text>
            <Shield size={14} color="#059669" style={styles.verifiedIcon} />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        </View>
        <View style={styles.rateContainer}>
          <Text style={styles.rateText}>${mockData.hourlyRate}/hr</Text>
        </View>
      </View>

      {caregiver.bio && (
        <Text style={styles.bio} numberOfLines={3}>
          {caregiver.bio}
        </Text>
      )}

      {/* Skills */}
      <View style={styles.skillsSection}>
        <Text style={styles.skillsTitle}>Skills & Specialties</Text>
        <View style={styles.skills}>
          {mockData.skills.slice(0, 4).map((skill, index) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
          {mockData.skills.length > 4 && (
            <View style={styles.skillTag}>
              <Text style={styles.skillText}>+{mockData.skills.length - 4} more</Text>
            </View>
          )}
        </View>
      </View>

      {/* Certifications */}
      <View style={styles.certificationsSection}>
        <Text style={styles.certificationsTitle}>Certifications</Text>
        <View style={styles.certifications}>
          {mockData.certifications.map((cert, index) => (
            <View key={index} style={styles.certificationBadge}>
              <Award size={12} color="#059669" />
              <Text style={styles.certificationText}>{cert}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Languages & Availability */}
      <View style={styles.detailsRow}>
        <View style={styles.detailColumn}>
          <Text style={styles.detailLabel}>Languages</Text>
          <Text style={styles.detailValue}>{mockData.languages.join(', ')}</Text>
        </View>
        <View style={styles.detailColumn}>
          <Text style={styles.detailLabel}>Availability</Text>
          <Text style={styles.detailValue}>{mockData.availability.join(', ')}</Text>
        </View>
      </View>

      <View style={styles.memberInfo}>
        <Text style={styles.memberText}>Member since {memberSince}</Text>
      </View>

      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.viewProfileButton}
            onPress={onViewProfile}
          >
            <Text style={styles.viewProfileText}>View Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.messageButton}
            onPress={onMessage}
          >
            <MessageCircle size={16} color="#FFFFFF" />
            <Text style={styles.messageText}>Message</Text>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 350,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  experience: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  experienceText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
    marginRight: 8,
  },
  verifiedIcon: {
    marginRight: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  rateContainer: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  rateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  bio: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  skillsSection: {
    marginBottom: 16,
  },
  skillsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillTag: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  certificationsSection: {
    marginBottom: 16,
  },
  certificationsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  certifications: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  certificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  certificationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
    marginLeft: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailColumn: {
    flex: 1,
    marginRight: 16,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#374151',
  },
  memberInfo: {
    marginBottom: 16,
  },
  memberText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  viewProfileButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2563EB',
    alignItems: 'center',
  },
  viewProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#2563EB',
  },
  messageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 6,
  },
});