import React, { createContext, useContext, useEffect, useState } from 'react';
import { Database } from '../lib/supabase';

type User = Database['public']['Tables']['users']['Row'];

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User | null>;
  signUp: (email: string, password: string, userData: { name: string; role: 'family' | 'caregiver' }) => Promise<void>;
  signOut: () => Promise<boolean>;
  updateProfile: (updates: Database['public']['Tables']['users']['Update']) => Promise<void>;
  setDemoUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string): Promise<User | null> => {
    // Demo implementation - always succeeds
    const demoUser: User = {
      id: 'demo-user',
      name: 'Demo User',
      role: 'family',
      avatar_url: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      bio: 'Demo user for testing',
      phone: '+1 (555) 123-4567',
      emergency_phone: '+1 (555) 911-0000',
      location: 'San Francisco, CA',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setUser(demoUser);
    return demoUser;
  };

  const signUp = async (email: string, password: string, userData: { name: string; role: 'family' | 'caregiver' }): Promise<void> => {
    // Demo implementation
    const demoUser: User = {
      id: 'demo-user-new',
      name: userData.name,
      role: userData.role,
      avatar_url: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      bio: 'New demo user',
      phone: '+1 (555) 123-4567',
      emergency_phone: '+1 (555) 911-0000',
      location: 'San Francisco, CA',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setUser(demoUser);
  };

  const signOut = async (): Promise<boolean> => {
    setUser(null);
    return true;
  };

  const updateProfile = async (updates: Database['public']['Tables']['users']['Update']): Promise<void> => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const setDemoUser = (demoUser: User) => {
    setUser(demoUser);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    setDemoUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}