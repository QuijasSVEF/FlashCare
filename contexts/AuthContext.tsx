import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';
import { authService } from '../lib/auth';
import { subscriptionService } from '../lib/subscription';
import { Database } from '../lib/supabase';

type User = Database['public']['Tables']['users']['Row'];

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: { name: string; role: 'family' | 'caregiver' }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Database['public']['Tables']['users']['Update']) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error.message);
          setLoading(false);
          return;
        }

        console.log('Session found:', !!session?.user);
        if (session?.user) {
          try {
            // Try to get user profile with timeout
            const profile = await Promise.race([
              authService.getCurrentUser(),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
              )
            ]);
            console.log('Profile loaded:', !!profile);
            setUser(profile);
          } catch (profileError) {
            console.error('Error getting user profile:', profileError instanceof Error ? profileError.message : 'Unknown error');
            // If profile fetch fails, sign out and redirect to auth
            await supabase.auth.signOut();
            setUser(null);
          }
        } else {
          // No session, user is not authenticated
          setUser(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.id);
      try {
        if (session?.user) {
          try {
            // Add timeout for profile fetching
            const profile = await Promise.race([
              authService.getCurrentUser(),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
              )
            ]);
            console.log('Profile in auth change:', !!profile);
            setUser(profile);
          } catch (profileError) {
            console.error('Error getting profile in auth change:', profileError instanceof Error ? profileError.message : 'Unknown error');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error instanceof Error ? error.message : 'Unknown error');
        setUser(null);
      }
    });
      console.error('Error initializing auth:', error instanceof Error ? error.message : 'Unknown error');
    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: { name: string; role: 'family' | 'caregiver' }) => {
    console.log('Starting signup with role:', userData.role);
    console.log('Starting signup for:', email);
    await authService.signUp(email, password, userData);
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Starting signin for:', email);
      
      // Clear any existing user state first
      setUser(null);
      
      const result = await authService.signIn(email, password);
      
      console.log('AuthContext: Auth service signin successful, getting profile...');
      
      // Get user profile after successful signin
      try {
        const profile = await authService.getCurrentUser();
        if (profile) {
          setUser(profile);
          console.log('AuthContext: Profile loaded successfully');
        } else {
          throw new Error('Failed to load user profile');
        }
      } catch (profileError) {
        console.error('Error loading profile after signin:', profileError instanceof Error ? profileError.message : 'Unknown error');
        // Sign out if profile loading fails
        await authService.signOut();
        throw new Error('Failed to load user profile. Please try again.');
      }
      
      return result;
    } catch (error) {
      console.error('AuthContext SignIn error:', error instanceof Error ? error.message : 'Unknown error');
      setUser(null);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('AuthContext: Starting sign out process...');
      
      // Sign out from Supabase
      await authService.signOut();
      
      // Clear user state after successful sign out
      setUser(null);
      
      // Clear subscription state if on mobile
      if (Platform.OS !== 'web') {
        try {
          await subscriptionService.logOut();
        } catch (subscriptionError) {
          console.error('Error clearing subscription state:', subscriptionError instanceof Error ? subscriptionError.message : 'Unknown error');
          // Don't throw - we still want to complete the sign out
        }
      }
      
      console.log('AuthContext: Sign out completed successfully');
      
      // Force navigation to welcome screen
      return true;
    } catch (error) {
      console.error('AuthContext: Error during sign out:', error instanceof Error ? error.message : 'Unknown error');
      // Even if there's an error, clear the user state
      setUser(null);
      return true;
    }
  };

  const updateProfile = async (updates: Database['public']['Tables']['users']['Update']) => {
    const updatedUser = await authService.updateProfile(updates);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}