'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

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
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    // Initialize Supabase client on client side only
    if (typeof window !== 'undefined') {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseAnonKey) {
        const client = createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
            storage: window.localStorage,
            storageKey: 'sb-auth-token'
          }
        });
        setSupabase(client);
      }
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;
    
    // Initialize auth
    const initAuth = async () => {

      // Wait for Supabase to process the URL tokens
      await new Promise(resolve => setTimeout(resolve, 500));

      try {
        // First, check if there are tokens in the URL
        if (window.location.hash && window.location.hash.includes('access_token')) {
          console.log('Found tokens in URL, waiting for Supabase to process...');
          // Give Supabase more time to process the tokens
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }
        
        if (session) {
          console.log('Initial session found:', session.user);
          setUser(session.user);
          setLoading(false);
        } else {
          console.log('No initial session found');
          // Try to get user one more time
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          if (currentUser) {
            console.log('User found on second try:', currentUser);
            setUser(currentUser);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in initAuth:', error);
        setLoading(false);
      }
    };

    initAuth();

    // Set up auth state listener
    const { data: authListener } = supabase?.auth?.onAuthStateChange(
      async (event: any, session: any) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session) {
          console.log('User signed in, setting user:', session.user);
          setUser(session.user);
          setLoading(false);
          // Clean URL after sign in
          if (window.location.hash) {
            window.history.replaceState(null, '', window.location.pathname);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
        } else if (session) {
          setUser(session.user);
          setLoading(false);
        }
      }
    ) || { data: null };

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);


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