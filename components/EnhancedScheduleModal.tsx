import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ScrollView 
} from 'react-native';
import { X, Calendar, Clock, MapPin, DollarSign } from 'lucide-react-native';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { databaseService } from '../lib/database';
import { Colors } from '../constants/Colors';

interface EnhancedScheduleModalProps {
  visible: boolean;
  onClose: () => void;
  matchId: string;
  otherUserName: string;
  jobDetails?: {
    title: string;
    rate_hour: number;
    location: string;
  };
  onScheduleCreated?: () => void;
}

export function EnhancedScheduleModal({ 
  visible, 
  onClose, 
  matchId, 
  otherUserName,
  jobDetails,
  onScheduleCreated 
}: EnhancedScheduleModalProps) {
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    location: jobDetails?.location || '',
    notes: '',
    recurring: false,
  });
  const [loading, setLoading] = useState(false);

  const calculateDuration = () => {
    if (!formData.startTime || !formData.endTime) return 0;
    
    const start = new Date(`2000-01-01T${formData.startTime}`);
    const end = new Date(`2000-01-01T${formData.endTime}`);
    
    if (end <= start) return 0;
    
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60); // hours
  };

  const calculateEstimatedCost = () => {
    const duration = calculateDuration();
    const rate = jobDetails?.rate_hour || 25;
    return duration * rate;
  };

  const handleCreateSchedule = async () => {
    if (!formData.date || !formData.startTime || !formData.endTime) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const duration = calculateDuration();
    if (duration <= 0) {
      Alert.alert('Error', 'End time must be after start time');
      return;
    }

    setLoading(true);
    try {
      // Combine date and time
      const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

      const scheduleData = {
        match_id: matchId,
        start_ts: startDateTime.toISOString(),
        end_ts: endDateTime.toISOString(),
        status: 'pending' as const,
      };

      await databaseService.createSchedule(scheduleData);
      
      Alert.alert(
        'Schedule Request Sent!', 
        `Your schedule request has been sent to ${otherUserName}. They will receive a notification to accept or decline.`
      );
      
      onScheduleCreated?.();
      onClose();
      
      // Reset form
      setFormData({
        date: '',
        startTime: '',
        endTime: '',
        location: jobDetails?.location || '',
        notes: '',
        recurring: false,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to create schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const suggestedTimes = [
    { label: 'Morning', start: '09:00', end: '12:00' },
    { label: 'Afternoon', start: '13:00', end: '17:00' },
    { label: 'Evening', start: '18:00', end: '21:00' },
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Schedule Care Session</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.subtitle}>
            Schedule a care session with {otherUserName}
          </Text>

          {jobDetails && (
            <View style={styles.jobSummary}>
              <Text style={styles.jobTitle}>{jobDetails.title}</Text>
              <View style={styles.jobDetails}>
                <View style={styles.jobDetail}>
                  <DollarSign size={16} color="#059669" />
                  <Text style={styles.jobDetailText}>${jobDetails.rate_hour}/hour</Text>
                </View>
                <View style={styles.jobDetail}>
                  <MapPin size={16} color="#6B7280" />
                  <Text style={styles.jobDetailText}>{jobDetails.location}</Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date & Time</Text>
            
            <Input
              label="Date"
              value={formData.date}
              onChangeText={(text) => setFormData(prev => ({ ...prev, date: text }))}
              placeholder="YYYY-MM-DD"
            />

            <View style={styles.timeRow}>
              <View style={styles.timeInput}>
                <Input
                  label="Start Time"
                  value={formData.startTime}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, startTime: text }))}
                  placeholder="HH:MM"
                />
              </View>
              <View style={styles.timeInput}>
                <Input
                  label="End Time"
                  value={formData.endTime}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, endTime: text }))}
                  placeholder="HH:MM"
                />
              </View>
            </View>

            <Text style={styles.suggestedLabel}>Quick Select:</Text>
            <View style={styles.suggestedTimes}>
              {suggestedTimes.map((time) => (
                <TouchableOpacity
                  key={time.label}
                  style={styles.timeButton}
                  onPress={() => setFormData(prev => ({
                    ...prev,
                    startTime: time.start,
                    endTime: time.end,
                  }))}
                >
                  <Text style={styles.timeButtonText}>{time.label}</Text>
                  <Text style={styles.timeButtonSubtext}>
                    {time.start} - {time.end}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Input
            label="Location"
            value={formData.location}
            onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
            placeholder="Where will the care take place?"
          />

          <Input
            label="Notes (Optional)"
            value={formData.notes}
            onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
            placeholder="Any special instructions or notes..."
            multiline
            numberOfLines={3}
          />

          {calculateDuration() > 0 && (
            <View style={styles.summary}>
              <Text style={styles.summaryTitle}>Session Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Duration:</Text>
                <Text style={styles.summaryValue}>
                  {calculateDuration().toFixed(1)} hours
                </Text>
              </View>
              {jobDetails && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Estimated Cost:</Text>
                  <Text style={styles.summaryValue}>
                    ${calculateEstimatedCost().toFixed(2)}
                  </Text>
                </View>
              )}
            </View>
          )}

          <Button
            title={loading ? "Creating..." : "Send Schedule Request"}
            onPress={handleCreateSchedule}
            disabled={loading}
            size="large"
            style={styles.createButton}
          />

          <Text style={styles.note}>
            The caregiver will receive your request and can accept or decline. 
            You'll be notified of their response.
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  jobSummary: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  jobDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  jobDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobDetailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeInput: {
    flex: 1,
  },
  suggestedLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  suggestedTimes: {
    flexDirection: 'row',
    gap: 8,
  },
  timeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  timeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  timeButtonSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  summary: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  createButton: {
    marginBottom: 16,
  },
  note: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 40,
  },
});