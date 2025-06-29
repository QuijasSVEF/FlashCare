import { Platform } from 'react-native';

interface SubscriptionStatus {
  isSubscriber: boolean;
}

export const subscriptionService = {
  async initialize(): Promise<void> {
    try {
      console.log('Demo: Initializing subscription service');
      // No-op for demo
    } catch (error) {
      console.error('Error configuring subscription service:', error);
    }
  },

  async checkSubscription(): Promise<SubscriptionStatus> {
    try {
      // Demo implementation - everyone is a subscriber
      return {
        isSubscriber: true,
      };
    } catch (error) {
      console.error('Error checking subscription:', error);
      return { isSubscriber: true };
    }
  },

  async getOfferings(): Promise<any | null> {
    try {
      // Demo implementation
      return {
        monthly: {
          identifier: 'monthly',
          title: 'Monthly Subscription',
          description: 'FlashCare Plus Monthly',
          price: 9.99,
          priceString: '$9.99',
        }
      };
    } catch (error) {
      console.error('Error getting offerings:', error);
      return null;
    }
  },

  async purchaseSubscription(): Promise<boolean> {
    try {
      // Demo implementation - always succeeds
      return true;
    } catch (error) {
      console.error('Error purchasing subscription:', error);
      return false;
    }
  },

  async restorePurchases(): Promise<boolean> {
    try {
      // Demo implementation - always succeeds
      return true;
    } catch (error) {
      console.error('Error restoring purchases:', error);
      return false;
    }
  },

  async setUserID(userID: string): Promise<void> {
    try {
      // Demo implementation
      console.log('Demo: Setting user ID for subscription service', userID);
    } catch (error) {
      console.error('Error setting user ID:', error);
    }
  },

  async logOut(): Promise<void> {
    try {
      // Demo implementation
      console.log('Demo: Logging out of subscription service');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
};