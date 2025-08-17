'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function DebugPaymentPage() {
  const { user } = useAuth();
  const [debugData, setDebugData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    // Get session ID from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const sid = urlParams.get('session_id');
    if (sid) {
      setSessionId(sid);
    }
  }, []);

  async function runDebug() {
    if (!user) {
      alert('ログインしてください');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/debug-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId: sessionId || prompt('ストライプセッションIDを入力:'),
          userId: user.id 
        }),
      });
      const data = await response.json();
      setDebugData(data);
    } catch (error) {
      console.error('Debug error:', error);
      setDebugData({ error: error });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">決済デバッグツール</h1>
        
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">デバッグ情報</h2>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600">ユーザーID: {user?.id}</p>
            <p className="text-sm text-gray-600">メール: {user?.email}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ストライプセッションID:
            </label>
            <input
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="cs_test_..."
            />
          </div>

          <button
            onClick={runDebug}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
          >
            {loading ? 'デバッグ実行中...' : 'デバッグチェック実行'}
          </button>
        </div>

        {debugData && (
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">デバッグ結果</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
              {JSON.stringify(debugData, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6">
          <a href="/" className="text-blue-600 hover:underline">← ホームに戻る</a>
        </div>
      </div>
    </div>
  );
}