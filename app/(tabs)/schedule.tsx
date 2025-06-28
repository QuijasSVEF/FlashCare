import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Calendar, Clock, User, MapPin } from 'lucide-react-native';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { EmergencyButton } from '../../components/EmergencyButton';
import { PaywallModal } from '../../components/PaywallModal';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';

// Mock schedule data
const mockSchedule = [
  {
    id: '1',
    caregiver: 'Sarah Johnson',
    family: 'Anderson Family',
    date: '2024-01-15',
    startTime: '09:00',
    endTime: '15:00',
    status: 'confirmed' as const,
    location: 'San Francisco, CA',
  },
  {
    id: '2',
    caregiver: 'Emily Chen',
    family: 'Williams Family',
    date: '2024-01-16',
    startTime: '10:00',
    endTime: '14:00',
    status: 'pending' as const,
    location: 'Oakland, CA',
  },
];

export default function ScheduleScreen() {
  const { user } = useAuth();
  const { isSubscriber } = useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);

  const handleScheduleAction = () => {
    if (!isSubscriber) {
      setShowPaywall(true);
    } else {
      console.log('Access scheduling features');
    }
  };

  const renderScheduleItem = ({ item }: { item: typeof mockSchedule[0] }) => {
    const otherParty = user?.role === 'family' ? item.caregiver : item.family;
    
    return (
      <Card style={styles.scheduleItem}>
        <View style={styles.scheduleHeader}>
          <View style={styles.scheduleInfo}>
            <Text style={styles.scheduleName}>{otherParty}</Text>
            <View style={styles.scheduleDetails}>
              <Calendar size={16} color="#6B7280" />
              <Text style={styles.scheduleDate}>{item.date}</Text>
            </View>
            <View style={styles.scheduleDetails}>
              <Clock size={16} color="#6B7280" />
              <Text style={styles.scheduleTime}>{item.startTime} - {item.endTime}</Text>
            </View>
            <View style={styles.scheduleDetails}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.scheduleLocation}>{item.location}</Text>
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
              onPress={handleScheduleAction}
              variant="secondary"
              size="small"
              style={styles.actionButton}
            />
            <Button
              title="Decline"
              onPress={handleScheduleAction}
              variant="outline"
              size="small"
              style={styles.actionButton}
            />
          </View>
        )}
      </Card>
    );
  };

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
            data={mockSchedule}
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