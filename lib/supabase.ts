import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { router, useRouter } from 'expo-router';
import { ArrowLeft, Heart, Image as ImageIcon } from 'lucide-react-native';
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

  const routerInstance = useRouter();
  const { signIn, user } = useAuth();
  
  // Check if user is already signed in
  useEffect(() => {
      const result = await signIn(formData.email, formData.password);
      console.log('Signin successful, result:', !!result);
      
      // Small delay to ensure auth state is properly set
      setTimeout(() => {
        console.log('Navigating to tabs after signin');
        routerInstance.replace('/(tabs)');
      }, 100);
    }
  }, [user]);

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
      console.log('Attempting signin with:', formData.email);
      const result = await signIn(formData.email, formData.password);
      console.log('Signin successful, result:', !!result);
      
      // Small delay to ensure auth state is properly set
      setTimeout(() => {
        console.log('Navigating to tabs after signin');
        routerInstance.replace('/(tabs)');
      }, 100);
    } catch (error: any) {
      console.error('Signin error:', error);
      let errorMessage = 'Failed to sign in';
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
  signInButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  signUpText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  signUpLink: {
    color: Colors.primary[500],
    fontWeight: '600',
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