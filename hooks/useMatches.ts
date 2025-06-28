import { useState, useEffect } from 'react';
import { databaseService } from '../lib/database';
import { useAuth } from '../contexts/AuthContext';

export function useMatches() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadMatches();
      
      // Subscribe to new matches
      const subscription = databaseService.subscribeToMatches(
        user.id,
        (newMatch) => {
          setMatches(prev => [newMatch, ...prev]);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user?.id]);

  const loadMatches = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const userMatches = await databaseService.getUserMatches(user.id);
      setMatches(userMatches);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  return {
    matches,
    loading,
    error,
    refetch: loadMatches,
  };
}