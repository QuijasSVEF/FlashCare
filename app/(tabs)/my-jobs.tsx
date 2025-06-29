import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Plus, MapPin, Clock, DollarSign, Users, CreditCard as Edit3, Trash2 } from 'lucide-react-native';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { EmergencyButton } from '../../components/EmergencyButton';
import { AppHeader } from '../../components/AppHeader';
import { useAuth } from '../../contexts/AuthContext';
import { databaseService } from '../../lib/database';

export default function MyJobsScreen() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id && user?.role === 'family') {
      loadJobs();
    }
  }, [user]);

  const loadJobs = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const userJobs = await databaseService.getUserJobPosts(user.id);
      setJobs(userJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = (jobId: string, jobTitle: string) => {
    Alert.alert(
      'Delete Job Posting',
      `Are you sure you want to delete "${jobTitle}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await databaseService.deleteJobPost(jobId);
              Alert.alert('Success', 'Job posting deleted successfully');
              loadJobs();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete job posting');
            }
          },
        },
      ]
    );
  };

  const handleEditJob = (job: any) => {
    router.push({
      pathname: '/(tabs)/edit-job',
      params: { jobId: job.id }
    });
  };

  const renderJobItem = ({ item }: { item: any }) => {
    const weeklyTotal = item.hours_per_week * item.rate_hour;
    
    return (
      <Card style={styles.jobCard}>
        <View style={styles.jobHeader}>
          <View style={styles.jobInfo}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.jobDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </View>

          <View style={styles.jobActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEditJob(item)}
            >
              <Edit3 size={16} color="#2563EB" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteJob(item.id, item.title)}
            >
              <Trash2 size={16} color="#DC2626" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.jobDetails}>
          <View style={styles.detailItem}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
          <View style={styles.detailItem}>
            <Clock size={14} color="#6B7280" />
            <Text style={styles.detailText}>{item.hours_per_week} hrs/week</Text>
          </View>
          <View style={styles.detailItem}>
            <DollarSign size={14} color="#6B7280" />
            <Text style={styles.detailText}>${item.rate_hour}/hr</Text>
          </View>
        </View>

        <View style={styles.jobFooter}>
          <View style={styles.weeklyTotal}>
            <Text style={styles.weeklyTotalText}>
              ${weeklyTotal.toFixed(2)}/week
            </Text>
          </View>

          <View style={styles.applicants}>
            <Users size={16} color="#059669" />
            <TouchableOpacity
              onPress={() => router.push({
                pathname: '/(tabs)/job-applicants',
                params: { jobId: item.id, jobTitle: item.title }
              })}
            >
              <Text style={styles.applicantsText}>0 applicants</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.postedDate}>
          Posted {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </Card>
      </Card>
    );
  };

  if (user?.role !== 'family') {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Access Denied</Text>
          <Text style={styles.errorText}>
            Only family members can view job postings.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="My Job Postings"
        subtitle="Manage your care job listings"
      />

      <View style={styles.quickActions}>
        <Button
          title="Create New Job"
          onPress={() => router.push('/(tabs)/create-job')}
          style={styles.createButton}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your job postings...</Text>
        </View>
      ) : (
        <FlatList
          data={jobs}
          renderItem={renderJobItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.jobsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Plus size={48} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No job postings yet</Text>
              <Text style={styles.emptyText}>
                Create your first job posting to start finding caregivers for your family.
              </Text>
              <Button
                title="Create Your First Job"
                onPress={() => router.push('/(tabs)/create-job')}
                style={styles.emptyButton}
              />
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  quickActions: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  createButton: {
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  jobsList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  jobCard: {
    marginBottom: 0,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobInfo: {
    flex: 1,
    marginRight: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  jobDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  jobActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  jobDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  weeklyTotal: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  weeklyTotalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  applicants: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  applicantsText: {
    fontSize: 14,
    color: '#059669',
    marginLeft: 4,
    fontWeight: '600',
  },
  postedDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyButton: {
    width: '100%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});