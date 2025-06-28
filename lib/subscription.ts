interface SubscriptionStatus {
  isSubscriber: boolean;
  offering?: any;
}

// Mock subscription service - replace with actual RevenueCat implementation
export const subscriptionService = {
  async checkSubscription(): Promise<SubscriptionStatus> {
    // Mock implementation - in real app, this would check RevenueCat
    return {
      isSubscriber: false, // For demo purposes, always false to show paywall
    };
  },

  async purchaseSubscription(): Promise<boolean> {
    // Mock implementation - in real app, this would trigger RevenueCat purchase
    console.log('Purchase subscription triggered');
    return true;
  },

  async restorePurchases(): Promise<boolean> {
    // Mock implementation
    console.log('Restore purchases triggered');
    return true;
  }
};