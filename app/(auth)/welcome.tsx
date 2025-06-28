import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';
import { Heart, Shield, Users } from 'lucide-react-native';
import { Button } from '../../components/ui/Button';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Heart size={48} color="#2563EB" />
          <Text style={styles.logo}>FlashCare</Text>
        </View>

        <Text style={styles.title}>Caring connections for your family</Text>
        <Text style={styles.subtitle}>
          Find trusted caregivers for seniors and family members with disabilities
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563EB',
    marginLeft: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
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
});