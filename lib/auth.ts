import { demoUsers, getDemoUserByEmail } from './demoUsers';

export const authService = {
  async signUp(email: string, password: string, userData: { name: string; role: 'family' | 'caregiver' }) {
    try {
      console.log('Demo signup with role:', userData.role);
      // Demo implementation - just return a success
      const demoUser = {
        id: `user-${Date.now()}`,
        email,
        name: userData.name,
        role: userData.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      return { data: { user: demoUser, session: null }, error: null };
    } catch (error: any) {
      console.error('SignUp error:', error);
      throw error;
    }
  },

  async signIn(email: string, password: string) {
    try {
      console.log('Demo signin for:', email);

      // Demo implementation - find a matching demo user
      const demoUser = getDemoUserByEmail(email);
      
      if (!demoUser) {
        throw new Error('Invalid email or password');
      }
      
      return { 
        data: { 
          user: demoUser, 
          session: { access_token: 'demo-token' } 
        }, 
        error: null 
      };
    } catch (error: any) {
      console.error('SignIn error:', error);
      
      // Enhance error messages for better user experience
      if (error.message?.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password');
      } else if (error.message?.includes('Email not confirmed')) {
        throw new Error('Please confirm your email before signing in');
      } else if (error.message?.includes('Too many requests')) {
        throw new Error('Too many sign-in attempts. Please wait a moment and try again');
      }
      throw error;
    }
  },

  async signOut() {
    try {
      console.log('Demo sign out');
      return { error: null };
    } catch (error) {
      console.error('Error in auth service sign out:', error);
      // Don't throw - we want to proceed with clearing local state
    }
  },

  async getCurrentUser() {
    try {
      console.log('Demo: Getting current user...');
      return null; // In demo mode, we'll handle this in the AuthContext
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  async updateProfile(updates: any) {
    try {
      console.log('Demo: Updating profile...', updates);
      // In demo mode, we'll handle this in the AuthContext
      return updates;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
};