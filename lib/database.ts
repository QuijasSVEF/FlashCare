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

      // Create new user - demo implementation
      const demoUser: User = {
        id: userData.id,
        name: userData.name,
        role: userData.role,
        avatar_url: userData.avatar_url,
        bio: userData.bio || '',
        phone: userData.phone || '',
        emergency_phone: userData.emergency_phone || '',
        location: userData.location || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      console.log('User created successfully:', demoUser);
      return demoUser;
    } catch (error: any) {
      console.error('CreateUser error:', error);
      throw error;
    }
  },

  async updateUser(userId: string, updates: Database['public']['Tables']['users']['Update']) {
    // Demo implementation
    const user = await this.getUser(userId);
    if (!user) throw new Error('User not found');
    
    const updatedUser = { ...user, ...updates, updated_at: new Date().toISOString() };
    return updatedUser;
  },

  async getUser(userId: string) {
    try {
      console.log('Fetching user profile for:', userId);
      
      // Demo implementation
      const demoUser: User = {
        id: userId,
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
      
      console.log('Database: User profile fetched:', !!demoUser);
      return demoUser;
    } catch (error) {
      console.error('Database: Error getting user:', error);
      throw error;
    }
  },

  async getUserSafe(userId: string) {
    try {
      return await this.getUser(userId);
    } catch (error) {
      console.error('Database error getting user safe:', error);
      return null;
    }
  },

  async getCaregivers(excludeUserId?: string, limit = 10) {
    // Demo implementation
    const caregivers: User[] = [
      {
        id: 'caregiver-1',
        name: 'Sarah Johnson',
        role: 'caregiver',
        avatar_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        bio: 'Experienced caregiver with 5+ years helping families. Specializing in senior care and disability support.',
        phone: '+1 (555) 123-4567',
        emergency_phone: '+1 (555) 911-0000',
        location: 'San Francisco, CA',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'caregiver-2',
        name: 'Michael Chen',
        role: 'caregiver',
        avatar_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        bio: 'Certified nursing assistant with expertise in elderly care. Patient, compassionate, and reliable.',
        phone: '+1 (555) 234-5678',
        emergency_phone: '+1 (555) 911-0000',
        location: 'San Francisco, CA',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    
    if (excludeUserId) {
      return caregivers.filter(c => c.id !== excludeUserId);
    }
    
    return caregivers;
  },

  // Document management
  async createUserDocument(documentData: {
    user_id: string;
    file_name: string;
    file_url: string;
    file_path: string;
    file_type?: string;
    file_size?: number;
    document_type?: string;
  }) {
    // Demo implementation
    return {
      id: `doc-${Date.now()}`,
      ...documentData,
      uploaded_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
  },

  async getUserDocuments(userId: string, documentType?: string) {
    // Demo implementation
    const documents = [
      {
        id: 'doc-1',
        user_id: userId,
        file_name: 'certification.pdf',
        file_url: 'https://example.com/certification.pdf',
        file_path: `${userId}/certification.pdf`,
        file_type: 'application/pdf',
        file_size: 1024 * 1024,
        document_type: 'certification',
        uploaded_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      },
    ];
    
    if (documentType) {
      return documents.filter(d => d.document_type === documentType);
    }
    
    return documents;
  },

  async deleteUserDocument(documentId: string) {
    // Demo implementation
    console.log('Document deleted:', documentId);
  },

  // Swipe operations
  async createSwipe(swipeData: Database['public']['Tables']['swipes']['Insert']) {
    // Demo implementation
    return {
      id: `swipe-${Date.now()}`,
      ...swipeData,
      created_at: new Date().toISOString(),
    };
  },

  async checkForMatch(familyId: string, caregiverId: string, jobId: string) {
    // Demo implementation - always match
    return true;
  },

  async createMatch(matchData: Database['public']['Tables']['matches']['Insert']) {
    // Demo implementation
    return {
      id: `match-${Date.now()}`,
      ...matchData,
      created_at: new Date().toISOString(),
    };
  },

  // Match operations
  async getUserMatches(userId: string) {
    // Demo implementation
    const matches = [
      {
        id: 'match-1',
        caregiver_id: 'caregiver-1',
        family_id: 'family-1',
        job_id: 'job-1',
        created_at: new Date().toISOString(),
        caregiver: {
          id: 'caregiver-1',
          name: 'Sarah Johnson',
          role: 'caregiver',
          avatar_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          location: 'San Francisco, CA',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        family: {
          id: 'family-1',
          name: 'The Smiths',
          role: 'family',
          avatar_url: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          location: 'San Francisco, CA',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      }
    ];
    
    return matches;
  },

  // Message operations
  async getMatchMessages(matchId: string) {
    // Demo implementation
    return [
      {
        id: 'msg-1',
        match_id: matchId,
        sender_id: 'family-1',
        body: 'Hello! Are you available next week?',
        sent_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'msg-2',
        match_id: matchId,
        sender_id: 'caregiver-1',
        body: 'Hi there! Yes, I am available on Tuesday and Thursday.',
        sent_at: new Date(Date.now() - 3000000).toISOString(),
      },
    ];
  },

  async sendMessage(messageData: Database['public']['Tables']['messages']['Insert']) {
    // Demo implementation
    return {
      id: `msg-${Date.now()}`,
      ...messageData,
      sent_at: new Date().toISOString(),
    };
  },

  // Job post operations
  async createJobPost(jobData: Database['public']['Tables']['job_posts']['Insert']) {
    // Demo implementation
    return {
      id: `job-${Date.now()}`,
      ...jobData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },

  async getJobPosts(limit = 10) {
    // Demo implementation
    return [
      {
        id: 'job-1',
        family_id: 'family-1',
        title: 'Senior Care Assistant',
        description: 'Looking for a compassionate caregiver for my elderly mother. She needs help with daily activities and medication management.',
        hours_per_week: 20,
        rate_hour: 25,
        location: 'San Francisco, CA',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        family: {
          id: 'family-1',
          name: 'The Smiths',
          role: 'family',
          avatar_url: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          location: 'San Francisco, CA',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      }
    ];
  },

  async getJobPostById(jobId: string) {
    // Demo implementation
    return {
      id: jobId,
      family_id: 'family-1',
      title: 'Senior Care Assistant',
      description: 'Looking for a compassionate caregiver for my elderly mother. She needs help with daily activities and medication management.',
      hours_per_week: 20,
      rate_hour: 25,
      location: 'San Francisco, CA',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      family: {
        id: 'family-1',
        name: 'The Smiths',
        role: 'family',
        avatar_url: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        location: 'San Francisco, CA',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    };
  },

  async getUserJobPosts(familyId: string) {
    // Demo implementation
    return [
      {
        id: 'job-1',
        family_id: familyId,
        title: 'Senior Care Assistant',
        description: 'Looking for a compassionate caregiver for my elderly mother. She needs help with daily activities and medication management.',
        hours_per_week: 20,
        rate_hour: 25,
        location: 'San Francisco, CA',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ];
  },

  async updateJobPost(jobId: string, updates: Database['public']['Tables']['job_posts']['Update']) {
    // Demo implementation
    const job = {
      id: jobId,
      family_id: 'family-1',
      title: 'Senior Care Assistant',
      description: 'Looking for a compassionate caregiver for my elderly mother. She needs help with daily activities and medication management.',
      hours_per_week: 20,
      rate_hour: 25,
      location: 'San Francisco, CA',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    return { ...job, ...updates, updated_at: new Date().toISOString() };
  },

  async deleteJobPost(jobId: string) {
    // Demo implementation
    console.log('Job deleted:', jobId);
  },

  async getJobPostApplicants(jobId: string) {
    // Demo implementation
    return [
      {
        id: 'swipe-1',
        job_id: jobId,
        family_id: 'family-1',
        caregiver_id: 'caregiver-1',
        direction: 'like',
        created_at: new Date().toISOString(),
        caregiver: {
          id: 'caregiver-1',
          name: 'Sarah Johnson',
          role: 'caregiver',
          avatar_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          bio: 'Experienced caregiver with 5+ years helping families. Specializing in senior care and disability support.',
          location: 'San Francisco, CA',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      }
    ];
  },

  // Schedule operations
  async createSchedule(scheduleData: Database['public']['Tables']['schedules']['Insert']) {
    // Demo implementation
    return {
      id: `schedule-${Date.now()}`,
      ...scheduleData,
      created_at: new Date().toISOString(),
    };
  },

  async getUserSchedules(userId: string) {
    // Demo implementation
    return [
      {
        id: 'schedule-1',
        match_id: 'match-1',
        start_ts: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        end_ts: new Date(Date.now() + 86400000 + 7200000).toISOString(), // Tomorrow + 2 hours
        status: 'confirmed',
        created_at: new Date().toISOString(),
        match: {
          id: 'match-1',
          caregiver_id: 'caregiver-1',
          family_id: 'family-1',
          job_id: 'job-1',
          created_at: new Date().toISOString(),
          caregiver: {
            id: 'caregiver-1',
            name: 'Sarah Johnson',
            role: 'caregiver',
            avatar_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
            location: 'San Francisco, CA',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          family: {
            id: 'family-1',
            name: 'The Smiths',
            role: 'family',
            avatar_url: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
            location: 'San Francisco, CA',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        }
      }
    ];
  },

  async updateScheduleStatus(scheduleId: string, status: 'pending' | 'confirmed' | 'cancelled') {
    // Demo implementation
    return {
      id: scheduleId,
      match_id: 'match-1',
      start_ts: new Date(Date.now() + 86400000).toISOString(),
      end_ts: new Date(Date.now() + 86400000 + 7200000).toISOString(),
      status,
      created_at: new Date().toISOString(),
    };
  },

  // Review operations
  async createReview(reviewData: Database['public']['Tables']['reviews']['Insert']) {
    // Demo implementation
    return {
      id: `review-${Date.now()}`,
      ...reviewData,
      created_at: new Date().toISOString(),
    };
  },

  async getUserReviews(userId: string) {
    // Demo implementation
    return [
      {
        id: 'review-1',
        reviewer_id: 'family-1',
        reviewee_id: userId,
        rating_int: 5,
        comment_text: 'Excellent caregiver! Very professional and caring.',
        created_at: new Date().toISOString(),
        reviewer: {
          id: 'family-1',
          name: 'The Smiths',
          role: 'family',
          avatar_url: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          location: 'San Francisco, CA',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      }
    ];
  },

  async getUserRating(userId: string) {
    // Demo implementation
    return { average: 4.8, count: 12 };
  },

  // Real-time subscriptions
  subscribeToMessages(matchId: string, callback: (message: Message) => void) {
    // Demo implementation
    console.log('Subscribed to messages for match:', matchId);
    return {
      unsubscribe: () => {
        console.log('Unsubscribed from messages for match:', matchId);
      }
    };
  },

  subscribeToMatches(userId: string, callback: (match: any) => void) {
    // Demo implementation
    console.log('Subscribed to matches for user:', userId);
    return {
      unsubscribe: () => {
        console.log('Unsubscribed from matches for user:', userId);
      }
    };
  }
};