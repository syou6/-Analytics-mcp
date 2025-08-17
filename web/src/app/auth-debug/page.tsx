'use client';

import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase-browser';

export default function AuthDebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  
  useEffect(() => {
    const debug = async () => {
      const info: any = {
        url: window.location.href,
        hash: window.location.hash,
        hasAccessToken: window.location.hash.includes('access_token'),
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      };
      
      const supabase = getSupabase();
      if (supabase) {
        info.supabaseCreated = true;
        
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          info.sessionError = error?.message;
          info.hasSession = !!session;
          info.userEmail = session?.user?.email;
        } catch (e: any) {
          info.exception = e.message;
        }
        
        // Try to manually set session from URL
        if (window.location.hash.includes('access_token')) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          
          if (accessToken && refreshToken) {
            info.tryingManualAuth = true;
            try {
              const { data, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });
              info.manualAuthError = error?.message;
              info.manualAuthSuccess = !!data.session;
            } catch (e: any) {
              info.manualAuthException = e.message;
            }
          }
        }
      } else {
        info.supabaseCreated = false;
      }
      
      setDebugInfo(info);
    };
    
    debug();
  }, []);
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">認証デバッグ情報</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
      <div className="mt-4">
        <a href="/" className="text-blue-600 hover:underline">← ホームに戻る</a>
      </div>
    </div>
  );
}