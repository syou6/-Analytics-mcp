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
    
    if (confirm('アカウントのProサブスクリプションを有効化します。続行しますか？')) {
      setLoading(true);
      try {
        const response = await fetch('/api/debug-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });
        const data = await response.json();
        if (data.success) {
          alert('Proサブスクリプションを有効化しました！ホームページにリダイレクトします...');
          // Force hard refresh to clear cache
          window.location.href = '/?refresh=' + Date.now();
        } else {
          alert(`エラー: ${data.error}`);
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
      alert('URLにsession_idがありません。先にストライプ決済を完了してください。');
      return;
    }

    try {
      const response = await fetch('/api/check-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, userId: user?.id }),
      });
      const data = await response.json();
      alert(`決済チェック: ${JSON.stringify(data, null, 2)}`);
      fetchDebugData();
    } catch (error) {
      console.error('Error checking payment:', error);
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">ログインしてください</h1>
          <a href="/" className="text-blue-600 hover:underline">ホームへ戻る</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">サブスクリプションデバッグ</h1>
        
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">アクション</h2>
          <div className="space-x-4">
            <button
              onClick={fetchDebugData}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              データ更新
            </button>
            <button
              onClick={createManualSubscription}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
            >
              🚀 Proサブスクリプションを有効化
            </button>
            <button
              onClick={checkStripeSession}
              disabled={loading}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              ストライプセッション確認
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">デバッグデータ</h2>
          {loading ? (
            <div>読み込み中...</div>
          ) : debugData ? (
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(debugData, null, 2)}
            </pre>
          ) : (
            <div>データがありません</div>
          )}
        </div>

        <div className="mt-6">
          <a href="/" className="text-blue-600 hover:underline">← ホームに戻る</a>
        </div>
      </div>
    </div>
  );
}