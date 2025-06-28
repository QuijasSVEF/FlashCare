import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
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