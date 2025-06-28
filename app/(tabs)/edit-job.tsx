import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, DollarSign, Clock, MapPin } from 'lucide-react-native';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { databaseService } from '../../lib/database';

export default function EditJobScreen() {
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    hours_per_week: '',
    rate_hour: '',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (jobId) {
      loadJobData();
    }
  }, [jobId]);

  const loadJobData = async () => {
    try {
      setInitialLoading(true);
      const jobs = await databaseService.getUserJobPosts(user?.id || '');
      const job = jobs.find(j => j.id === jobId);
      
      if (job) {
        setFormData({
          title: job.title,
          description: job.description,
          location: job.location,
          hours_per_week: job.hours_per_week.toString(),
          rate_hour: job.rate_hour.toString(),
        });
      } else {
        Alert.alert('Error', 'Job not found');
        router.back();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load job data');
      router.back();
    } finally {
      setInitialLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.description.trim()) newErrors.description = 'Job description is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.hours_per_week || isNaN(Number(formData.hours_per_week))) {
      newErrors.hours_per_week = 'Valid hours per week is required';
    }
    if (!formData.rate_hour || isNaN(Number(formData.rate_hour))) {
      newErrors.rate_hour = 'Valid hourly rate is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateJob = async () => {
    if (!validateForm() || !jobId) return;

    setLoading(true);
    try {
      const updates = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        hours_per_week: parseInt(formData.hours_per_week),
        rate_hour: parseFloat(formData.rate_hour),
      };

      await databaseService.updateJobPost(jobId, updates);
      
      Alert.alert(
        'Job Updated Successfully!',
        'Your job posting has been updated.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update job posting');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'family') {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Access Denied</Text>
          <Text style={styles.errorText}>
            Only family members can edit job postings.
          </Text>
        </View>
      </View>
    );
  }

  if (initialLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading job details...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Edit Job Posting</Text>
        <Text style={styles.headerSubtitle}>
          Update your job details to attract the right caregivers
        </Text>
      </View>

      <Card style={styles.formCard}>
        <Input
          label="Job Title"
          value={formData.title}
          onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
          placeholder="e.g., Part-time Elderly Care Assistant"
          error={errors.title}
        />

        <Input
          label="Job Description"
          value={formData.description}
          onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
          placeholder="Describe the care needed, responsibilities, and requirements..."
          multiline
          numberOfLines={6}
          style={styles.descriptionInput}
          error={errors.description}
        />

        <Input
          label="Location"
          value={formData.location}
          onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
          placeholder="City, State"
          error={errors.location}
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Input
              label="Hours per Week"
              value={formData.hours_per_week}
              onChangeText={(text) => setFormData(prev => ({ ...prev, hours_per_week: text }))}
              placeholder="20"
              keyboardType="numeric"
              error={errors.hours_per_week}
            />
          </View>

          <View style={styles.halfWidth}>
            <Input
              label="Hourly Rate ($)"
              value={formData.rate_hour}
              onChangeText={(text) => setFormData(prev => ({ ...prev, rate_hour: text }))}
              placeholder="25.00"
              keyboardType="decimal-pad"
              error={errors.rate_hour}
            />
          </View>
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Updated Job Summary</Text>
          <View style={styles.summaryItem}>
            <Clock size={16} color="#6B7280" />
            <Text style={styles.summaryText}>
              {formData.hours_per_week || '0'} hours per week
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <DollarSign size={16} color="#6B7280" />
            <Text style={styles.summaryText}>
              ${formData.rate_hour || '0'}/hour
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.summaryText}>
              {formData.location || 'Location not set'}
            </Text>
          </View>
          {formData.hours_per_week && formData.rate_hour && (
            <View style={styles.totalEarnings}>
              <Text style={styles.totalText}>
                Estimated weekly cost: ${(parseFloat(formData.rate_hour || '0') * parseInt(formData.hours_per_week || '0')).toFixed(2)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.buttonRow}>
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="outline"
            style={styles.cancelButton}
          />
          <Button
            title={loading ? "Updating..." : "Update Job"}
            onPress={handleUpdateJob}
            disabled={loading}
            style={styles.updateButton}
          />
        </View>

        <Text style={styles.disclaimer}>
          Changes will be visible to caregivers immediately after updating.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  formCard: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  summary: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  totalEarnings: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  cancelButton: {
    flex: 1,
  },
  updateButton: {
    flex: 1,
  },
  disclaimer: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 16,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
});