'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function ForceProPage() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Force set Pro status in localStorage
      const proData = {
        isPro: true,
        analysesRemaining: 100,
        aiAnalysesRemaining: 100,
        subscription: {
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        usage: {
          analyses: 0,
          aiAnalyses: 0,
        },
        limits: {
          analyses: 100,
          aiAnalyses: 100,
        }
      };
      
      // Store in localStorage to persist
      localStorage.setItem('force_pro_status', JSON.stringify(proData));
      
      alert('Pro status forced! Redirecting to home...');
      window.location.href = '/?forcePro=true';
    }
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Forcing Pro Status...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    </div>
  );
}