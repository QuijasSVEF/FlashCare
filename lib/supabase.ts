import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Get environment variables or use defaults
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Log configuration for debugging
console.log('Supabase URL configured:', supabaseUrl ? 'Yes' : 'No');
console.log('Supabase Anon Key configured:', supabaseAnonKey ? 'Yes' : 'No');

// Use localStorage for web, AsyncStorage for native platforms
const storage = Platform.OS === 'web' 
  ? {
      getItem: (key: string) => {
        if (typeof localStorage === 'undefined') return null;
        return localStorage.getItem(key);
      },
      setItem: (key: string, value: string) => {
        if (typeof localStorage === 'undefined') return;
        localStorage.setItem(key, value);
      },
      removeItem: (key: string) => {
        if (typeof localStorage === 'undefined') return;
        localStorage.removeItem(key);
      },
    }
  : AsyncStorage;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storage,
    autoRefreshToken: true, 
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
  global: {
    fetch: (...args) => {
      // Add timeout to all fetch requests
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Request timed out'));
        }, 10000); // 10 second timeout
        
        fetch(...args)
          .then(resolve)
          .catch(reject)
          .finally(() => clearTimeout(timeout));
      });
    }
  },
});

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          role: 'family' | 'caregiver';
          name: string;
          avatar_url?: string;
          bio?: string;
          phone?: string;
          emergency_phone?: string;
          location?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role: 'family' | 'caregiver';
          name: string;
          avatar_url?: string;
          bio?: string;
          phone?: string;
          emergency_phone?: string;
          location?: string;
        };
        Update: {
          name?: string;
          avatar_url?: string;
          bio?: string;
          phone?: string;
          emergency_phone?: string;
          location?: string;
        };
      };
      credentials: {
        Row: {
          id: string;
          user_id: string;
          certification_url: string;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          certification_url: string;
          expires_at: string;
        };
        Update: {
          certification_url?: string;
          expires_at?: string;
        };
      };
      job_posts: {
        Row: {
          id: string;
          family_id: string;
          title: string;
          hours_per_week: number;
          rate_hour: number;
          description: string;
          location: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          family_id: string;
          title: string;
          hours_per_week: number;
          rate_hour: number;
          description: string;
          location: string;
        };
        Update: {
          title?: string;
          hours_per_week?: number;
          rate_hour?: number;
          description?: string;
          location?: string;
        };
      };
      swipes: {
        Row: {
          id: string;
          job_id: string;
          family_id: string;
          caregiver_id: string;
          direction: 'like' | 'pass';
          created_at: string;
        };
        Insert: {
          job_id: string;
          family_id: string;
          caregiver_id: string;
          direction: 'like' | 'pass';
        };
        Update: never;
      };
      matches: {
        Row: {
          id: string;
          caregiver_id: string;
          family_id: string;
          job_id: string;
          created_at: string;
        };
        Insert: {
          caregiver_id: string;
          family_id: string;
          job_id: string;
        };
        Update: never;
      };
      messages: {
        Row: {
          id: string;
          match_id: string;
          sender_id: string;
          body: string;
          sent_at: string;
        };
        Insert: {
          match_id: string;
          sender_id: string;
          body: string;
        };
        Update: never;
      };
      reviews: {
        Row: {
          id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating_int: number;
          comment_text?: string;
          created_at: string;
        };
        Insert: {
          reviewer_id: string;
          reviewee_id: string;
          rating_int: number;
          comment_text?: string;
        };
        Update: never;
      };
      schedules: {
        Row: {
          id: string;
          match_id: string;
          start_ts: string;
          end_ts: string;
          status: 'pending' | 'confirmed' | 'cancelled';
          created_at: string;
        };
        Insert: {
          match_id: string;
          start_ts: string;
          end_ts: string;
          status?: 'pending' | 'confirmed' | 'cancelled';
        };
        Update: {
          status?: 'pending' | 'confirmed' | 'cancelled';
        };
      };
    };
  };
};