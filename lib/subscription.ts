import Purchases, { PurchasesOffering, CustomerInfo } from 'react-native-purchases';
import { Platform } from 'react-native';

interface SubscriptionStatus {
  isSubscriber: boolean;
  offering?: PurchasesOffering;
}

export const subscriptionService = {
  async initialize(): Promise<void> {
    try {
      if (Platform.OS === 'ios') {
        await Purchases.configure({
          apiKey: process.env.EXPO_PUBLIC_REVENUECAT_APPLE_KEY!,
        });
      } else if (Platform.OS === 'android') {
        await Purchases.configure({
          apiKey: process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY!,
        });
      }
    } catch (error) {
      console.error('Error configuring RevenueCat:', error);
    }
  },

  async checkSubscription(): Promise<SubscriptionStatus> {
    try {
      const customerInfo: CustomerInfo = await Purchases.getCustomerInfo();
      const isSubscriber = customerInfo.entitlements.active['flashcare_plus'] !== undefined;
      
      return {
        isSubscriber,
      };
    } catch (error) {
      console.error('Error checking subscription:', error);
      return { isSubscriber: false };
    }
  },

  async getOfferings(): Promise<PurchasesOffering | null> {
    try {
      const offerings = await Purchases.getOfferings();
      return offerings.current;
    } catch (error) {
      console.error('Error getting offerings:', error);
      return null;
    }
  },

  async purchaseSubscription(): Promise<boolean> {
    try {
      const offerings = await Purchases.getOfferings();
      const currentOffering = offerings.current;
      
      if (!currentOffering) {
        throw new Error('No offerings available');
      }

      // Get the monthly package (adjust based on your offering setup)
      const monthlyPackage = currentOffering.monthly;
      
      if (!monthlyPackage) {
        throw new Error('Monthly package not available');
      }

      const { customerInfo } = await Purchases.purchasePackage(monthlyPackage);
      
      // Check if the purchase was successful
      const isSubscriber = customerInfo.entitlements.active['flashcare_plus'] !== undefined;
      
      return isSubscriber;
    } catch (error) {
      console.error('Error purchasing subscription:', error);
      return false;
    }
  },

  async restorePurchases(): Promise<boolean> {
    try {
      const customerInfo = await Purchases.restorePurchases();
      const isSubscriber = customerInfo.entitlements.active['flashcare_plus'] !== undefined;
      
      return isSubscriber;
    } catch (error) {
      console.error('Error restoring purchases:', error);
      return false;
    }
  },

  async setUserID(userID: string): Promise<void> {
    try {
      await Purchases.logIn(userID);
    } catch (error) {
      console.error('Error setting user ID:', error);
    }
  },

  async logOut(): Promise<void> {
    try {
      await Purchases.logOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
};