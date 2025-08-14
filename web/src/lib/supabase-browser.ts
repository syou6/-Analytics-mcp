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

  // Debug logging
  console.log('Environment check:');
  console.log('- SUPABASE_URL exists:', !!supabaseUrl);
  console.log('- SUPABASE_URL value:', supabaseUrl);
  console.log('- ANON_KEY exists:', !!supabaseAnonKey);
  console.log('- ANON_KEY length:', supabaseAnonKey?.length);
  console.log('- ANON_KEY first 20 chars:', supabaseAnonKey?.substring(0, 20));

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