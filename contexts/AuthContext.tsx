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
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          try {
            const profile = await authService.getCurrentUser();
            setUser(profile);
          } catch (profileError) {
            console.error('Error getting user profile:', profileError);
            // If profile doesn't exist, user might need to complete signup
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
            const profile = await authService.getCurrentUser();
            setUser(profile);
          } catch (profileError) {
            console.error('Error getting profile in auth change:', profileError);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: { name: string; role: 'family' | 'caregiver' }) => {
    await authService.signUp(email, password, userData);
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authService.signIn(email, password);
      
      // The auth state change listener will handle setting the user
      // We don't need to manually set it here
      
      return result;
    } catch (error) {
      console.error('Auth context sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    await authService.signOut();
    if (Platform.OS !== 'web') {
      await subscriptionService.logOut();
    }
    setUser(null);
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