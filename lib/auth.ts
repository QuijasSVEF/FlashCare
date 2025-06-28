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
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        throw error;
      }
      
      if (!data.user || !data.session) {
        throw new Error('Sign in failed - no user or session returned');
      }
      
      return data;
    } catch (error: any) {
      // Enhance error messages for better user experience
      if (error.message?.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password');
      } else if (error.message?.includes('Email not confirmed')) {
        throw new Error('Please confirm your email before signing in');
      } else if (error.message?.includes('Too many requests')) {
        throw new Error('Too many sign-in attempts. Please wait a moment and try again');
      }
      throw error;
    }
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