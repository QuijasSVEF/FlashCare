import { useEffect, useState, useRef } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { View, StyleSheet, ActivityIndicator, Text, Platform } from 'react-native';

export default function Index() {
  const { user, loading } = useAuth();
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [forceRedirect, setForceRedirect] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isMountedRef.current) {
        setTimeoutReached(true);
      }
    }, 5000); // 5 second timeout (reduced from 10)

    return () => clearTimeout(timeout);
  }, []);

  // Force redirect after a longer timeout
  useEffect(() => {
    const forceTimeout = setTimeout(() => {
      if (isMountedRef.current) {
        setForceRedirect(true);
      }
    }, 8000); // 8 second force timeout

    return () => clearTimeout(forceTimeout);
  }, []);

  // Show loading screen while checking auth state
  if (loading && !timeoutReached && !forceRedirect) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading FlashCare...</Text>
      </View>
    );
  }

  // If timeout reached and still loading, redirect to welcome
  if ((timeoutReached && loading) || forceRedirect) {
    return <Redirect href="/(auth)/welcome" />;
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