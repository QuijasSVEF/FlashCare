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
          data: {
            name: userData.name,
            role: userData.role,
          }
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
      console.log('Auth service: Starting signin for:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(), 
        password,
      });

      if (error) {
        console.error('Supabase signin error:', error);
        throw error;
      }
      
      if (!data.user || !data.session) {
        throw new Error('Sign in failed - no user or session returned');
      }
      
      console.log('Supabase signin successful for user:', data.user.id);

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
    try {
      console.log('Signing out from Supabase...');
            
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase sign out error:', error);
        // Log error but don't throw - we want to clear local state
      }
      
      console.log('Supabase sign out completed');
    } catch (error) {
      console.error('Error in auth service sign out:', error);
      // Don't throw - we want to proceed with clearing local state
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      console.log('Getting current user...');
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error getting auth user:', error);
        return null;
      }
      
      if (!data.user) {
        console.log('No authenticated user found');
        return null;
      }

      console.log('Found authenticated user:', data.user.id);

      try {
        const profile = await databaseService.getUserSafe(data.user.id);
      
        if (!profile) {
          console.log('No profile found for user:', data.user.id, '- returning null');
          return null;
        }
      
        console.log('Profile loaded successfully');
        return profile;
      } catch (profileError) {
        console.error('Error fetching user profile:', profileError);
        return null;
      }
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