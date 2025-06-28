import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Platform 
} from 'react-native';
import { X, Calendar, Clock } from 'lucide-react-native';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { databaseService } from '../lib/database';

interface ScheduleModalProps {
  visible: boolean;
  onClose: () => void;
  matchId: string;
  otherUserName: string;
  onScheduleCreated?: () => void;
}

export function ScheduleModal({ 
  visible, 
  onClose, 
  matchId, 
  otherUserName,
  onScheduleCreated 
}: ScheduleModalProps) {
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleCreateSchedule = async () => {
    if (!formData.date || !formData.startTime || !formData.endTime) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Combine date and time
      const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

      if (endDateTime <= startDateTime) {
        Alert.alert('Error', 'End time must be after start time');
        return;
      }

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
        notes: '',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to create schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Schedule Care Session</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.subtitle}>
            Schedule a care session with {otherUserName}
          </Text>

          <Input
            label="Date"
            value={formData.date}
            onChangeText={(text) => setFormData(prev => ({ ...prev, date: text }))}
            placeholder="YYYY-MM-DD"
          />

          <Input
            label="Start Time"
            value={formData.startTime}
            onChangeText={(text) => setFormData(prev => ({ ...prev, startTime: text }))}
            placeholder="HH:MM (24-hour format)"
          />

          <Input
            label="End Time"
            value={formData.endTime}
            onChangeText={(text) => setFormData(prev => ({ ...prev, endTime: text }))}
            placeholder="HH:MM (24-hour format)"
          />

          <Input
            label="Notes (Optional)"
            value={formData.notes}
            onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
            placeholder="Any special instructions or notes..."
            multiline
            numberOfLines={3}
          />

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
        </View>
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
  createButton: {
    marginTop: 24,
    marginBottom: 16,
  },
  note: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});