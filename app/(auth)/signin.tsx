import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Heart } from 'lucide-react-native';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../lib/auth';

export default function SignInScreen() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signIn } = useAuth();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({}); // Clear any previous errors
    
    try {
      await signIn(formData.email, formData.password);
      
      // Wait a moment for auth state to update
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 500);
      
    } catch (error: any) {
      console.error('Sign in error:', error);
      let errorMessage = 'Failed to sign in';
      
      // Handle different types of auth errors
      if (error.message?.includes('Invalid login credentials') || 
          error.message?.includes('invalid_credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and click the confirmation link before signing in.';
      } else if (error.message?.includes('too_many_requests')) {
        errorMessage = 'Too many sign-in attempts. Please wait a moment and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Sign In Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Heart size={24} color="#2563EB" />
          <Text style={styles.logo}>FlashCare</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        <Input
          label="Email"
          value={formData.email}
          onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />

        <Input
          label="Password"
          value={formData.password}
          onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
          placeholder="Enter your password"
          secureTextEntry
          error={errors.password}
        />

        <Button
          title={loading ? "Signing in..." : "Sign In"}
          onPress={handleSignIn}
          disabled={loading}
          size="large"
          style={styles.signInButton}
        />

        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
          <Text style={styles.signUpText}>
            Don't have an account? <Text style={styles.signUpLink}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563EB',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
  },
  signInButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  signUpText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  signUpLink: {
    color: '#2563EB',
    fontWeight: '600',
  },
});