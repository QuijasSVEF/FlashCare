import { useState, useEffect, useRef } from 'react';
import { databaseService } from '../lib/database';
import { Database } from '../lib/supabase';

type Message = Database['public']['Tables']['messages']['Row'];

export function useRealTimeMessages(matchId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    if (matchId) {
      loadMessages();
      subscribeToMessages();
      
      return () => {
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
        }
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

  const subscribeToMessages = () => {
    subscriptionRef.current = databaseService.subscribeToMessages(
      matchId,
      (newMessage) => {
        setMessages(prev => {
          // Avoid duplicates
          const exists = prev.some(msg => msg.id === newMessage.id);
          if (exists) return prev;
          return [...prev, newMessage];
        });
      }
    );
  };

  const sendMessage = async (body: string, senderId: string) => {
    try {
      const messageData = {
        match_id: matchId,
        sender_id: senderId,
        body,
      };

      // Optimistically add message
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        match_id: matchId,
        sender_id: senderId,
        body,
        sent_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, tempMessage]);

      // Send to server
      const newMessage = await databaseService.sendMessage(messageData);
      
      // Replace temp message with real one
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessage.id ? newMessage : msg
        )
      );
    } catch (err) {
      // Remove temp message on error
      setMessages(prev => 
        prev.filter(msg => !msg.id.startsWith('temp-'))
      );
      setError(err instanceof Error ? err.message : 'Failed to send message');
      throw err;
    }
  };

  const simulateTyping = (duration = 2000) => {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), duration);
  };

  return {
    messages,
    loading,
    error,
    isTyping,
    sendMessage,
    simulateTyping,
    refetch: loadMessages,
  };
}