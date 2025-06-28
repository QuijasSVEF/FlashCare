import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { Shield, Users } from 'lucide-react-native';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../constants/Colors';

export default function WelcomeScreen() {
  const { loading } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo (2).png')}
            style={styles.logoImage}
            resizeMode="cover"
          />
          <Image
            source={{ uri: 'https://raw.githubusercontent.com/kickiniteasy/bolt-hackathon-badge/main/src/public/bolt-badge/white_circle_360x360/white_circle_360x360.png' }}
            style={styles.boltBadge}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Supporting families and caregivers</Text>
        <Text style={styles.subtitle}>
          Purposeful bonds, trusted care
        </Text>

        <Image
          source={{ uri: 'https://images.pexels.com/photos/7551667/pexels-photo-7551667.jpeg?auto=compress&cs=tinysrgb&w=800' }}
          style={styles.heroImage}
        />

        <View style={styles.features}>
          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Shield size={24} color={Colors.primary[500]} />
            </View>
            <Text style={styles.featureText}>Verified caregivers</Text>
          </View>
          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Users size={24} color={Colors.primary[500]} />
            </View>
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
    backgroundColor: Colors.surface,
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
    position: 'relative',
  },
  logoImage: {
    width: 300,
    height: 120,
  },
  boltBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 32,
  },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 20,
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
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: Colors.text.primary,
    textAlign: 'center',
    fontWeight: '500',
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
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 16,
  },
});