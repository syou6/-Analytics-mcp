'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function SubscriptionDebugPage() {
  const { user } = useAuth();
  const [debugData, setDebugData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDebugData();
    }
  }, [user]);

  async function fetchDebugData() {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/debug-subscription?userId=${user.id}`);
      const data = await response.json();
      setDebugData(data);
    } catch (error) {
      console.error('Error fetching debug data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function createManualSubscription() {
    if (!user) return;
    
    if (confirm('This will activate Pro subscription for your account. Continue?')) {
      setLoading(true);
      try {
        const response = await fetch('/api/debug-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });
        const data = await response.json();
        if (data.success) {
          alert('Pro subscription activated! Please go back to the home page.');
          window.location.href = '/';
        } else {
          alert(`Error: ${data.error}`);
        }
        fetchDebugData();
      } catch (error) {
        console.error('Error creating subscription:', error);
      } finally {
        setLoading(false);
      }
    }
  }

  async function checkStripeSession() {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    if (!sessionId) {
      alert('No session_id in URL. Complete a Stripe payment first.');
      return;
    }

    try {
      const response = await fetch('/api/check-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, userId: user?.id }),
      });
      const data = await response.json();
      alert(`Payment check: ${JSON.stringify(data, null, 2)}`);
      fetchDebugData();
    } catch (error) {
      console.error('Error checking payment:', error);
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please login first</h1>
          <a href="/" className="text-blue-600 hover:underline">Go to Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Subscription Debug</h1>
        
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Actions</h2>
          <div className="space-x-4">
            <button
              onClick={fetchDebugData}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Refresh Data
            </button>
            <button
              onClick={createManualSubscription}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
            >
              🚀 Activate Pro Subscription
            </button>
            <button
              onClick={checkStripeSession}
              disabled={loading}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Check Stripe Session
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Debug Data</h2>
          {loading ? (
            <div>Loading...</div>
          ) : debugData ? (
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(debugData, null, 2)}
            </pre>
          ) : (
            <div>No data yet</div>
          )}
        </div>

        <div className="mt-6">
          <a href="/" className="text-blue-600 hover:underline">← Back to Home</a>
        </div>
      </div>
    </div>
  );
}