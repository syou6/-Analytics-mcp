'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function CleanupPage() {
  const { user } = useAuth();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function runCleanup() {
    if (!user) {
      alert('ログインしてください');
      return;
    }

    if (!confirm('重複したサブスクリプションを削除します。続行しますか？')) {
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
        alert(`クリーンアップ成功！${data.deletedCount}件の重複サブスクリプションを削除しました。`);
      }
    } catch (error) {
      console.error('Cleanup error:', error);
      setResult({ error: 'クリーンアップに失敗しました' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">サブスクリプションクリーンアップツール</h1>
        
        <div className="bg-white rounded-lg p-6 mb-6">
          <p className="mb-4">
            このツールは重複したサブスクリプションレコードをクリーンアップし、有効なもののみを保持します。
          </p>
          
          <button
            onClick={runCleanup}
            disabled={loading || !user}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold disabled:opacity-50"
          >
            {loading ? 'クリーンアップ実行中...' : 'クリーンアップ実行'}
          </button>
        </div>

        {result && (
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">結果</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
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