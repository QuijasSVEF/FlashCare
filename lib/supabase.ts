// This is a mock implementation for demo purposes
// In a real app, this would connect to Supabase

import { Platform } from 'react-native';
import { Database } from '../types/database';

// Mock Supabase client for demo purposes
export const supabase = {
  auth: {
    getSession: async () => {
      return { data: { session: null }, error: null };
    },
    getUser: async () => {
      return { data: { user: null }, error: null };
    },
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      // In a demo, we'll just pretend this works
      return { 
        data: { 
          user: { id: 'demo-user', email },
          session: { access_token: 'demo-token' }
        }, 
        error: null 
      };
    },
    signUp: async ({ email, password, options }: any) => {
      // In a demo, we'll just pretend this works
      return { 
        data: { 
          user: { id: 'demo-user', email },
          session: null
        }, 
        error: null 
      };
    },
    signOut: async () => {
      return { error: null };
    },
    onAuthStateChange: (callback: any) => {
      // No-op for demo
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  },
  from: (table: string) => {
    return {
      select: (query?: string) => {
        return {
          eq: (column: string, value: any) => {
            return {
              single: () => {
                return { data: null, error: null };
              },
              maybeSingle: () => {
                return { data: null, error: null };
              },
              limit: (limit: number) => {
                return { data: [], error: null };
              },
              order: (column: string, { ascending }: { ascending: boolean }) => {
                return { data: [], error: null };
              },
              in: (column: string, values: any[]) => {
                return { data: [], error: null };
              },
              neq: (column: string, value: any) => {
                return { data: [], error: null };
              },
              or: (query: string) => {
                return { data: [], error: null };
              },
              ilike: (column: string, value: string) => {
                return { data: [], error: null };
              },
              gte: (column: string, value: any) => {
                return { data: [], error: null };
              },
              lte: (column: string, value: any) => {
                return { data: [], error: null };
              },
              not: (column: string, operator: string, value: any) => {
                return { data: [], error: null };
              }
            };
          },
          neq: (column: string, value: any) => {
            return { data: [], error: null };
          },
          limit: (limit: number) => {
            return { data: [], error: null };
          },
          order: (column: string, { ascending }: { ascending: boolean }) => {
            return { data: [], error: null };
          }
        };
      },
      insert: (data: any) => {
        return {
          select: () => {
            return {
              single: () => {
                return { data: { ...data, id: 'demo-id' }, error: null };
              }
            };
          }
        };
      },
      update: (data: any) => {
        return {
          eq: (column: string, value: any) => {
            return {
              select: () => {
                return {
                  single: () => {
                    return { data: { ...data, id: value }, error: null };
                  }
                };
              }
            };
          }
        };
      },
      delete: () => {
        return {
          eq: (column: string, value: any) => {
            return { error: null };
          }
        };
      }
    };
  },
  storage: {
    from: (bucket: string) => {
      return {
        upload: (path: string, file: any, options?: any) => {
          return { data: { path }, error: null };
        },
        getPublicUrl: (path: string) => {
          return { data: { publicUrl: `https://example.com/${path}` } };
        },
        remove: (paths: string[]) => {
          return { error: null };
        }
      };
    }
  },
  channel: (name: string) => {
    return {
      on: (event: string, filter: any, callback: (payload: any) => void) => {
        return {
          subscribe: () => {
            return {
              unsubscribe: () => {}
            };
          }
        };
      }
    };
  }
};

export type { Database };