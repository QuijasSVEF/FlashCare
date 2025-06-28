import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { MapPin, Star, Clock } from 'lucide-react-native';
import { Card } from './ui/Card';

interface CaregiverCardProps {
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
}

export function CaregiverCard({ caregiver }: CaregiverCardProps) {
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
            <Star size={16} color="#F59E0B" />
            <Text style={styles.ratingText}>4.8</Text>
            <Text style={styles.ratingCount}>(127 reviews)</Text>
          </View>
          <View style={styles.location}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.locationText}>{caregiver.location || 'San Francisco, CA'}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.bio} numberOfLines={3}>
        {caregiver.bio || 'Experienced caregiver with 5+ years helping families. Specializing in senior care and disability support. Certified in CPR and first aid.'}
      </Text>

      <View style={styles.details}>
        <View style={styles.detail}>
          <Clock size={16} color="#6B7280" />
          <Text style={styles.detailText}>5+ years</Text>
        </View>
        <View style={styles.rate}>
          <Text style={styles.rateText}>$25/hr</Text>
        </View>
      </View>
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
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  bio: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  rate: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
  },
});