import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '../contexts/AuthContext';
import { SubscriptionProvider } from '../contexts/SubscriptionContext';
import { NotificationProvider } from '../contexts/NotificationContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <SubscriptionProvider>
        <NotificationProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </NotificationProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}