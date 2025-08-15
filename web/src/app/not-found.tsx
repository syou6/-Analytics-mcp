'use client';

import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-4">
            <span className="text-5xl font-bold">404</span>
          </div>
        </div>
        
        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          ページが見つかりません
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-opacity"
          >
            <Home className="w-5 h-5 mr-2" />
            ホームに戻る
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            前のページに戻る
          </button>
        </div>
        
        {/* Help Text */}
        <div className="mt-12 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            問題が続く場合は、
            <a href="mailto:support@gitvue.dev" className="text-blue-600 dark:text-blue-400 hover:underline">
              サポート
            </a>
            までお問い合わせください。
          </p>
        </div>
      </div>
    </div>
  );
}