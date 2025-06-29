import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { Database } from '../types/database';
import { demoUsers, getDemoUserByEmail } from '../lib/demoUsers';

type User = Database['public']['Tables']['users']['Row'];

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: { name: string; role: 'family' | 'caregiver' }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
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
    }, 3000); // 3 second timeout

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        setLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      clearTimeout(initTimeout);
    };
  }, []);

  const signUp = async (email: string, password: string, userData: { name: string; role: 'family' | 'caregiver' }) => {
    console.log('Starting signup with role:', userData.role);
    // Demo implementation - just return a success
    const demoUser = {
      id: `user-${Date.now()}`,
      email,
      name: userData.name,
      role: userData.role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setUser(demoUser as User);
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Starting signin for:', email);

      // Demo implementation - find a matching demo user
      const demoUser = getDemoUserByEmail(email);
      
      if (!demoUser) {
        throw new Error('Invalid email or password');
      }
      
      setUser(demoUser);
      
      return { user: demoUser };
    } catch (error) {
      console.error('SignIn error in context:', error);
      setUser(null);
      throw error;
    }
  };

  const signOut = async (): Promise<boolean> => {
    try {
      console.log('Starting sign out process');

      // Clear user state
      setUser(null);
      
      console.log('Sign out completed successfully');
      return true;
    } catch (error) {
      console.error('Error during sign out:', error);
      // Even if there's an error, clear the user state
      setUser(null);
      return true;
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    
    // Demo implementation - just update the local state
    const updatedUser = { ...user, ...updates, updated_at: new Date().toISOString() };
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