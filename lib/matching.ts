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
      // Create swipe record
      const swipeData = {
        family_id: swiperId, // Assuming family member is swiping
        caregiver_id: targetUserId,
        job_id: jobId || '', // Default job ID if not provided
        direction,
      };

      await databaseService.createSwipe(swipeData);

      // If it's a like, check for mutual match
      if (direction === 'like') {
        const isMatch = await databaseService.checkForMatch(
          swiperId,
          targetUserId,
          jobId || ''
        );

        if (isMatch) {
          // Create match
          const matchData = {
            family_id: swiperId,
            caregiver_id: targetUserId,
            job_id: jobId || '',
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

  async getRecommendedCaregivers(
    familyUserId: string,
    location?: string,
    limit = 10
  ) {
    try {
      // Get all caregivers excluding already swiped ones
      const caregivers = await databaseService.getCaregivers(familyUserId, limit);

      // TODO: Implement more sophisticated matching algorithm
      // For now, return all available caregivers
      // Future enhancements:
      // - Filter by location proximity
      // - Consider user preferences
      // - Factor in ratings and reviews
      // - Machine learning recommendations

      return caregivers;
    } catch (error) {
      console.error('Error getting recommended caregivers:', error);
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