import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with service role key
export function getSupabaseAdmin() {
  const supabaseUrl = 'https://cvhiujltpzxhmknznmuq.supabase.co';
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2aGl1amx0cHp4aG1rbnpubXVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA0OTkxNywiZXhwIjoyMDcwNjI1OTE3fQ.teNeiAAYG6qKVTlG9yx3dC9HVYFBCqjU0wqXJvCn_J8';
  
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Client-side anon key version for server components
export function getSupabaseServer() {
  const supabaseUrl = 'https://cvhiujltpzxhmknznmuq.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2aGl1amx0cHp4aG1rbnpubXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNDk5MTcsImV4cCI6MjA3MDYyNTkxN30.WxnQPMbmkCYpJ1aYWpRMk9gndRTfFtFh9_VmLSqNttQ';
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}