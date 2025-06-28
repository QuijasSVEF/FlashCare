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
    try {
      console.log('Creating user with data:', userData);
      // First check if user already exists
      const existingUser = await this.getUser(userData.id);
      if (existingUser) {
        console.log('User already exists, returning existing user');
        return existingUser;
      }

      // Create new user
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        throw error;
      }
      
      console.log('User created successfully:', data);
      return data;
    } catch (error: any) {
      console.error('CreateUser error:', error);
      
      // If it's a duplicate key error, try to get the existing user
      if (error.message?.includes('duplicate key') || 
          error.code === '23505') {
        const existingUser = await this.getUser(userData.id);
        if (existingUser) {
          return existingUser;
        }
      }
      
      throw error;
    }
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
    try {
      console.log('Fetching user profile for:', userId);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Database error getting user:', error);
        throw error;
      }
      
      console.log('Database: User profile fetched successfully');
      return data;
    } catch (error) {
      console.error('Database: Error getting user:', error);
      throw error;
    }
  },

  async getUserSafe(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
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

  // Expose supabase client for advanced queries
  supabase,

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
    // Check if both users have liked each other for this job
    const { data: swipes } = await supabase
      .from('swipes')
      .select('*')
      .eq('family_id', familyId)
      .eq('caregiver_id', caregiverId)
      .eq('job_id', jobId)
      .eq('direction', 'like');

    // We need exactly 2 likes (one from family, one from caregiver) for a match
    return swipes && swipes.length >= 2;
  },

  async createMatch(matchData: Database['public']['Tables']['matches']['Insert']) {
    // Check if match already exists
    const { data: existingMatch } = await supabase
      .from('matches')
      .select('*')
      .eq('family_id', matchData.family_id)
      .eq('caregiver_id', matchData.caregiver_id)
      .eq('job_id', matchData.job_id)
      .single();

    if (existingMatch) {
      return existingMatch;
    }

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
    // Verify the sender is part of the match
    const { data: match } = await supabase
      .from('matches')
      .select('*')
      .eq('id', messageData.match_id)
      .single();

    if (!match) {
      throw new Error('Match not found');
    }

    if (match.family_id !== messageData.sender_id && match.caregiver_id !== messageData.sender_id) {
      throw new Error('Unauthorized to send message to this match');
    }

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

  async getJobPostById(jobId: string) {
    const { data, error } = await supabase
      .from('job_posts')
      .select(`
        *,
        family:users!job_posts_family_id_fkey(*)
      `)
      .eq('id', jobId)
      .single();

    if (error) throw error;
    return data;
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

  // Enhanced search and filtering
  async searchCaregivers(filters: {
    location?: string;
    minRating?: number;
    experience?: string;
    skills?: string[];
    availability?: string;
    maxDistance?: number;
  }, limit = 20) {
    let query = supabase
      .from('users')
      .select('*')
      .eq('role', 'caregiver')
      .limit(limit);

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    // TODO: Add more sophisticated filtering based on ratings, skills, etc.
    return data || [];
  },

  async searchJobPosts(filters: {
    location?: string;
    minRate?: number;
    maxRate?: number;
    minHours?: number;
    maxHours?: number;
    jobType?: string;
  }, limit = 20) {
    let query = supabase
      .from('job_posts')
      .select(`
        *,
        family:users!job_posts_family_id_fkey(*)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

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

    const { data, error } = await query;
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
    // First, get all match IDs where the user is either caregiver or family
    const { data: userMatches, error: matchError } = await supabase
      .from('matches')
      .select('id')
      .or(`caregiver_id.eq.${userId},family_id.eq.${userId}`);

    if (matchError) throw matchError;
    
    if (!userMatches || userMatches.length === 0) {
      return [];
    }

    const matchIds = userMatches.map(match => match.id);

    // Then get schedules for those matches
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
      .in('match_id', matchIds)
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
    // Check if review already exists
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('*')
      .eq('reviewer_id', reviewData.reviewer_id)
      .eq('reviewee_id', reviewData.reviewee_id)
      .single();

    if (existingReview) {
      throw new Error('You have already reviewed this person');
    }

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

  // Notification operations
  async createNotification(notificationData: {
    user_id: string;
    type: string;
    title: string;
    message: string;
    data?: any;
  }) {
    // In a real app, you'd have a notifications table
    // For now, we'll use browser notifications or push notifications
    console.log('Creating notification:', notificationData);
  },

  async getUserNotifications(userId: string) {
    // Mock notifications for demo
    return [];
  },

  async markNotificationAsRead(notificationId: string) {
    // Mark notification as read
    console.log('Marking notification as read:', notificationId);
  },

  // Real-time subscriptions
  subscribeToMessages(matchId: string, callback: (message: Message) => void) {
    return supabase
      .channel(`messages_${matchId}`)
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
      .channel(`matches_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches',
          filter: `or(caregiver_id.eq.${userId},family_id.eq.${userId})`,
        },
        (payload) => {
          // Fetch the complete match data with user info
          this.getUserMatches(userId).then(matches => {
            const newMatch = matches.find(m => m.id === payload.new.id);
            if (newMatch) {
              callback(newMatch);
            }
          });
        }
      )
      .subscribe();
  }
};