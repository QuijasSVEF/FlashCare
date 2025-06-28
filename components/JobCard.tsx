import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { MapPin, Clock, DollarSign, User } from 'lucide-react-native';
import { Card } from './ui/Card';

interface JobCardProps {
  job: {
    id: string;
    title: string;
    description: string;
    location: string;
    hours_per_week: number;
    rate_hour: number;
    created_at: string;
    family: {
      id: string;
      name: string;
      avatar_url?: string;
      location?: string;
    };
  };
}

export function JobCard({ job }: JobCardProps) {
  const weeklyEarnings = job.hours_per_week * job.rate_hour;
  const timeAgo = new Date(job.created_at);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - timeAgo.getTime()) / (1000 * 60 * 60));
  
  let timeText = '';
  if (diffInHours < 1) timeText = 'Just posted';
  else if (diffInHours < 24) timeText = `${diffInHours}h ago`;
  else timeText = `${Math.floor(diffInHours / 24)}d ago`;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{job.title}</Text>
        
        <View style={styles.familyInfo}>
          <Image
            source={{ 
              uri: job.family.avatar_url || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'
            }}
            style={styles.avatar}
          />
          <View style={styles.info}>
            <Text style={styles.familyName}>{job.family.name}</Text>
            <View style={styles.location}>
              <MapPin size={14} color="#6B7280" />
              <Text style={styles.locationText}>{job.location}</Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={4}>
        {job.description}
      </Text>

      <View style={styles.details}>
        <View style={styles.detail}>
          <Clock size={16} color="#6B7280" />
          <Text style={styles.detailText}>{job.hours_per_week} hrs/week</Text>
        </View>
        <View style={styles.detail}>
          <DollarSign size={16} color="#6B7280" />
          <Text style={styles.detailText}>${job.rate_hour}/hour</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.earnings}>
          <Text style={styles.earningsText}>
            ${weeklyEarnings.toFixed(2)}/week
          </Text>
        </View>
        <Text style={styles.timeText}>{timeText}</Text>
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
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  familyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  familyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
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
  description: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  details: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  earnings: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  earningsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
  },
  timeText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});