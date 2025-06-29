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
      const result = await signIn(formData.email, formData.password);
      console.log('Signin successful, result:', !!result);
      
  }
  )
}
import { useState, useEffect } from 'react';
import { databaseService } from '../lib/database';
import { useAuth } from '../contexts/AuthContext';

export function useSchedules() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadSchedules();
    }
  }, [user?.id]);

  const loadSchedules = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const userSchedules = await databaseService.getUserSchedules(user.id);
      setSchedules(userSchedules);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  return {
    schedules,
    loading,
    error,
    refetch: loadSchedules,
  };
}