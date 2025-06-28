import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star, Users, Calendar, Award } from 'lucide-react-native';
import { Card } from './ui/Card';

interface QuickStatsCardProps {
  userRole: 'family' | 'caregiver';
  stats: {
    totalMatches: number;
    activeChats: number;
    upcomingSchedules: number;
    rating?: number;
    reviewCount?: number;
    completedJobs?: number;
  };
}

export function QuickStatsCard({ userRole, stats }: QuickStatsCardProps) {
  const familyStats = [
    {
      icon: Users,
      label: 'Total Matches',
      value: stats.totalMatches.toString(),
      color: '#2563EB',
    },
    {
      icon: Calendar,
      label: 'Upcoming Sessions',
      value: stats.upcomingSchedules.toString(),
      color: '#7C3AED',
    },
    {
      icon: Star,
      label: 'Active Chats',
      value: stats.activeChats.toString(),
      color: '#059669',
    },
  ];

  const caregiverStats = [
    {
      icon: Star,
      label: 'Rating',
      value: stats.rating ? stats.rating.toFixed(1) : 'N/A',
      color: '#F59E0B',
    },
    {
      icon: Award,
      label: 'Reviews',
      value: stats.reviewCount?.toString() || '0',
      color: '#059669',
    },
    {
      icon: Calendar,
      label: 'Completed Jobs',
      value: stats.completedJobs?.toString() || '0',
      color: '#2563EB',
    },
  ];

  const displayStats = userRole === 'family' ? familyStats : caregiverStats;

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Your Stats</Text>
      <View style={styles.statsGrid}>
        {displayStats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <View style={[styles.iconContainer, { backgroundColor: `${stat.color}15` }]}>
              <stat.icon size={20} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  title: {
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
    flex: 1,
  },
  iconContainer: {
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
});