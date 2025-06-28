import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { View, StyleSheet, ActivityIndicator, Text, Platform } from 'react-native';

export default function Index() {
  const { user, loading } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Index: Auth state changed - loading:', loading, 'user:', user?.id);

    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading) {
        console.log('Auth loading timeout reached, forcing navigation decision');
        setShouldRedirect(true);
      }
    }, 5000); // 5 second timeout

    // When loading completes, allow redirect
    if (!loading) {
      console.log('Auth loading complete, preparing for redirect');
      setShouldRedirect(true);
    }

    return () => clearTimeout(timeout);
  }, [loading, user]);

  // Force a redirect after a delay on web platform
  useEffect(() => {
    if (Platform.OS === 'web') {
      const forceRedirectTimer = setTimeout(() => {
        if (!user) {
          console.log('Forcing redirect to welcome after timeout');
          window.location.href = '/(auth)/welcome';
        } else {
          console.log('Forcing redirect to tabs after timeout');
          window.location.href = '/(tabs)';
        }
      }, 8000); // 8 seconds
      
      return () => clearTimeout(forceRedirectTimer);
    }
  }, []);

  // Show loading screen while auth is initializing
  if (!shouldRedirect || loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading FlashCare...</Text>
        {shouldRedirect && (
          <Text style={styles.timeoutText}>
            Taking longer than expected...
          </Text>
        )}
      </View>
    );
  }

  // If there's an auth error, show welcome screen
  if (authError) {
    console.log('Auth error, redirecting to welcome');
    return <Redirect href="/(auth)/welcome" />;
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
  errorText: {
    marginTop: 16,
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
  }
});