import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Calendar, Clock, User, MapPin } from 'lucide-react-native';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { EmergencyButton } from '../../components/EmergencyButton';
import { PaywallModal } from '../../components/PaywallModal';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useSchedules } from '../../hooks/useSchedules';
import { databaseService } from '../../lib/database';

export default function ScheduleScreen() {
  const { user } = useAuth();
  const { isSubscriber } = useSubscription();
  const { schedules, loading, refetch } = useSchedules();
  const [showPaywall, setShowPaywall] = useState(false);

  const handleScheduleAction = () => {
    if (!isSubscriber) {
      setShowPaywall(true);
    } else {
      console.log('Access scheduling features');
    }
  };

  const handleAcceptSchedule = async (scheduleId: string) => {
    try {
      await databaseService.updateScheduleStatus(scheduleId, 'confirmed');
      Alert.alert('Success', 'Schedule confirmed!');
      refetch();
    } catch (error) {
      Alert.alert('Error', 'Failed to confirm schedule');
    }
  };

  const handleDeclineSchedule = async (scheduleId: string) => {
    try {
      await databaseService.updateScheduleStatus(scheduleId, 'cancelled');
      Alert.alert('Success', 'Schedule declined');
      refetch();
    } catch (error) {
      Alert.alert('Error', 'Failed to decline schedule');
    }
  };

  const renderScheduleItem = ({ item }: { item: any }) => {
    const match = item.match;
    const otherUser = user?.role === 'family' ? match.caregiver : match.family;
    const startDate = new Date(item.start_ts);
    const endDate = new Date(item.end_ts);
    
    return (
      <Card style={styles.scheduleItem}>
        <View style={styles.scheduleHeader}>
          <View style={styles.scheduleInfo}>
            <Text style={styles.scheduleName}>{otherUser.name}</Text>
            <View style={styles.scheduleDetails}>
              <Calendar size={16} color="#6B7280" />
              <Text style={styles.scheduleDate}>
                {startDate.toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.scheduleDetails}>
              <Clock size={16} color="#6B7280" />
              <Text style={styles.scheduleTime}>
                {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            <View style={styles.scheduleDetails}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.scheduleLocation}>{otherUser.location || 'Location TBD'}</Text>
            </View>
          </View>
          
          <View style={[
            styles.statusBadge,
            item.status === 'confirmed' ? styles.confirmedBadge : styles.pendingBadge
          ]}>
            <Text style={[
              styles.statusText,
              item.status === 'confirmed' ? styles.confirmedText : styles.pendingText
            ]}>
              {item.status === 'confirmed' ? 'Confirmed' : 'Pending'}
            </Text>
          </View>
        </View>

        {user?.role === 'caregiver' && item.status === 'pending' && (
          <View style={styles.scheduleActions}>
            <Button
              title="Accept"
              onPress={() => handleAcceptSchedule(item.id)}
              variant="secondary"
              size="small"
              style={styles.actionButton}
            />
            <Button
              title="Decline"
              onPress={() => handleDeclineSchedule(item.id)}
              variant="outline"
              size="small"
              style={styles.actionButton}
            />
          </View>
        )}
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Schedule</Text>
          <EmergencyButton phoneNumber={user?.emergency_phone} />
        </View>
        
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Loading schedules...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Schedule</Text>
        <EmergencyButton phoneNumber={user?.emergency_phone} />
      </View>

      {!isSubscriber ? (
        <View style={styles.upgradePrompt}>
          <Text style={styles.upgradeTitle}>Unlock Advanced Scheduling</Text>
          <Text style={styles.upgradeText}>
            Manage your care schedule, book appointments, and coordinate with your matches. 
            Upgrade to access full scheduling features.
          </Text>
          <Button
            title="Upgrade Now"
            onPress={handleScheduleAction}
            size="large"
            style={styles.upgradeButton}
          />
        </View>
      ) : (
        <>
          {user?.role === 'family' && (
            <View style={styles.quickActions}>
              <Button
                title="Schedule New Session"
                onPress={handleScheduleAction}
                style={styles.newSessionButton}
              />
            </View>
          )}

          <FlatList
            data={schedules}
            renderItem={renderScheduleItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.scheduleList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No scheduled sessions</Text>
                <Text style={styles.emptyText}>
                  {user?.role === 'family' 
                    ? "Schedule sessions with your matched caregivers"
                    : "You'll see your upcoming care sessions here"
                  }
                </Text>
              </View>
            }
          />
        </>
      )}

      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature="advanced scheduling"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  newSessionButton: {
    width: '100%',
  },
  scheduleList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  scheduleItem: {
    marginBottom: 0,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  scheduleDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  scheduleDate: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  scheduleTime: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  scheduleLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  confirmedBadge: {
    backgroundColor: '#D1FAE5',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  confirmedText: {
    color: '#059669',
  },
  pendingText: {
    color: '#D97706',
  },
  scheduleActions: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  upgradePrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  upgradeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  upgradeText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  upgradeButton: {
    width: '100%',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});