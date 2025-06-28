import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, DollarSign, Clock, MapPin } from 'lucide-react-native';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { AppHeader } from '../../components/AppHeader';
import { useAuth } from '../../contexts/AuthContext';
import { databaseService } from '../../lib/database';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationBanner } from '../../components/NotificationBanner';

export default function CreateJobScreen() {
  const { user } = useAuth();
  const { notifications, showSuccess, showError, hideNotification } = useNotifications();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: user?.location || '',
    hours_per_week: '',
    rate_hour: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleCreateJob = async () => {
    if (!validateForm() || !user?.id) return;

    setLoading(true);
    try {
      const jobData = {
        family_id: user.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        hours_per_week: parseInt(formData.hours_per_week),
        rate_hour: parseFloat(formData.rate_hour),
      };

      await databaseService.createJobPost(jobData);
      
      showSuccess(
        'Job Posted Successfully!',
        'Your job posting is now live and caregivers can start applying.'
      );
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        location: user?.location || '',
        hours_per_week: '',
        rate_hour: '',
      });
    } catch (error: any) {
      showError('Error', error.message || 'Failed to create job posting');
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
            Only family members can create job postings.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {notifications.map((notification) => (
        <NotificationBanner
          key={notification.id}
          visible={notification.visible}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onDismiss={() => hideNotification(notification.id)}
        />
      ))}
      
      <AppHeader
        title="Create Job Posting"
        subtitle="Find the perfect caregiver for your family"
        emergencyPhone={user?.emergency_phone}
      />

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
          <Text style={styles.summaryTitle}>Job Summary</Text>
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

        <Button
          title={loading ? "Creating Job..." : "Post Job"}
          onPress={handleCreateJob}
          disabled={loading}
          size="large"
          style={styles.createButton}
        />

        <Text style={styles.disclaimer}>
          By posting this job, you agree to our Terms of Service and Community Guidelines. All caregivers are background checked and verified.
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
  formCard: {
    marginHorizontal: 20,
    marginTop: 20,
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
  createButton: {
    marginBottom: 16,
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
});