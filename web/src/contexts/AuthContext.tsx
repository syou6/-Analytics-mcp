'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase-browser';

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
    const initAuth = async () => {
      const supabase = getSupabase();
      
      if (!supabase) {
        console.log('Supabase not available');
        setLoading(false);
        return;
      }

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
        } else {
          console.log('No initial session found');
        }
      } catch (error) {
        console.error('Error in initAuth:', error);
      } finally {
        setLoading(false);
      }

      // Set up auth state listener
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event: any, session: any) => {
          console.log('Auth state change:', event, session?.user?.email);
          
          if (session) {
            console.log('Auth state changed, user:', session.user);
            setUser(session.user);
          } else {
            setUser(null);
          }
        }
      );

      return () => {
        authListener?.subscription?.unsubscribe();
      };
    };

    initAuth();
  }, []);


  async function signOut() {
    try {
      const supabase = getSupabase();
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