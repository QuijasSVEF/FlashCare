import { supabase } from './supabase';
import { databaseService } from './database';
import { Database } from './supabase';

type User = Database['public']['Tables']['users']['Row'];

export const authService = {
  async signUp(email: string, password: string, userData: { name: string; role: 'family' | 'caregiver' }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      await databaseService.createUser({
        id: data.user.id,
        name: userData.name,
        role: userData.role,
      });
    }

    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    try {
      return await databaseService.getUser(user.id);
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  },

  async updateProfile(updates: Database['public']['Tables']['users']['Update']) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('No user found');

    return await databaseService.updateUser(user.id, updates);
  }
};