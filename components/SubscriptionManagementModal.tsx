import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert 
} from 'react-native';
import { X, Crown, Check, CreditCard, Calendar, Zap } from 'lucide-react-native';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { useSubscription } from '../contexts/SubscriptionContext';

interface SubscriptionManagementModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SubscriptionManagementModal({ 
  visible, 
  onClose 
}: SubscriptionManagementModalProps) {
  const { isSubscriber, purchaseSubscription, restorePurchases } = useSubscription();
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const success = await purchaseSubscription();
      if (success) {
        Alert.alert('Success!', 'Welcome to FlashCare Plus! You now have access to all premium features.');
        onClose();
      } else {
        Alert.alert('Purchase Failed', 'Unable to complete purchase. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during purchase. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    try {
      const success = await restorePurchases();
      if (success) {
        Alert.alert('Restored!', 'Your subscription has been restored successfully.');
        onClose();
      } else {
        Alert.alert('No Purchases Found', 'No previous purchases found to restore.');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to restore purchases. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const premiumFeatures = [
    {
      icon: '💬',
      title: 'Unlimited Messaging',
      description: 'Chat with unlimited caregivers and families'
    },
    {
      icon: '📹',
      title: 'Video Calls',
      description: 'Secure video interviews and consultations'
    },
    {
      icon: '📅',
      title: 'Advanced Scheduling',
      description: 'Calendar sync and automated reminders'
    },
    {
      icon: '🔍',
      title: 'Priority Search',
      description: 'Advanced filters and priority placement'
    },
    {
      icon: '🛡️',
      title: 'Enhanced Verification',
      description: 'Priority background checks and verification'
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Detailed insights and performance metrics'
    }
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Crown size={24} color="#F59E0B" />
            <Text style={styles.title}>FlashCare Plus</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {isSubscriber ? (
            <Card style={styles.subscriberCard}>
              <View style={styles.subscriberHeader}>
                <View style={styles.subscriberBadge}>
                  <Crown size={20} color="#F59E0B" />
                  <Text style={styles.subscriberText}>Active Subscriber</Text>
                </View>
              </View>
              
              <Text style={styles.subscriberTitle}>You're all set!</Text>
              <Text style={styles.subscriberDescription}>
                You have access to all FlashCare Plus features. Your subscription will automatically renew.
              </Text>

              <View style={styles.subscriptionDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Plan:</Text>
                  <Text style={styles.detailValue}>FlashCare Plus Monthly</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Next billing:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Amount:</Text>
                  <Text style={styles.detailValue}>$9.99/month</Text>
                </View>
              </View>

              <Button
                title="Manage Subscription"
                onPress={() => Alert.alert('Manage Subscription', 'This will open your device\'s subscription management settings.')}
                variant="outline"
                style={styles.manageButton}
              />
            </Card>
          ) : (
            <>
              <View style={styles.heroSection}>
                <View style={styles.iconContainer}>
                  <Crown size={48} color="#F59E0B" />
                </View>
                <Text style={styles.heroTitle}>Unlock Premium Features</Text>
                <Text style={styles.heroSubtitle}>
                  Get the most out of FlashCare with our premium subscription
                </Text>
              </View>

              <View style={styles.pricingCard}>
                <View style={styles.pricingHeader}>
                  <Text style={styles.pricingTitle}>FlashCare Plus</Text>
                  <View style={styles.pricingBadge}>
                    <Text style={styles.pricingBadgeText}>Most Popular</Text>
                  </View>
                </View>
                
                <View style={styles.pricingDetails}>
                  <Text style={styles.price}>$9.99</Text>
                  <Text style={styles.period}>per month</Text>
                </View>
                
                <Text style={styles.pricingDescription}>
                  Cancel anytime • 7-day free trial
                </Text>
              </View>

              <View style={styles.featuresSection}>
                <Text style={styles.featuresTitle}>What's included:</Text>
                <View style={styles.featuresList}>
                  {premiumFeatures.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <Text style={styles.featureIcon}>{feature.icon}</Text>
                      <View style={styles.featureContent}>
                        <Text style={styles.featureTitle}>{feature.title}</Text>
                        <Text style={styles.featureDescription}>{feature.description}</Text>
                      </View>
                      <Check size={20} color="#059669" />
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.actions}>
                <Button
                  title={loading ? "Processing..." : "Start Free Trial"}
                  onPress={handlePurchase}
                  disabled={loading}
                  size="large"
                  style={styles.purchaseButton}
                />

                <TouchableOpacity onPress={handleRestore} style={styles.restoreButton}>
                  <Text style={styles.restoreText}>Restore Purchases</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Subscription automatically renews unless cancelled at least 24 hours before the end of the current period.
            </Text>
          </View>
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 8,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subscriberCard: {
    marginTop: 20,
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    borderWidth: 1,
  },
  subscriberHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  subscriberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  subscriberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D97706',
    marginLeft: 6,
  },
  subscriberTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  subscriberDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  subscriptionDetails: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  manageButton: {
    alignSelf: 'center',
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  pricingCard: {
    backgroundColor: '#F8FAFC',
    padding: 24,
    borderRadius: 16,
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  pricingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pricingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  pricingBadge: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pricingBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  pricingDetails: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#111827',
  },
  period: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 4,
  },
  pricingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  featuresSection: {
    marginBottom: 32,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  actions: {
    marginBottom: 32,
  },
  purchaseButton: {
    marginBottom: 16,
  },
  restoreButton: {
    alignItems: 'center',
    padding: 12,
  },
  restoreText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
  },
  footer: {
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 16,
  },
});