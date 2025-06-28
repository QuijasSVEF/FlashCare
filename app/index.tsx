import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';

export default function Index() {
  const { user, loading } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.log('Loading timeout reached, forcing redirect decision');
      setTimeoutReached(true);
      setShouldRedirect(true);
    }, 3000); // 3 second timeout

    // Only allow redirect after loading is complete or timeout
    if (!loading || timeoutReached) {
      // Add a small delay to ensure state is fully settled
      const timer = setTimeout(() => {
        setShouldRedirect(true);
      }, 100);

      return () => {
        clearTimeout(timer);
        clearTimeout(timeout);
      };
    }

    return () => clearTimeout(timeout);
  }, [loading, timeoutReached]);

  // Show loading screen while auth is initializing or before redirect
  if ((loading && !timeoutReached) || !shouldRedirect) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading FlashCare...</Text>
        {timeoutReached && (
          <Text style={styles.timeoutText}>Taking longer than expected...</Text>
        )}
      </View>
    );
  }

  // If user exists, go to main app
  if (user) {
    console.log('Redirecting to tabs with user:', user.id, user.role);
    return <Redirect href="/(tabs)" />;
  }

  // Otherwise, go to welcome screen
  console.log('Redirecting to welcome - no user');
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
  timeoutText: {
    marginTop: 8,
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});