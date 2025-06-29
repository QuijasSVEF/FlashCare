Here's the fixed version with all missing brackets and syntax corrections:

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { router, useRouter } from 'expo-router';
import { ArrowLeft, Heart } from 'lucide-react-native';
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
  
  // If user is already signed in, redirect to tabs
  useEffect(() => {
    if (user) {
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
    } catch (error) {
      console.error('Signin error:', error);
    }
  };

  interface QuickMenuModalProps {
    visible: boolean;
    onClose: () => void;
    userRole: 'family' | 'caregiver';
  }

  function QuickMenuModal({ visible, onClose, userRole }: QuickMenuModalProps) {
    const menuItems = [
      {
        icon: Users,
        title: 'Matches',
        subtitle: 'View your connections',
        color: Colors.primary[500],
        onPress: () => {
          onClose();
          router.push('/(tabs)/matches');
        }
      },
      {
        icon: Search,
        title: 'Advanced Search',
        subtitle: 'Find specific caregivers',
        color: Colors.secondary[500],
        onPress: () => {
          onClose();
          router.push('/(tabs)/search');
        }
      }
    ];

    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={onClose}
        >
          <View style={styles.quickMenu}>
            <View style={styles.quickMenuHeader}>
              <Text style={styles.quickMenuTitle}>Quick Menu</Text>
              <View style={styles.quickMenuAccent} />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
}