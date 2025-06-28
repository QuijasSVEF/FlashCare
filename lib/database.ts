import { supabase } from './supabase';
import { Database } from './supabase';

type User = Database['public']['Tables']['users']['Row'];
type JobPost = Database['public']['Tables']['job_posts']['Row'];
type Swipe = Database['public']['Tables']['swipes']['Row'];
type Match = Database['public']['Tables']['matches']['Row'];
type Message = Database['public']['Tables']['messages']['Row'];

export const databaseService = {
  // User operations
  async createUser(userData: Database['public']['Tables']['users']['Insert']) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateUser(userId: string, updates: Database['public']['Tables']['users']['Update']) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // Handle the case where user doesn't exist
      if (error.code === 'PGRST116') {
        const notFoundError = new Error('User profile not found');
        (notFoundError as any).code = 'PGRST116';
        throw notFoundError;
      }
      throw error;
    }
    
    return data;
  },

  async getCaregivers(excludeUserId?: string, limit = 10) {
    let query = supabase
      .from('users')
      .select('*')
      .eq('role', 'caregiver')
      .limit(limit);

    if (excludeUserId) {
      query = query.neq('id', excludeUserId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Swipe operations
  async createSwipe(swipeData: Database['public']['Tables']['swipes']['Insert']) {
    const { data, error } = await supabase
      .from('swipes')
      .insert(swipeData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async checkForMatch(familyId: string, caregiverId: string, jobId: string) {
    // Check if caregiver has liked this family/job
    const { data: caregiverSwipe } = await supabase
      .from('swipes')
      .select('*')
      .eq('family_id', familyId)
      .eq('caregiver_id', caregiverId)
      .eq('job_id', jobId)
      .eq('direction', 'like')
      .single();

    return !!caregiverSwipe;
  },

  async createMatch(matchData: Database['public']['Tables']['matches']['Insert']) {
    const { data, error } = await supabase
      .from('matches')
      .insert(matchData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Match operations
  async getUserMatches(userId: string) {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        caregiver:users!matches_caregiver_id_fkey(*),
        family:users!matches_family_id_fkey(*)
      `)
      .or(`caregiver_id.eq.${userId},family_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Message operations
  async getMatchMessages(matchId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('match_id', matchId)
      .order('sent_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async sendMessage(messageData: Database['public']['Tables']['messages']['Insert']) {
    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Job post operations
  async createJobPost(jobData: Database['public']['Tables']['job_posts']['Insert']) {
    const { data, error } = await supabase
      .from('job_posts')
      .insert(jobData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getJobPosts(limit = 10) {
    const { data, error } = await supabase
      .from('job_posts')
      .select(`
        *,
        family:users!job_posts_family_id_fkey(*)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async getUserJobPosts(familyId: string) {
    const { data, error } = await supabase
      .from('job_posts')
      .select('*')
      .eq('family_id', familyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async updateJobPost(jobId: string, updates: Database['public']['Tables']['job_posts']['Update']) {
    const { data, error } = await supabase
      .from('job_posts')
      .update(updates)
      .eq('id', jobId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteJobPost(jobId: string) {
    const { error } = await supabase
      .from('job_posts')
      .delete()
      .eq('id', jobId);

    if (error) throw error;
  },

  async getJobPostApplicants(jobId: string) {
    const { data, error } = await supabase
      .from('swipes')
      .select(`
        *,
        caregiver:users!swipes_caregiver_id_fkey(*)
      `)
      .eq('job_id', jobId)
      .eq('direction', 'like')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Schedule operations
  async createSchedule(scheduleData: Database['public']['Tables']['schedules']['Insert']) {
    const { data, error } = await supabase
      .from('schedules')
      .insert(scheduleData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserSchedules(userId: string) {
    const { data, error } = await supabase
      .from('schedules')
      .select(`
        *,
        match:matches!schedules_match_id_fkey(
          *,
          caregiver:users!matches_caregiver_id_fkey(*),
          family:users!matches_family_id_fkey(*)
        )
      `)
      .or(`match.caregiver_id.eq.${userId},match.family_id.eq.${userId}`)
      .order('start_ts', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async updateScheduleStatus(scheduleId: string, status: 'pending' | 'confirmed' | 'cancelled') {
    const { data, error } = await supabase
      .from('schedules')
      .update({ status })
      .eq('id', scheduleId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Review operations
  async createReview(reviewData: Database['public']['Tables']['reviews']['Insert']) {
    const { data, error } = await supabase
      .from('reviews')
      .insert(reviewData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserReviews(userId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:users!reviews_reviewer_id_fkey(*)
      `)
      .eq('reviewee_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getUserRating(userId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating_int')
      .eq('reviewee_id', userId);

    if (error) throw error;
    
    if (!data || data.length === 0) {
      return { average: 0, count: 0 };
    }

    const total = data.reduce((sum, review) => sum + review.rating_int, 0);
    const average = total / data.length;
    
    return { average: Math.round(average * 10) / 10, count: data.length };
  },

  // Real-time subscriptions
  subscribeToMessages(matchId: string, callback: (message: Message) => void) {
    return supabase
      .channel(`messages:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          callback(payload.new as Message);
        }
      )
      .subscribe();
  },

  subscribeToMatches(userId: string, callback: (match: any) => void) {
    return supabase
      .channel(`matches:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches',
          filter: `or(caregiver_id.eq.${userId},family_id.eq.${userId})`,
        },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe();
  }
};