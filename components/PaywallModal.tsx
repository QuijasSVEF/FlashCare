import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { X, Crown, Check } from 'lucide-react-native';
import { Button } from './ui/Button';
import { useSubscription } from '../contexts/SubscriptionContext';

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  feature: string;
}

export function PaywallModal({ visible, onClose, feature }: PaywallModalProps) {
  const { purchaseSubscription, restorePurchases } = useSubscription();

  const handlePurchase = async () => {
    if (Platform.OS === 'web') {
      alert('Subscriptions are only available on mobile devices. Please use the iOS or Android app.');
      return;
    }
    const success = await purchaseSubscription();
    if (success) {
      onClose();
    }
  };

  const handleRestore = async () => {
    if (Platform.OS === 'web') {
      alert('Restore purchases is only available on mobile devices.');
      return;
    }
    const success = await restorePurchases();
    if (success) {
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Crown size={48} color="#F59E0B" />
          </View>

          <Text style={styles.title}>Upgrade to FlashCare Plus</Text>
          <Text style={styles.subtitle}>
            Unlock {feature} and all premium features
          </Text>

          <View style={styles.features}>
            <View style={styles.feature}>
              <Check size={20} color="#059669" />
              <Text style={styles.featureText}>Unlimited messaging</Text>
            </View>
            <View style={styles.feature}>
              <Check size={20} color="#059669" />
              <Text style={styles.featureText}>Video calls with caregivers</Text>
            </View>
            <View style={styles.feature}>
              <Check size={20} color="#059669" />
              <Text style={styles.featureText}>Advanced scheduling</Text>
            </View>
            <View style={styles.feature}>
              <Check size={20} color="#059669" />
              <Text style={styles.featureText}>Priority support</Text>
            </View>
          </View>

          <View style={styles.pricing}>
            <Text style={styles.price}>$10.00</Text>
            <Text style={styles.period}>per month</Text>
          </View>

          <Button
            title="Start Your Free Trial"
            onPress={handlePurchase}
            size="large"
            style={styles.purchaseButton}
          />

          <TouchableOpacity onPress={handleRestore} style={styles.restoreButton}>
            <Text style={styles.restoreText}>Restore Purchases</Text>
          </TouchableOpacity>

          <Text style={styles.terms}>
            Cancel anytime. Terms and conditions apply.
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  features: {
    width: '100%',
    marginBottom: 32,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  pricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 32,
  },
  price: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#111827',
  },
  period: {
    fontSize: 18,
    color: '#6B7280',
    marginLeft: 8,
  },
  purchaseButton: {
    width: '100%',
    marginBottom: 16,
  },
  restoreButton: {
    padding: 12,
    marginBottom: 32,
  },
  restoreText: {
    fontSize: 16,
    color: '#2563EB',
    textAlign: 'center',
  },
  terms: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});