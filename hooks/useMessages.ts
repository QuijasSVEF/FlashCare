import { useState, useEffect } from 'react';
import { databaseService } from '../lib/database';
import { Database } from '../lib/supabase';

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