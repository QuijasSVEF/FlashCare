import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { subscriptionService } from '../lib/subscription';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
  isSubscriber: boolean;
  loading: boolean;
  purchaseSubscription: () => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  initializeRevenueCat: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [isSubscriber, setIsSubscriber] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    initializeAndCheck();
  }, []);

  useEffect(() => {
    if (user?.id && Platform.OS !== 'web') {
      subscriptionService.setUserID(user.id);
    }
  }, [user?.id]);

  const initializeAndCheck = async () => {
    if (Platform.OS !== 'web') {
      await initializeRevenueCat();
    }
    await checkSubscription();
  };

  const initializeRevenueCat = async () => {
    try {
      await subscriptionService.initialize();
    } catch (error) {
      console.error('Error initializing RevenueCat:', error);
    }
  };
  const checkSubscription = async () => {
    try {
      if (Platform.OS === 'web') {
        // For web, use mock data or alternative subscription check
        setIsSubscriber(false);
      } else {
        const status = await subscriptionService.checkSubscription();
        setIsSubscriber(status.isSubscriber);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const purchaseSubscription = async () => {
    try {
      if (Platform.OS === 'web') {
        console.log('Purchases not available on web');
        return false;
      }
      const success = await subscriptionService.purchaseSubscription();
      if (success) {
        setIsSubscriber(true);
      }
      return success;
    } catch (error) {
      console.error('Error purchasing subscription:', error);
      return false;
    }
  };

  const restorePurchases = async () => {
    try {
      if (Platform.OS === 'web') {
        console.log('Restore purchases not available on web');
        return false;
      }
      const success = await subscriptionService.restorePurchases();
      if (success) {
        await checkSubscription();
      }
      return success;
    } catch (error) {
      console.error('Error restoring purchases:', error);
      return false;
    }
  };

  return (
    <SubscriptionContext.Provider value={{
      isSubscriber,
      loading,
      purchaseSubscription,
      restorePurchases,
      initializeRevenueCat,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}