import { supabase } from './supabase';
import { databaseService } from './database';
import { Database } from './supabase';

type User = Database['public']['Tables']['users']['Row'];

export const authService = {
  async signUp(email: string, password: string, userData: { name: string; role: 'family' | 'caregiver' }) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      throw authError;
    }

    if (authData.user) {
      try {
        await databaseService.createUser({
          id: authData.user.id,
          name: userData.name,
          role: userData.role,
        });
      } catch (profileError) {
        console.error('Error creating user profile:', profileError);
        // If profile creation fails, we should still return the auth data
        // The user can complete their profile later
      }
    }

    return authData;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase auth error:', error);
      throw error;
    }
    
    if (!data.user) {
      throw new Error('Sign in failed - no user returned');
    }
    
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
      const profile = await databaseService.getUser(user.id);
      return profile;
    } catch (error) {
      console.error('Error getting user profile:', error);
      // If profile doesn't exist, return null so user can complete profile setup
      return null;
    }
  },

  async updateProfile(updates: Database['public']['Tables']['users']['Update']) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('No user found');

    return await databaseService.updateUser(user.id, updates);
  }
};