import { databaseService } from './database';
import { Database } from './supabase';

type User = Database['public']['Tables']['users']['Row'];

export const matchingService = {
  async handleSwipe(
    swiperId: string,
    targetUserId: string,
    direction: 'like' | 'pass',
    jobId?: string
  ) {
    try {
      // For family swiping on caregivers, we need a job context
      if (!jobId) {
        // Get the family's most recent job post as default
        const familyJobs = await databaseService.getUserJobPosts(swiperId);
        if (familyJobs.length === 0) {
          throw new Error('No job posts found. Please create a job posting first.');
        }
        jobId = familyJobs[0].id;
      }

      // Check if swipe already exists
      const existingSwipe = await this.getExistingSwipe(swiperId, targetUserId, jobId);
      if (existingSwipe) {
        console.log('Swipe already exists');
        return { isMatch: false, alreadySwiped: true };
      }

      // Create swipe record
      const swipeData = {
        family_id: swiperId,
        caregiver_id: targetUserId,
        job_id: jobId,
        direction,
      };

      await databaseService.createSwipe(swipeData);

      // If it's a like, check for mutual match
      if (direction === 'like') {
        const isMatch = await databaseService.checkForMatch(
          swiperId,
          targetUserId,
          jobId
        );

        if (isMatch) {
          // Create match
          const matchData = {
            family_id: swiperId,
            caregiver_id: targetUserId,
            job_id: jobId,
          };

          const match = await databaseService.createMatch(matchData);
          return { isMatch: true, match };
        }
      }

      return { isMatch: false };
    } catch (error) {
      console.error('Error handling swipe:', error);
      throw error;
    }
  },

  async handleJobSwipe(
    caregiverId: string,
    familyId: string,
    jobId: string,
    direction: 'like' | 'pass'
  ) {
    try {
      // Check if swipe already exists
      const existingSwipe = await this.getExistingSwipe(familyId, caregiverId, jobId);
      if (existingSwipe) {
        console.log('Swipe already exists');
        return { isMatch: false, alreadySwiped: true };
      }

      // Create swipe record (caregiver swiping on family's job)
      const swipeData = {
        family_id: familyId,
        caregiver_id: caregiverId,
        job_id: jobId,
        direction,
      };

      await databaseService.createSwipe(swipeData);

      // If it's a like, check for mutual match
      if (direction === 'like') {
        const isMatch = await databaseService.checkForMatch(
          familyId,
          caregiverId,
          jobId
        );

        if (isMatch) {
          // Create match
          const matchData = {
            family_id: familyId,
            caregiver_id: caregiverId,
            job_id: jobId,
          };

          const match = await databaseService.createMatch(matchData);
          return { isMatch: true, match };
        }
      }

      return { isMatch: false };
    } catch (error) {
      console.error('Error handling job swipe:', error);
      throw error;
    }
  },

  async getExistingSwipe(familyId: string, caregiverId: string, jobId: string) {
    try {
      const { data, error } = await databaseService.supabase
        .from('swipes')
        .select('*')
        .eq('family_id', familyId)
        .eq('caregiver_id', caregiverId)
        .eq('job_id', jobId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error checking existing swipe:', error);
      return null;
    }
  },

  async getRecommendedCaregivers(
    familyUserId: string,
    location?: string,
    limit = 10
  ) {
    try {
      // Get caregivers that haven't been swiped on yet
      const { data: swipedCaregivers } = await databaseService.supabase
        .from('swipes')
        .select('caregiver_id')
        .eq('family_id', familyUserId);

      const swipedIds = swipedCaregivers?.map(s => s.caregiver_id) || [];

      let query = databaseService.supabase
        .from('users')
        .select('*')
        .eq('role', 'caregiver')
        .limit(limit);

      if (swipedIds.length > 0) {
        query = query.not('id', 'in', `(${swipedIds.join(',')})`);
      }

      if (location) {
        // Simple location matching - in production, use geolocation
        query = query.ilike('location', `%${location.split(',')[0]}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error getting recommended caregivers:', error);
      throw error;
    }
  },

  async getRecommendedJobs(
    caregiverId: string,
    location?: string,
    limit = 10
  ) {
    try {
      // Get jobs that haven't been swiped on yet
      const { data: swipedJobs } = await databaseService.supabase
        .from('swipes')
        .select('job_id')
        .eq('caregiver_id', caregiverId);

      const swipedJobIds = swipedJobs?.map(s => s.job_id) || [];

      let query = databaseService.supabase
        .from('job_posts')
        .select(`
          *,
          family:users!job_posts_family_id_fkey(*)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (swipedJobIds.length > 0) {
        query = query.not('id', 'in', `(${swipedJobIds.join(',')})`);
      }

      if (location) {
        query = query.ilike('location', `%${location.split(',')[0]}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error getting recommended jobs:', error);
      throw error;
    }
  },

  async calculateCompatibilityScore(
    familyUser: User,
    caregiverUser: User
  ): Promise<number> {
    let score = 0;

    // Location proximity (if both have location)
    if (familyUser.location && caregiverUser.location) {
      // Simple string match for now - in production, use geolocation
      if (familyUser.location === caregiverUser.location) {
        score += 30;
      } else if (
        familyUser.location.split(',')[1]?.trim() === 
        caregiverUser.location.split(',')[1]?.trim()
      ) {
        // Same state/region
        score += 15;
      }
    }

    // Profile completeness
    const familyCompleteness = this.calculateProfileCompleteness(familyUser);
    const caregiverCompleteness = this.calculateProfileCompleteness(caregiverUser);
    score += (familyCompleteness + caregiverCompleteness) / 2 * 0.2;

    // Get caregiver rating
    try {
      const rating = await databaseService.getUserRating(caregiverUser.id);
      if (rating.count > 0) {
        score += (rating.average / 5) * 40; // Max 40 points for perfect rating
      }
    } catch (error) {
      console.error('Error getting rating:', error);
    }

    return Math.min(100, Math.max(0, score));
  },

  calculateProfileCompleteness(user: User): number {
    let completeness = 0;
    const fields = ['name', 'bio', 'phone', 'location'];
    
    fields.forEach(field => {
      if (user[field as keyof User]) {
        completeness += 25;
      }
    });

    return completeness;
  }
};