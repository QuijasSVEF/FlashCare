import { supabase } from './supabase';
import type { Database } from '../types/database';

type Tables = Database['public']['Tables'];
type User = Tables['users']['Row'];
type JobPost = Tables['job_posts']['Row'];
type Match = Tables['matches']['Row'];
type Message = Tables['messages']['Row'];
type Swipe = Tables['swipes']['Row'];
type Review = Tables['reviews']['Row'];
type Schedule = Tables['schedules']['Row'];
type Credential = Tables['credentials']['Row'];
type UserDocument = Tables['user_documents']['Row'];

export const databaseService = {
  // User operations
  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateUser(id: string, updates: Partial<Omit<User, 'id' | 'created_at'>>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUsersByRole(role: 'family' | 'caregiver') {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', role);
    
    if (error) throw error;
    return data;
  },

  // Job post operations
  async createJobPost(jobData: Omit<JobPost, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('job_posts')
      .insert(jobData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getJobPosts() {
    const { data, error } = await supabase
      .from('job_posts')
      .select(`
        *,
        users!job_posts_family_id_fkey(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getJobPostsByFamily(familyId: string) {
    const { data, error } = await supabase
      .from('job_posts')
      .select('*')
      .eq('family_id', familyId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async updateJobPost(id: string, updates: Partial<Omit<JobPost, 'id' | 'family_id' | 'created_at'>>) {
    const { data, error } = await supabase
      .from('job_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteJobPost(id: string) {
    const { error } = await supabase
      .from('job_posts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Swipe operations
  async createSwipe(swipeData: Omit<Swipe, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('swipes')
      .insert(swipeData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getSwipesBetweenUsers(familyId: string, caregiverId: string) {
    const { data, error } = await supabase
      .from('swipes')
      .select('*')
      .eq('family_id', familyId)
      .eq('caregiver_id', caregiverId);
    
    if (error) throw error;
    return data;
  },

  // Match operations
  async createMatch(matchData: Omit<Match, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('matches')
      .insert(matchData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getMatchesForUser(userId: string) {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        family:users!matches_family_id_fkey(*),
        caregiver:users!matches_caregiver_id_fkey(*),
        job_posts(*)
      `)
      .or(`family_id.eq.${userId},caregiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Message operations
  async createMessage(messageData: Omit<Message, 'id' | 'sent_at'>) {
    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getMessagesForMatch(matchId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(*)
      `)
      .eq('match_id', matchId)
      .order('sent_at', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Review operations
  async createReview(reviewData: Omit<Review, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('reviews')
      .insert(reviewData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getReviewsForUser(userId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:users!reviews_reviewer_id_fkey(*),
        reviewee:users!reviews_reviewee_id_fkey(*)
      `)
      .eq('reviewee_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Schedule operations
  async createSchedule(scheduleData: Omit<Schedule, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('schedules')
      .insert(scheduleData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getSchedulesForMatch(matchId: string) {
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('match_id', matchId)
      .order('start_ts', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async updateScheduleStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled') {
    const { data, error } = await supabase
      .from('schedules')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Credential operations
  async createCredential(credentialData: Omit<Credential, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('credentials')
      .insert(credentialData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getCredentialsForUser(userId: string) {
    const { data, error } = await supabase
      .from('credentials')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // User document operations
  async createUserDocument(documentData: Omit<UserDocument, 'id' | 'uploaded_at' | 'created_at'>) {
    const { data, error } = await supabase
      .from('user_documents')
      .insert(documentData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserDocuments(userId: string) {
    const { data, error } = await supabase
      .from('user_documents')
      .select('*')
      .eq('user_id', userId)
      .order('uploaded_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async deleteUserDocument(id: string) {
    const { error } = await supabase
      .from('user_documents')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Search and filtering
  async searchJobPosts(filters: {
    location?: string;
    minRate?: number;
    maxRate?: number;
    minHours?: number;
    maxHours?: number;
  }) {
    let query = supabase
      .from('job_posts')
      .select(`
        *,
        users!job_posts_family_id_fkey(*)
      `);

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    if (filters.minRate) {
      query = query.gte('rate_hour', filters.minRate);
    }
    if (filters.maxRate) {
      query = query.lte('rate_hour', filters.maxRate);
    }
    if (filters.minHours) {
      query = query.gte('hours_per_week', filters.minHours);
    }
    if (filters.maxHours) {
      query = query.lte('hours_per_week', filters.maxHours);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async searchCaregivers(filters: {
    location?: string;
    hasCredentials?: boolean;
  }) {
    let query = supabase
      .from('users')
      .select('*')
      .eq('role', 'caregiver');

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};