'use client';

import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config';

let supabaseInstance: any = null;

export function getSupabase() {
  if (typeof window === 'undefined') {
    return null;
  }

  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = SUPABASE_URL;
  const supabaseAnonKey = SUPABASE_ANON_KEY;

  // Debug logging with more detail
  console.log('=== Supabase Client Initialization ===');
  console.log('Environment variables:');
  console.log('- process.env.NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('- process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  console.log('Using values:');
  console.log('- SUPABASE_URL:', supabaseUrl);
  console.log('- ANON_KEY length:', supabaseAnonKey?.length);
  console.log('- ANON_KEY first 40 chars:', supabaseAnonKey?.substring(0, 40));
  console.log('- Using hardcoded fallback:', !process.env.NEXT_PUBLIC_SUPABASE_URL);

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials missing');
    console.error('URL:', supabaseUrl);
    console.error('Key:', supabaseAnonKey);
    return null;
  }

  console.log('Creating Supabase client with URL:', supabaseUrl);
  
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: window.localStorage,
      storageKey: 'sb-auth-token-' + supabaseUrl.split('.')[0].split('//')[1],
    }
  });

  return supabaseInstance;
}