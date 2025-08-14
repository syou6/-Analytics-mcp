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

      // Wait for Supabase to initialize
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
        // Check if there are tokens in the URL first
        if (window.location.hash && window.location.hash.includes('access_token')) {
          console.log('Found tokens in URL, attempting manual session set...');
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          
          if (accessToken && refreshToken) {
            try {
              const { data, error: setError } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });
              
              if (setError) {
                console.error('Error setting session:', setError);
              } else if (data.session) {
                console.log('Session set successfully:', data.session.user);
                setUser(data.session.user);
                setLoading(false);
                // Clean URL
                window.history.replaceState(null, '', window.location.pathname);
                return;
              }
            } catch (e) {
              console.error('Exception setting session:', e);
            }
          }
        }
        
        // Otherwise try to get existing session
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