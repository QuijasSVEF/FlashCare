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
      
import { useState, useEffect } from 'react';
import { databaseService } from '../lib/database';
import { Database } from '../types/database';

type Message = Database['public']['Tables']['messages']['Row'];

export function useMessages(matchId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (matchId) {
      loadMessages();
      
      // Subscribe to new messages
      const subscription = databaseService.subscribeToMessages(
        matchId,
        (newMessage) => {
          setMessages(prev => [...prev, newMessage]);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [matchId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const matchMessages = await databaseService.getMatchMessages(matchId);
      setMessages(matchMessages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (body: string, senderId: string) => {
    try {
      const messageData = {
        match_id: matchId,
        sender_id: senderId,
        body,
      };

      const newMessage = await databaseService.sendMessage(messageData);
      // Optimistically add the message to the list
      setMessages(prev => [...prev, newMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      throw err;
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    refetch: loadMessages,
  };
}