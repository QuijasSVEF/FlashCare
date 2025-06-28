import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Heart, User, Users } from 'lucide-react-native';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export default function SignUpScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '' as 'family' | 'caregiver' | '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signUp } = useAuth();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.role) newErrors.role = 'Please select your role';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    
    try {
      console.log('Attempting signup with:', formData.email, formData.role);
      await signUp(formData.email, formData.password, {
        name: formData.name,
        role: formData.role as 'family' | 'caregiver',
      });
      
      // Success - go to profile setup
      console.log('Signup successful, navigating to profile setup');
      router.replace('/(auth)/profile-setup');
    } catch (error: any) {
      console.error('Signup error:', error);
      let errorMessage = 'Failed to create account';
      
      if (error.message?.includes('User already registered') || 
          error.message?.includes('user_already_exists') ||
          error.code === 'user_already_exists') {
        Alert.alert(
          'Account Already Exists',
          'An account with this email already exists. Would you like to sign in instead or try a different email?',
          [
            {
              text: 'Try Different Email',
              onPress: () => {
                setFormData(prev => ({ ...prev, email: '' }));
                setErrors(prev => ({ ...prev, email: '' }));
              }
            },
            {
              text: 'Sign In',
              onPress: () => router.push('/(auth)/signin'),
              style: 'default'
            }
          ]
        );
        return;
      } else if (error.message?.includes('Email not confirmed')) {
        Alert.alert(
          'Check Your Email',
          'Please check your email and click the confirmation link to complete your registration.',
          [{ text: 'OK' }]
        );
        return;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Sign Up Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Heart size={24} color="#2563EB" />
          <Text style={styles.logo}>FlashCare</Text>
          <Image
            source={{ uri: 'https://raw.githubusercontent.com/kickiniteasy/bolt-hackathon-badge/refs/heads/main/src/public/bolt-badge/white_circle_360x360/white_circle_360x360.png' }}
            style={styles.boltBadge}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>Join the FlashCare community</Text>

        <Input
          label="Full Name"
          value={formData.name}
          onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          placeholder="Enter your full name"
          error={errors.name}
        />

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
          placeholder="Create a password"
          secureTextEntry
          error={errors.password}
        />

        <Text style={styles.roleLabel}>I am a:</Text>
        <View style={styles.roleOptions}>
          <TouchableOpacity
            style={[
              styles.roleOption,
              formData.role === 'family' && styles.roleOptionSelected,
            ]}
            onPress={() => setFormData(prev => ({ ...prev, role: 'family' }))}
          >
            <Users size={24} color={formData.role === 'family' ? '#2563EB' : '#6B7280'} />
            <Text style={[
              styles.roleText,
              formData.role === 'family' && styles.roleTextSelected,
            ]}>
              Family Member
            </Text>
            <Text style={styles.roleDescription}>Looking for care</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleOption,
              formData.role === 'caregiver' && styles.roleOptionSelected,
            ]}
            onPress={() => setFormData(prev => ({ ...prev, role: 'caregiver' }))}
          >
            <User size={24} color={formData.role === 'caregiver' ? '#2563EB' : '#6B7280'} />
            <Text style={[
              styles.roleText,
              formData.role === 'caregiver' && styles.roleTextSelected,
            ]}>
              Caregiver
            </Text>
            <Text style={styles.roleDescription}>Providing care</Text>
          </TouchableOpacity>
        </View>
        {errors.role && <Text style={styles.error}>{errors.role}</Text>}

        <Button
          title={loading ? "Creating account..." : "Create Account"}
          onPress={handleSignUp}
          disabled={loading}
          size="large"
          style={styles.createButton}
        />

        <TouchableOpacity onPress={() => router.push('/(auth)/signin')}>
          <Text style={styles.signInText}>
            Already have an account? <Text style={styles.signInLink}>Sign in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    position: 'relative',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563EB',
    marginLeft: 8,
  },
  boltBadge: {
    position: 'absolute',
    right: -60,
    width: 30,
    height: 30,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
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
  roleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  roleOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  roleOption: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  roleOptionSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EEF2FF',
  },
  roleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  roleTextSelected: {
    color: '#2563EB',
  },
  roleDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
  error: {
    color: '#DC2626',
    fontSize: 14,
    marginBottom: 16,
  },
  createButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  signInText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  signInLink: {
    color: '#2563EB',
    fontWeight: '600',
  },
});