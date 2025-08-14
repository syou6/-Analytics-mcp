'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function CleanupPage() {
  const { user } = useAuth();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function runCleanup() {
    if (!user) {
      alert('Please login first');
      return;
    }

    if (!confirm('This will remove duplicate subscriptions. Continue?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/cleanup-subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await response.json();
      setResult(data);
      
      if (data.success) {
        alert(`Cleanup successful! Deleted ${data.deletedCount} duplicate subscriptions.`);
      }
    } catch (error) {
      console.error('Cleanup error:', error);
      setResult({ error: 'Cleanup failed' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Subscription Cleanup Tool</h1>
        
        <div className="bg-white rounded-lg p-6 mb-6">
          <p className="mb-4">
            This tool will clean up duplicate subscription records and keep only the valid one.
          </p>
          
          <button
            onClick={runCleanup}
            disabled={loading || !user}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold disabled:opacity-50"
          >
            {loading ? 'Running Cleanup...' : 'Run Cleanup'}
          </button>
        </div>

        {result && (
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Result</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6">
          <a href="/" className="text-blue-600 hover:underline">← Back to Home</a>
        </div>
      </div>
    </div>
  );
}