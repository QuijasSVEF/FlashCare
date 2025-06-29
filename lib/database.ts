import { Database } from './supabase';
import { demoUsers, demoCaregivers, demoFamilies, demoJobPosts, demoMatches, demoMessages, demoSchedules, demoReviews } from './demoUsers';

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
      // Demo implementation - return a mock user
      return {
        ...userData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as User;
    } catch (error: any) {
      console.error('CreateUser error:', error);
      throw error;
    }
  },

  async updateUser(userId: string, updates: Database['public']['Tables']['users']['Update']) {
    // Demo implementation - return the user with updates applied
    console.log('Updating user:', userId, updates);
    let user;
    if (userId.includes('family')) {
      user = demoFamilies.find(f => f.id === userId) || demoFamilies[0];
    } else {
      user = demoCaregivers.find(c => c.id === userId) || demoCaregivers[0];
    }
    return { ...user, ...updates, updated_at: new Date().toISOString() };
  },

  async getUser(userId: string) {
    try {
      console.log('Fetching user profile for:', userId);
      // Demo implementation
      if (userId.includes('family')) {
        return demoFamilies.find(f => f.id === userId) || demoFamilies[0];
      } else {
        return demoCaregivers.find(c => c.id === userId) || demoCaregivers[0];
      }
    } catch (error) {
      console.error('Database: Error getting user:', error);
      throw error;
    }
  },

  async getUserSafe(userId: string) {
    // Demo implementation
    if (userId.includes('family')) {
      return demoFamilies.find(f => f.id === userId) || demoFamilies[0];
    } else {
      return demoCaregivers.find(c => c.id === userId) || demoCaregivers[0];
    }
  },

  async getCaregivers(excludeUserId?: string, limit = 10) {
    // Demo implementation
    let caregivers = [...demoCaregivers];
    if (excludeUserId) {
      caregivers = caregivers.filter(c => c.id !== excludeUserId);
    }
    return caregivers.slice(0, limit);
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
      id: `document-${Date.now()}`, 
      ...documentData, 
      uploaded_at: new Date().toISOString(),
      created_at: new Date().toISOString() 
    };
  },

  async getUserDocuments(userId: string, documentType?: string) {
    // Demo implementation
    return [];
  },

  async deleteUserDocument(documentId: string) {
    // Demo implementation
    console.log('Deleting document:', documentId);
    return true;
  },

  // Job post operations
  async createJobPost(jobData: Database['public']['Tables']['job_posts']['Insert']) {
    // Demo implementation
    return { 
      id: `job-${Date.now()}`, 
      ...jobData, 
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString() 
    };
  },

  async getJobPosts(limit = 10) {
    // Demo implementation
    return demoJobPosts.slice(0, limit);
  },

  async getJobPostById(jobId: string) {
    // Demo implementation
    return demoJobPosts.find(job => job.id === jobId) || demoJobPosts[0];
  },

  async getUserJobPosts(familyId: string) {
    // Demo implementation
    return demoJobPosts.filter(job => job.family_id === familyId);
  },

  async updateJobPost(jobId: string, updates: Database['public']['Tables']['job_posts']['Update']) {
    // Demo implementation
    const job = demoJobPosts.find(job => job.id === jobId) || demoJobPosts[0];
    return { ...job, ...updates, updated_at: new Date().toISOString() };
  },

  async deleteJobPost(jobId: string) {
    // Demo implementation
    console.log('Deleting job post:', jobId);
    return true;
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
        caregiver: demoCaregivers[0]
      }
    ];
  },

  // Enhanced search and filtering
  async searchCaregivers(filters: any) {
    // Demo implementation
    return demoCaregivers;
  },

  async searchJobPosts(filters: any) {
    // Demo implementation
    return demoJobPosts;
  },
  
  // Additional methods for demo functionality
  async getUserMatches(userId: string) {
    // Demo implementation
    const userMatches = demoMatches.filter(match => 
      match.family_id === userId || match.caregiver_id === userId
    );
    console.log('Getting matches for user:', userId, 'Found:', userMatches.length);
    return userMatches;
  },
  
  async getMatchMessages(matchId: string) {
    // Demo implementation
    return demoMessages[matchId as keyof typeof demoMessages] || [];
  },
  
  async sendMessage(messageData: any) {
    // Demo implementation
    return { 
      id: `msg-${Date.now()}`, 
      ...messageData, 
      sent_at: new Date().toISOString() 
    };
  },
  
  async getUserSchedules(userId: string) {
    // Demo implementation
    return demoSchedules.filter(schedule => 
      schedule.match.family_id === userId || schedule.match.caregiver_id === userId
    );
  },
  
  async createSchedule(scheduleData: any) {
    // Demo implementation
    return { 
      id: `schedule-${Date.now()}`, 
      ...scheduleData, 
      created_at: new Date().toISOString() 
    };
  },
  
  async updateScheduleStatus(id: string, status: any) {
    // Demo implementation
    const schedule = demoSchedules.find(s => s.id === id);
    if (schedule) {
      return { ...schedule, status };
    }
    return null;
  },
  
  async getUserReviews(userId: string) {
    // Demo implementation
    return demoReviews.filter(review => review.reviewee_id === userId);
  },
  
  async getUserRating(userId: string) {
    // Demo implementation
    const reviews = demoReviews.filter(review => review.reviewee_id === userId);
    if (reviews.length === 0) {
      return { average: 0, count: 0 };
    }
    const total = reviews.reduce((sum, review) => sum + review.rating_int, 0);
    return { average: total / reviews.length, count: reviews.length };
  },
  
  async createReview(reviewData: any) {
    // Demo implementation
    return { 
      id: `review-${Date.now()}`, 
      ...reviewData, 
      created_at: new Date().toISOString() 
    };
  },
  
  // Subscription methods (mock implementations)
  subscribeToMessages(matchId: string, callback: (message: any) => void) {
    // Demo implementation
    console.log('Subscribed to messages for match:', matchId);
    return {
      unsubscribe: () => console.log('Unsubscribed from messages')
    };
  },
  
  subscribeToMatches(userId: string, callback: (match: any) => void) {
    // Demo implementation
    console.log('Subscribed to matches for user:', userId);
    return {
      unsubscribe: () => console.log('Unsubscribed from matches')
    };
  }
};