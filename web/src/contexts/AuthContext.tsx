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
    // Debug: Check URL on mount
    console.log('Current URL:', window.location.href);
    console.log('Hash:', window.location.hash);
    
    // Check for session on mount
    checkSession();

    // Set up auth state listener
    const { data: authListener } = supabase?.auth?.onAuthStateChange(
      async (event: any, session: any) => {
        console.log('Auth event:', event, session);
        
        if (session) {
          setUser(session.user);
          setLoading(false);
          // Clean up URL by removing hash
          setTimeout(() => {
            if (window.location.hash) {
              window.history.replaceState(null, '', window.location.pathname);
            }
          }, 100);
        } else {
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