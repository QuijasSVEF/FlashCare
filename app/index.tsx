import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';

export default function Index() {
  const { user, loading } = useAuth();
  const [timeoutReached, setTimeoutReached] = useState(false);
  
  console.log('🏠 Index: Current state:', { 
    hasUser: !!user, 
    userId: user?.id,
    loading, 
    timeoutReached 
  });

  useEffect(() => {
    console.log('🏠 Index: Setting up timeouts');
    const timeout = setTimeout(() => {
      console.log('🏠 Index: Timeout reached');
      setTimeoutReached(true);
    }, 5000); // 5 second timeout

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  // If timeout is reached and still loading, redirect to welcome
  if (timeoutReached && loading) {
    console.log('🏠 Index: Timeout reached while loading, redirecting to welcome');
    return <Redirect href="/(auth)/welcome" />;
  }

  // If still loading and timeout not reached, show loading screen
  if (loading && !timeoutReached) {
    console.log('🏠 Index: Still loading, showing loading screen');
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading FlashCare...</Text>
      </View>
    );
  }

  // If user exists, go to main app
  if (user) {
    console.log('🏠 Index: User found, redirecting to tabs');
    return <Redirect href="/(tabs)" />;
  }

  // Otherwise, go to welcome screen
  console.log('🏠 Index: No user, redirecting to welcome');
  return <Redirect href="/(auth)/welcome" />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});