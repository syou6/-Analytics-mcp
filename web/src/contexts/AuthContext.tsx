'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: any;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle initial session
    const handleInitialSession = async () => {
      // First try to get session from URL
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      
      if (accessToken) {
        console.log('Found access token in URL, setting session...');
        // Let Supabase handle the token
        const { data: { user }, error } = await supabase.auth.getUser(accessToken);
        if (user) {
          console.log('Session set from URL token:', user);
          setUser(user);
          setLoading(false);
          // Clean URL
          window.history.replaceState(null, '', window.location.pathname);
          return;
        }
      }
      
      // Otherwise check existing session
      checkSession();
    };

    handleInitialSession();

    // Set up auth state listener
    const { data: authListener } = supabase?.auth?.onAuthStateChange(
      async (event: any, session: any) => {
        console.log('Auth event:', event, session);
        
        if (session) {
          setUser(session.user);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
        }
      }
    ) || { data: null };

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  async function checkSession() {
    try {
      if (!supabase) {
        console.log('Supabase client not initialized');
        setLoading(false);
        return;
      }

      console.log('Checking session...');
      
      // Get session from Supabase  
      const { data: { session }, error } = await supabase.auth.getSession();
      
      console.log('Session result:', session, error);
      
      if (error) {
        console.error('Session error:', error);
      }
      
      if (session) {
        console.log('Session found, setting user:', session.user);
        setUser(session.user);
        setLoading(false);
      } else {
        console.log('No session found');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking session:', error);
      setLoading(false);
    }
  }

  async function signOut() {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);