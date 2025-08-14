'use client';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side only Supabase client
const getSupabaseClient = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials not configured');
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: window.localStorage,
      storageKey: 'sb-auth-token'
    }
  });
};

export const supabase = getSupabaseClient();