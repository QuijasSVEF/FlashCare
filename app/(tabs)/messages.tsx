import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PaywallModal } from '../../components/PaywallModal';
import { EmergencyButton } from '../../components/EmergencyButton';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { Button } from '../../components/ui/Button';

export default function MessagesScreen() {
  const { user } = useAuth();
  const { isSubscriber } = useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);

  const handleStartMessaging = () => {
    if (!isSubscriber) {
      setShowPaywall(true);
    } else {
      // Navigate to messages list
      console.log('Access messaging features');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <EmergencyButton phoneNumber={user?.emergency_phone} />
      </View>

      {!isSubscriber ? (
        <View style={styles.upgradePrompt}>
          <Text style={styles.upgradeTitle}>Unlock Messaging</Text>
          <Text style={styles.upgradeText}>
            Connect with caregivers and families through secure messaging. 
            Upgrade to FlashCare Plus to start conversations.
          </Text>
          <Button
            title="Upgrade Now"
            onPress={handleStartMessaging}
            size="large"
            style={styles.upgradeButton}
          />
        </View>
      ) : (
        <View style={styles.messagesContent}>
          <Text style={styles.messagesTitle}>Your Conversations</Text>
          <Text style={styles.messagesText}>
            You can now message with your matches! 
            This feature is fully unlocked with your subscription.
          </Text>
        </View>
      )}

      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature="messaging"
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
  messagesContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  messagesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  messagesText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});