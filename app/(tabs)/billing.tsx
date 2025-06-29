import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CreditCard, Crown, Calendar, Receipt, Settings, ChevronRight, Download, Eye } from 'lucide-react-native';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AppHeader } from '../../components/AppHeader';
import { SubscriptionManagementModal } from '../../components/SubscriptionManagementModal';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';

export default function BillingScreen() {
  const { user } = useAuth();
  const { isSubscriber } = useSubscription();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const billingHistory = [
    {
      id: '1',
      date: '2024-01-15',
      description: 'FlashCare Plus Monthly',
      amount: '$9.99',
      status: 'paid',
      invoice: 'INV-2024-001'
    },
    {
      id: '2',
      date: '2023-12-15',
      description: 'FlashCare Plus Monthly',
      amount: '$9.99',
      status: 'paid',
      invoice: 'INV-2023-012'
    },
    {
      id: '3',
      date: '2023-11-15',
      description: 'FlashCare Plus Monthly',
      amount: '$9.99',
      status: 'paid',
      invoice: 'INV-2023-011'
    }
  ];

  const paymentMethods = [
    {
      id: '1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    },
    {
      id: '2',
      type: 'card',
      last4: '5555',
      brand: 'Mastercard',
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false
    }
  ];

  const handleDownloadInvoice = (invoiceId: string) => {
    console.log('Downloading invoice:', invoiceId);
    // In production, this would download the actual invoice
  };

  const handleViewInvoice = (invoiceId: string) => {
    console.log('Viewing invoice:', invoiceId);
    // In production, this would open the invoice in a modal or new tab
  };

  return (
    <ScrollView style={styles.container}>
      <AppHeader
        title="Billing & Subscription"
        subtitle="Manage your FlashCare subscription and billing"
      />

      <View style={styles.content}>
        {/* Current Plan */}
        <Card style={styles.planCard}>
          <View style={styles.planHeader}>
            <View style={styles.planInfo}>
              <View style={styles.planTitleContainer}>
                {isSubscriber && <Crown size={20} color="#F59E0B" />}
                <Text style={styles.planTitle}>
                  {isSubscriber ? 'FlashCare Plus' : 'FlashCare Free'}
                </Text>
              </View>
              <Text style={styles.planDescription}>
                {isSubscriber 
                  ? 'Premium features unlocked - Full access enabled'
                  : 'Basic features included'
                }
              </Text>
            </View>
            
            <View style={styles.planPricing}>
              <Text style={styles.planPrice}>
                {isSubscriber ? '$9.99' : 'Free'}
              </Text>
              {isSubscriber && (
                <Text style={styles.planPeriod}>per month</Text>
              )}
            </View>
          </View>

          {isSubscriber ? (
            <View style={styles.subscriptionDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Next billing date:</Text>
                <Text style={styles.detailValue}>
                  {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Auto-renewal:</Text>
                <Text style={styles.detailValue}>Enabled</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Plan status:</Text>
                <Text style={[styles.detailValue, { color: '#059669' }]}>Active</Text>
              </View>
            </View>
          ) : (
            <View style={styles.upgradePrompt}>
              <Text style={styles.upgradeText}>
                Unlock premium features with FlashCare Plus
              </Text>
              <Button
                title="Upgrade Now"
                onPress={() => setShowSubscriptionModal(true)}
                style={styles.upgradeButton}
              />
            </View>
          )}
        </Card>

        {/* Payment Methods */}
        <Card style={styles.paymentMethodsCard}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          
          {paymentMethods.map((method) => (
            <View key={method.id} style={styles.paymentMethod}>
              <View style={styles.paymentMethodInfo}>
                <View style={styles.cardIcon}>
                  <CreditCard size={20} color="#2563EB" />
                </View>
                <View style={styles.cardDetails}>
                  <Text style={styles.cardBrand}>
                    {method.brand} •••• {method.last4}
                  </Text>
                  <Text style={styles.cardExpiry}>
                    Expires {method.expiryMonth}/{method.expiryYear}
                  </Text>
                </View>
                {method.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity style={styles.editPaymentButton}>
                <Settings size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          ))}
          
          <Button
            title="Add Payment Method"
            variant="outline"
            onPress={() => console.log('Add payment method')}
            style={styles.addPaymentButton}
          />
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Text style={styles.sectionTitle}>Subscription Management</Text>
          
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => setShowSubscriptionModal(true)}
          >
            <View style={styles.actionIcon}>
              <Crown size={20} color="#2563EB" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>
                {isSubscriber ? 'Manage Subscription' : 'Upgrade to Plus'}
              </Text>
              <Text style={styles.actionDescription}>
                {isSubscriber 
                  ? 'View details and manage your subscription'
                  : 'Unlock all premium features'
                }
              </Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Receipt size={20} color="#2563EB" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Download Receipts</Text>
              <Text style={styles.actionDescription}>
                Get receipts for tax purposes
              </Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Calendar size={20} color="#2563EB" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Billing History</Text>
              <Text style={styles.actionDescription}>
                View all past transactions
              </Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </Card>

        {/* Billing History */}
        {isSubscriber && (
          <Card style={styles.historyCard}>
            <Text style={styles.sectionTitle}>Recent Billing History</Text>
            
            {billingHistory.map((item) => (
              <View key={item.id} style={styles.historyItem}>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyDescription}>{item.description}</Text>
                  <Text style={styles.historyDate}>
                    {new Date(item.date).toLocaleDateString()} • {item.invoice}
                  </Text>
                </View>
                
                <View style={styles.historyActions}>
                  <Text style={styles.historyPrice}>{item.amount}</Text>
                  <View style={styles.historyButtons}>
                    <TouchableOpacity 
                      style={styles.historyButton}
                      onPress={() => handleViewInvoice(item.invoice)}
                    >
                      <Eye size={14} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.historyButton}
                      onPress={() => handleDownloadInvoice(item.invoice)}
                    >
                      <Download size={14} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
            
            <Button
              title="View All History"
              variant="outline"
              onPress={() => console.log('View all history')}
              style={styles.viewAllButton}
            />
          </Card>
        )}

        {/* Features Comparison */}
        <Card style={styles.featuresCard}>
          <Text style={styles.sectionTitle}>Plan Features</Text>
          
          <View style={styles.featuresTable}>
            <View style={styles.featureRow}>
              <Text style={styles.featureLabel}>Basic messaging</Text>
              <Text style={styles.featureValue}>✓</Text>
            </View>
            
            <View style={styles.featureRow}>
              <Text style={styles.featureLabel}>Unlimited messaging</Text>
              <Text style={[
                styles.featureValue,
                isSubscriber ? styles.featureIncluded : styles.featureExcluded
              ]}>
                {isSubscriber ? '✓' : '✗'}
              </Text>
            </View>
            
            <View style={styles.featureRow}>
              <Text style={styles.featureLabel}>Video calls</Text>
              <Text style={[
                styles.featureValue,
                isSubscriber ? styles.featureIncluded : styles.featureExcluded
              ]}>
                {isSubscriber ? '✓' : '✗'}
              </Text>
            </View>
            
            <View style={styles.featureRow}>
              <Text style={styles.featureLabel}>Advanced scheduling</Text>
              <Text style={[
                styles.featureValue,
                isSubscriber ? styles.featureIncluded : styles.featureExcluded
              ]}>
                {isSubscriber ? '✓' : '✗'}
              </Text>
            </View>
            
            <View style={styles.featureRow}>
              <Text style={styles.featureLabel}>Priority support</Text>
              <Text style={[
                styles.featureValue,
                isSubscriber ? styles.featureIncluded : styles.featureExcluded
              ]}>
                {isSubscriber ? '✓' : '✗'}
              </Text>
            </View>
          </View>
        </Card>
      </View>

      <SubscriptionManagementModal
        visible={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  planCard: {
    marginTop: 20,
    marginBottom: 16,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  planInfo: {
    flex: 1,
  },
  planTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 8,
  },
  planDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  planPricing: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  planPeriod: {
    fontSize: 14,
    color: '#6B7280',
  },
  subscriptionDetails: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
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
  upgradePrompt: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  upgradeText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  upgradeButton: {
    paddingHorizontal: 32,
  },
  paymentMethodsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardDetails: {
    flex: 1,
  },
  cardBrand: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  cardExpiry: {
    fontSize: 14,
    color: '#6B7280',
  },
  defaultBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  defaultText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  editPaymentButton: {
    padding: 8,
  },
  addPaymentButton: {
    marginTop: 12,
  },
  actionsCard: {
    marginBottom: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  historyCard: {
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  historyInfo: {
    flex: 1,
  },
  historyDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  historyActions: {
    alignItems: 'flex-end',
  },
  historyPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  historyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  historyButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  viewAllButton: {
    marginTop: 12,
  },
  featuresCard: {
    marginBottom: 16,
  },
  featuresTable: {
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  featureLabel: {
    fontSize: 16,
    color: '#374151',
  },
  featureValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  featureIncluded: {
    color: '#059669',
  },
  featureExcluded: {
    color: '#DC2626',
  },
});