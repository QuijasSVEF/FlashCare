import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Calendar, Clock, User, MapPin, CircleCheck as CheckCircle, Circle as XCircle, Plus, Video } from 'lucide-react-native';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AppHeader } from '../../components/AppHeader';
import { PaywallModal } from '../../components/PaywallModal';
import { EnhancedScheduleModal } from '../../components/EnhancedScheduleModal';
import { VideoCallModal } from '../../components/VideoCallModal';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useSchedules } from '../../hooks/useSchedules';
import { databaseService } from '../../lib/database';
import { Colors } from '../../constants/Colors';

export default function ScheduleScreen() {
  const { user } = useAuth();
  const { isSubscriber } = useSubscription();
  const { schedules, loading, refetch } = useSchedules();
  const [showPaywall, setShowPaywall] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [callPartner, setCallPartner] = useState<string>('');

  const handleScheduleAction = () => {
    if (!isSubscriber) {
      setShowPaywall(true);
    } else {
      console.log('Access scheduling features');
    }
  };

  const handleNewSession = () => {
    if (!isSubscriber) {
      setShowPaywall(true);
    } else {
      // For demo, we'll use a mock match - in production, show match selection
      setSelectedMatch({
        id: 'demo-match',
        otherUser: { name: 'Sarah Johnson' },
        jobDetails: {
          title: 'Senior Care Assistant',
          rate_hour: 25,
          location: 'San Francisco, CA'
        }
      });
      setShowScheduleModal(true);
    }
  };

  const handleVideoCall = (partnerName: string) => {
    setCallPartner(partnerName);
    setShowVideoCall(true);
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
    Alert.alert(
      'Decline Schedule',
      'Are you sure you want to decline this schedule?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: async () => {
            try {
              await databaseService.updateScheduleStatus(scheduleId, 'cancelled');
              Alert.alert('Schedule declined');
              refetch();
            } catch (error) {
              Alert.alert('Error', 'Failed to decline schedule');
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return Colors.success;
      case 'pending':
        return Colors.warning;
      case 'cancelled':
        return Colors.error;
      default:
        return Colors.gray[400];
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return CheckCircle;
      case 'cancelled':
        return XCircle;
      default:
        return Clock;
    }
  };

  const renderScheduleItem = ({ item }: { item: any }) => {
    const match = item.match;
    const otherUser = user?.role === 'family' ? match.caregiver : match.family;
    const startDate = new Date(item.start_ts);
    const endDate = new Date(item.end_ts);
    const StatusIcon = getStatusIcon(item.status);
    const statusColor = getStatusColor(item.status);
    const isUpcoming = startDate > new Date();
    const isToday = startDate.toDateString() === new Date().toDateString();
    
    return (
      <Card style={styles.scheduleItem}>
        <View style={styles.scheduleHeader}>
          <View style={styles.scheduleInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.scheduleName}>{otherUser.name}</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
                <StatusIcon size={14} color={statusColor} />
                <Text style={[styles.statusText, { color: statusColor }]}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Text>
              </View>
            </View>
            
            <View style={styles.scheduleDetails}>
              <View style={styles.detailRow}>
                <Calendar size={16} color={Colors.text.secondary} />
                <Text style={[styles.scheduleDate, isToday && styles.todayText]}>
                  {startDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                  {isToday && ' (Today)'}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Clock size={16} color={Colors.text.secondary} />
                <Text style={styles.scheduleTime}>
                  {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                  {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <MapPin size={16} color={Colors.text.secondary} />
                <Text style={styles.scheduleLocation}>
                  {otherUser.location || 'Location TBD'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {item.status === 'confirmed' && isUpcoming && (
          <View style={styles.scheduleActions}>
            <Button
              title="Start Video Call"
              onPress={() => handleVideoCall(otherUser.name)}
              variant="primary"
              size="small"
              style={styles.videoButton}
            />
          </View>
        )}

        {user?.role === 'caregiver' && item.status === 'pending' && (
          <View style={styles.scheduleActions}>
            <Button
              title="Accept"
              onPress={() => handleAcceptSchedule(item.id)}
              variant="success"
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
        <AppHeader
          title="Schedule"
        />
        
        <View style={styles.loadingContainer}>
          <Calendar size={48} color={Colors.primary[500]} />
          <Text style={styles.loadingText}>Loading your schedule...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Your Schedule"
        subtitle={`${schedules.length} upcoming session${schedules.length !== 1 ? 's' : ''}`}
      />

      {user?.role === 'family' && (
        <View style={styles.quickActions}>
          <Button
            title="Schedule New Session"
            onPress={handleNewSession}
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
            <View style={styles.emptyIcon}>
              <Calendar size={64} color={Colors.gray[300]} />
            </View>
            <Text style={styles.emptyTitle}>No scheduled sessions</Text>
            <Text style={styles.emptyText}>
              {user?.role === 'family' 
                ? "Schedule sessions with your matched caregivers to get started"
                : "You'll see your upcoming care sessions here once families book with you"
              }
            </Text>
            {user?.role === 'family' && (
              <TouchableOpacity
                style={styles.scheduleButton}
                onPress={handleNewSession}
              >
                <Plus size={20} color={Colors.text.inverse} />
                <Text style={styles.scheduleButtonText}>Schedule Session</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature="advanced scheduling"
      />

      {selectedMatch && (
        <EnhancedScheduleModal
          visible={showScheduleModal}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedMatch(null);
          }}
          matchId={selectedMatch.id}
          otherUserName={selectedMatch.otherUser.name}
          jobDetails={selectedMatch.jobDetails}
          onScheduleCreated={() => {
            refetch();
            setShowScheduleModal(false);
            setSelectedMatch(null);
          }}
        />
      )}

      <VideoCallModal
        visible={showVideoCall}
        onClose={() => setShowVideoCall(false)}
        otherUserName={callPartner}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 16,
    textAlign: 'center',
  },
  quickActions: {
    paddingHorizontal: 20,
    paddingTop: 20,
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
    marginBottom: 12,
  },
  scheduleHeader: {
    marginBottom: 16,
  },
  scheduleInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scheduleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  scheduleDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleDate: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  todayText: {
    color: Colors.primary[500],
    fontWeight: '600',
  },
  scheduleTime: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  scheduleLocation: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  scheduleActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  videoButton: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[500],
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: Colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  scheduleButtonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});