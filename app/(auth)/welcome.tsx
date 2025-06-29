import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { router, useRouter } from 'expo-router';
import { ArrowLeft, Heart, Image as ImageIcon } from 'lucide-react-native';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button'; 
import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../constants/Colors';
export default function WelcomeScreen() {
  const { loading } = useAuth();
  const router = useRouter();

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
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Welcome back!</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        <Input
          label="Email"
          value={formData.email}
          onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          error={errors.email}
        />

        <Input
          label="Password"
          value={formData.password}
          onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
          placeholder="Enter your password"
          secureTextEntry
          autoComplete="password"
          error={errors.password} 
        /> 
        
        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>Demo Accounts</Text>
          <View style={styles.demoButtons}>
            <Button
              title="Family 1"
              onPress={() => {
                setFormData({
                  email: 'family1@example.com',
                  password: 'password'
                });
              }}
              variant="outline"
              size="small"
              style={styles.demoButton}
            />
            <Button
              title="Family 2"
              onPress={() => {
                setFormData({
                  email: 'family2@example.com',
                  password: 'password'
                });
              }}
              variant="outline"
              size="small"
              style={styles.demoButton}
            />
          </View>
          <View style={styles.demoButtons}>
            <Button
              title="Caregiver 1"
              onPress={() => {
                setFormData({
                  email: 'caregiver1@example.com',
                  password: 'password'
                });
              }}
              variant="outline"
              size="small"
              style={styles.demoButton}
            />

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
  demoSection: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  demoButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  demoButton: {
    minWidth: 100,
  },
});