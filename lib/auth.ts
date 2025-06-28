import { supabase } from './supabase';
import { databaseService } from './database';
import { Database } from './supabase';

type User = Database['public']['Tables']['users']['Row'];

export const authService = {
  async signUp(email: string, password: string, userData: { name: string; role: 'family' | 'caregiver' }) {
    try {
      // First, create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: undefined, // Disable email confirmation for now
        }
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      // Wait a moment for the auth user to be fully created
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Then create the user profile
      try {
        await databaseService.createUser({
          id: authData.user.id,
          name: userData.name,
          role: userData.role,
        });
      } catch (profileError: any) {
        console.error('Error creating user profile:', profileError);
        
        // If profile creation fails due to user already existing, that's okay
        if (!profileError.message?.includes('duplicate key') && 
            !profileError.message?.includes('already exists')) {
          throw new Error('Failed to create user profile: ' + profileError.message);
        }
      }

      return authData;
    } catch (error: any) {
      console.error('SignUp error:', error);
      throw error;
    }
  },

  async signIn(email: string, password: string) {
    try {
      // Clear any existing session first
      await supabase.auth.signOut();
      
      // Wait a moment for cleanup
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
      console.error('SignIn error:', error);
      
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
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      // Wait a moment for the database trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 500));

      const profile = await databaseService.getUser(user.id);
      
      // If profile doesn't exist, try to create it
      if (!profile) {
        console.log('Profile not found, attempting to create...');
        try {
          const newProfile = await databaseService.createUser({
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            role: user.user_metadata?.role || 'family',
          });
          return newProfile;
        } catch (createError) {
          console.error('Error creating profile:', createError);
          return null;
        }
      }
      
      return profile;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  async updateProfile(updates: Database['public']['Tables']['users']['Update']) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('No user found');

    return await databaseService.updateUser(user.id, updates);
  }
};