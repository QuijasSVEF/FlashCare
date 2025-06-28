import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Heart, Mail, Lock } from 'lucide-react-native';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../constants/Colors';

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
    setErrors({});
    
    try {
      console.log('SignIn: Attempting signin with:', formData.email);
      const result = await signIn(formData.email, formData.password);

      if (result) {
        console.log('SignIn: Signin successful, navigating to tabs');
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      console.error('SignIn error:', error.message || 'Unknown error');
      let errorMessage = 'Failed to sign in';
      
      if (error.message?.includes('Invalid login credentials') || 
          error.message?.includes('invalid_credentials') ||
          error.message?.includes('Invalid email or password')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and click the confirmation link before signing in.';
      } else if (error.message?.includes('too_many_requests')) {
        errorMessage = 'Too many sign-in attempts. Please wait a moment and try again.';
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
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
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <ArrowLeft size={24} color={Colors.text.primary} />
      </TouchableOpacity>
      
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/logo (2).png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Image
          source={{ uri: 'https://raw.githubusercontent.com/kickiniteasy/bolt-hackathon-badge/refs/heads/main/src/public/bolt-badge/white_circle_360x360/white_circle_360x360.png' }}
          style={styles.boltBadge}
          resizeMode="contain"
        />
      </View>

      <View style={styles.formContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputIconContainer}>
            <Mail size={20} color={Colors.text.secondary} />
          </View>
          <Input
            value={formData.email}
            onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputIconContainer}>
            <Lock size={20} color={Colors.text.secondary} />
          </View>
          <Input
            value={formData.password}
            onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
            placeholder="Enter your password"
            secureTextEntry
            error={errors.password}
            style={styles.input}
          />
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        <Button
          title={loading ? "Signing in..." : "Sign In"}
          onPress={handleSignIn}
          disabled={loading}
          size="large"
          style={[styles.signInButton, { backgroundColor: Colors.primary[500] }]}
        />

        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
          <Text style={styles.signUpText}>
            Don't have an account? <Text style={[styles.signUpLink, { color: Colors.primary[500] }]}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 40,
  },
  logoImage: {
    width: 200,
    height: 80,
  },
  boltBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    width: 40,
    height: 40,
  },
  formContainer: {
    width: '100%',
  },
  titleContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  inputIconContainer: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  input: {
    paddingLeft: 48,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  signInButton: {
    marginBottom: 24,
  },
  signUpText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  signUpLink: {
    fontWeight: '600',
  },
});