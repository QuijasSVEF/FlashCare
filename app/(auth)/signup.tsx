import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { router, useRouter } from 'expo-router';
import { ArrowLeft, Heart } from 'lucide-react-native';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button'; 
import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../constants/Colors';

export default function SignUpScreen() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'family' as 'family' | 'caregiver',
  });
  const [loading, setLoading] = useState(false); 
  const [errors, setErrors] = useState<Record<string, string>>({});

  const routerInstance = useRouter();
  const { signUp, user } = useAuth();
  
  // If user is already signed in, redirect to tabs
  useEffect(() => {
    const handleUserRedirect = async () => {
      if (user) {
        console.log('User already signed in, redirecting to tabs');
        
        // Small delay to ensure auth state is properly set
        setTimeout(() => {
          console.log('Navigating to tabs after signup');
          routerInstance.replace('/(tabs)');
        }, 100);
      }
    };
    
    handleUserRedirect();
  }, [user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    
    try {
      console.log('Attempting signup with:', formData.email);
      const result = await signUp(formData.email, formData.password, {
        name: formData.name,
        role: formData.role,
      });
      console.log('Signup request sent successfully');
      // Navigation will be handled by the root layout based on auth state
    } catch (error: any) {
      console.error('Signup error:', error);
      let errorMessage = 'Failed to create account';
      
      if (error.message?.includes('User already registered')) {
        errorMessage = 'An account with this email already exists. Please sign in instead.';
      } else if (error.message?.includes('Password should be at least 6 characters')) {
        errorMessage = 'Password must be at least 6 characters long.';
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Sign Up Error', errorMessage);
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
          <Heart size={24} color={Colors.primary[500]} />
          <Text style={styles.logo}>FlashCare</Text>
          <Image
            source={{ uri: 'https://raw.githubusercontent.com/kickiniteasy/bolt-hackathon-badge/main/src/public/bolt-badge/white_circle_360x360/white_circle_360x360.png' }}
            style={styles.boltBadge}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>Join FlashCare today</Text>

        <Input
          label="Full Name"
          value={formData.name}
          onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          placeholder="Enter your full name"
          autoComplete="name"
          error={errors.name}
        />

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
          autoComplete="new-password"
          error={errors.password}
        />

        <Input
          label="Confirm Password"
          value={formData.confirmPassword}
          onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
          placeholder="Confirm your password"
          secureTextEntry
          autoComplete="new-password"
          error={errors.confirmPassword}
        />

        <View style={styles.roleSection}>
          <Text style={styles.roleLabel}>I am a:</Text>
          <View style={styles.roleButtons}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                formData.role === 'family' && styles.roleButtonActive
              ]}
              onPress={() => setFormData(prev => ({ ...prev, role: 'family' }))}
            >
              <Text style={[
                styles.roleButtonText,
                formData.role === 'family' && styles.roleButtonTextActive
              ]}>
                Family
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.roleButton,
                formData.role === 'caregiver' && styles.roleButtonActive
              ]}
              onPress={() => setFormData(prev => ({ ...prev, role: 'caregiver' }))}
            >
              <Text style={[
                styles.roleButtonText,
                formData.role === 'caregiver' && styles.roleButtonTextActive
              ]}>
                Caregiver
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Button
          title={loading ? "Creating account..." : "Sign Up"}
          onPress={handleSignUp}
          disabled={loading}
          size="large"
          variant={loading ? "disabled" : "primary"}
          style={styles.signUpButton}
        />

        <TouchableOpacity onPress={() => router.push('/(auth)/signin')}>
          <Text style={styles.signInText}>
            Already have an account? <Text style={styles.signInLink}>Sign in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
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
    position: 'relative',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary[500],
    marginLeft: 8,
  },
  boltBadge: {
    position: 'absolute',
    right: -60,
    width: 30,
    height: 30,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
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
    marginBottom: 32,
  },
  roleSection: {
    marginBottom: 24,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  roleButtonActive: {
    borderColor: Colors.primary[500],
    backgroundColor: Colors.primary[50],
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  roleButtonTextActive: {
    color: Colors.primary[500],
  },
  signUpButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  signInText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  signInLink: {
    color: Colors.primary[500],
    fontWeight: '600',
  },
});