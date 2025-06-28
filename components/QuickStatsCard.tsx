import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star, Users, Calendar, Award } from 'lucide-react-native';
import { Card } from './ui/Card';
import { Colors } from '../constants/Colors';

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
      color: Colors.primary[500],
    },
    {
      icon: Calendar,
      label: 'Upcoming Sessions',
      value: stats.upcomingSchedules.toString(),
      color: Colors.secondary[500],
    },
    {
      icon: Star,
      label: 'Active Chats',
      value: stats.activeChats.toString(),
      color: Colors.success,
    },
  ];

  const caregiverStats = [
    {
      icon: Star,
      label: 'Rating',
      value: stats.rating ? stats.rating.toFixed(1) : 'N/A',
      color: Colors.warning,
    },
    {
      icon: Award,
      label: 'Reviews',
      value: stats.reviewCount?.toString() || '0',
      color: Colors.success,
    },
    {
      icon: Calendar,
      label: 'Completed Jobs',
      value: stats.completedJobs?.toString() || '0',
      color: Colors.primary[500],
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
    color: Colors.text.primary,
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
    color: Colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});