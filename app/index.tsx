import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';

export default function Index() {
  const { user, loading } = useAuth();
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    // Add a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setTimeoutReached(true);
    }, 3000); // 3 second timeout (reduced from 5)

    // Mark initial load as complete after a short delay
    const initialTimeout = setTimeout(() => {
      setInitialLoad(false);
    }, 1000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(initialTimeout);
    };
  }, []);

  // If timeout is reached and still loading, or if we're past initial load and no user
  if ((timeoutReached && loading) || (!initialLoad && !loading && !user)) {
    return <Redirect href="/(auth)/welcome" />;
  }

  // If still loading and timeout not reached, show loading
  if ((loading && !timeoutReached) || initialLoad) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading FlashCare...</Text>
      </View>
    );
  }

  // If user exists, go to main app
  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  // Otherwise, go to welcome screen
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