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
  signOut: () => Promise<boolean>;
  updateProfile: (updates: Database['public']['Tables']['users']['Update']) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    // Set a maximum timeout for initialization
    const initTimeout = setTimeout(() => {
      if (mounted) {
        console.log('Auth initialization timeout - setting loading to false');
        setLoading(false);
      }
    }, 5000); // 5 second timeout

    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session }, error } = await supabase.auth.getSession();

        if (!mounted) return;

        if (error) {
          console.error('Error getting session:', error);
          setUser(null);
          setLoading(false);
          return;
        }

        console.log('Session found:', !!session?.user);
        if (session?.user) {
          try {
            const profile = await authService.getCurrentUser();
            if (mounted) {
              console.log('Profile loaded:', !!profile);
              setUser(profile);
            }
          } catch (profileError) {
            console.error('Error getting user profile:', profileError);
            if (mounted) {
              setUser(null);
            }
          }
        } else {
          if (mounted) {
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          clearTimeout(initTimeout);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state change:', event, session?.user?.id);
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
        return;
      }
      
      if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        try {
          setLoading(true);
          const profile = await authService.getCurrentUser();
          if (mounted) {
            console.log('Profile in auth change:', !!profile);
            setUser(profile);
          }
        } catch (profileError) {
          console.error('Error getting profile in auth change:', profileError);
          if (mounted) {
            setUser(null);
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      } else if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(initTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, userData: { name: string; role: 'family' | 'caregiver' }) => {
    console.log('Starting signup with role:', userData.role);
    await authService.signUp(email, password, userData);
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Starting signin for:', email);
      
      const result = await authService.signIn(email, password);
      
      if (!result.user || !result.session) {
        throw new Error('Sign in failed - invalid response from server');
      }
      
      console.log('Auth service signin successful, profile will be loaded by auth state change');
      return result;
    } catch (error) {
      console.error('SignIn error in context:', error);
      setUser(null);
      throw error;
    }
  };

  const signOut = async (): Promise<boolean> => {
    try {
      console.log('Starting sign out process...');

      // Clear user state first to prevent UI flashing
      setUser(null);

      // Then sign out from Supabase
      await authService.signOut();
            
      // Clear subscription state if on mobile
      if (Platform.OS !== 'web') {
        try {
          await subscriptionService.logOut();
        } catch (subscriptionError) {
          console.error('Error clearing subscription state:', subscriptionError);
          // Don't throw - we still want to complete the sign out
        }
      }
      
      console.log('Sign out completed successfully');
      return true;
    } catch (error) {
      console.error('Error during sign out:', error);
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