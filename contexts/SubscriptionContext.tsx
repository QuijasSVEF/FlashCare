import React, { createContext, useContext, useState } from 'react';

interface SubscriptionContextType {
  isSubscriber: boolean;
  loading: boolean;
  purchaseSubscription: () => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  initializeRevenueCat: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [isSubscriber, setIsSubscriber] = useState(true); // Demo: everyone is a subscriber for full functionality
  const [loading, setLoading] = useState(false);

  const initializeRevenueCat = async () => {
    // Demo implementation
    console.log('RevenueCat initialized (demo)');
  };

  const purchaseSubscription = async () => {
    setIsSubscriber(true);
    return true;
  };

  const restorePurchases = async () => {
    setIsSubscriber(true);
    return true;
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