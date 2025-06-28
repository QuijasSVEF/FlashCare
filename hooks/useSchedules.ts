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