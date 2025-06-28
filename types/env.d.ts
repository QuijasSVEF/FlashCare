declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_SUPABASE_URL: string;
      EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
      EXPO_PUBLIC_DAILY_API_KEY: string;
      EXPO_PUBLIC_REVENUECAT_APPLE_KEY: string;
      EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY: string;
    }
  }
}

export {};