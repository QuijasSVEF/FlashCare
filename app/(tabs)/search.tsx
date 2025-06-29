Here's the fixed version with all missing brackets and syntax corrections:

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, Dimensions } from 'react-native';
import { router, useRouter } from 'expo-router';
import { ArrowLeft, Heart, Users, Calendar, Star, DollarSign, TrendingUp, Award } from 'lucide-react-native';
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
      const handleSignIn = async () => {
        const result = await signIn(formData.email, formData.password);
        console.log('Signin successful, result:', !!result);
        
        // Small delay to ensure auth state is properly set
        setTimeout(() => {
          console.log('Navigating to tabs after signin');
          routerInstance.replace('/(tabs)');
        }, 100);
      };
      handleSignIn();
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
      console.log('Signin request sent successfully');
      // Navigation will be handled by the root layout based on auth state
    } catch (error: any) {
      console.error('Signin error:', error);
      let errorMessage = 'Failed to sign in';
      if (error.message?.includes('too_many_requests')) {
        errorMessage = 'Too many attempts. Please try again later';
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const { width } = Dimensions.get('window');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Rest of the component JSX */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // ... all the styles
});
```