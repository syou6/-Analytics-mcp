'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Supabase not configured');
        router.push('/');
        return;
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      
      // Get the session from the URL
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth error:', error);
        router.push('/');
        return;
      }
      
      if (session) {
        console.log('Session found, redirecting to home');
        // Session exists, redirect to home
        router.push('/');
      } else {
        console.log('No session, redirecting to home');
        router.push('/');
      }
    };

    // Give Supabase time to process the URL
    setTimeout(handleAuth, 1000);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">認証処理中...</p>
      </div>
    </div>
  );
}