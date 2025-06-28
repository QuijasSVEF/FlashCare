import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { Shield, Users } from 'lucide-react-native';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export default function WelcomeScreen() {
  const { loading } = useAuth();

  // Show loading state if auth is still initializing
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Initializing FlashCare...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo (2).png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Supporting families and caregivers</Text>
        <Text style={styles.subtitle}>
          Purposeful bonds, trusted care
        </Text>

        <Image
          source={{ uri: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=800' }}
          style={styles.heroImage}
        />

        <View style={styles.features}>
          <View style={styles.feature}>
            <Shield size={24} color="#059669" />
            <Text style={styles.featureText}>Verified caregivers</Text>
          </View>
          <View style={styles.feature}>
            <Users size={24} color="#059669" />
            <Text style={styles.featureText}>Trusted community</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Link href="/(auth)/signup" asChild>
          <Button title="Get Started" size="large" style={styles.primaryButton} />
        </Link>
        
        <Link href="/(auth)/signin" asChild>
          <Button title="Sign In" variant="outline" size="large" />
        </Link>

        <Text style={styles.terms}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoImage: {
    width: 300,
    height: 120,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 32,
  },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 32,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  feature: {
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
  },
  actions: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  primaryButton: {
    marginBottom: 16,
  },
  terms: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 16,
  },
  loadingContainer: {
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