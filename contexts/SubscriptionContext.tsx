import React, { createContext, useContext, useState, useEffect } from 'react';
import { subscriptionService } from '../lib/subscription';

interface SubscriptionContextType {
  isSubscriber: boolean;
  loading: boolean;
  purchaseSubscription: () => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [isSubscriber, setIsSubscriber] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      const status = await subscriptionService.checkSubscription();
      setIsSubscriber(status.isSubscriber);
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const purchaseSubscription = async () => {
    try {
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