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
    // Initialize auth
    const initAuth = async () => {
      if (!supabase) {
        console.log('Supabase client not initialized');
        setLoading(false);
        return;
      }

      // Wait a bit for Supabase to process the URL
      await new Promise(resolve => setTimeout(resolve, 100));

      try {
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
  }, []);


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