import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';

export default function Index() {
  const { user, loading } = useAuth();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    // Mark initial load as complete after a short delay to ensure auth state is settled
    const timer = setTimeout(() => {
      setInitialLoadComplete(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading screen while auth is initializing
  if (loading || !initialLoadComplete) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading FlashCare...</Text>
      </View>
    );
  }

  // If user exists and initial load is complete, go to main app
  if (user) {
    console.log('Redirecting to tabs with user:', user.id);
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
});