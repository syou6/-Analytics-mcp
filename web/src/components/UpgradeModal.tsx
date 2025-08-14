'use client';

import { useState } from 'react';
import { X, Check, Sparkles, Zap, Shield, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/i18n';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userEmail: string;
}

export default function UpgradeModal({ isOpen, onClose, userId, userEmail }: UpgradeModalProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleUpgrade() {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, userEmail }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
    } finally {
      setLoading(false);
    }
  }

  const features = [
    { icon: <Zap className="h-5 w-5" />, text: language === 'ja' ? '月100回の分析' : '100 analyses per month' },
    { icon: <Sparkles className="h-5 w-5" />, text: language === 'ja' ? 'AI分析機能' : 'AI-powered insights' },
    { icon: <TrendingUp className="h-5 w-5" />, text: language === 'ja' ? '詳細な分析レポート' : 'Detailed analytics reports' },
    { icon: <Shield className="h-5 w-5" />, text: language === 'ja' ? '優先サポート' : 'Priority support' },
  ];

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">
            {language === 'ja' ? 'プロプランへアップグレード' : 'Upgrade to Pro'}
          </h2>
          <p className="text-black">
            {language === 'ja' ? '全機能を解放して、より深い分析を' : 'Unlock all features for deeper insights'}
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
          <div className="text-center mb-4">
            <span className="text-3xl font-bold text-black">¥980</span>
            <span className="text-black ml-1">/{language === 'ja' ? '月' : 'month'}</span>
          </div>
          
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <div className="text-blue-600 mr-3">{feature.icon}</div>
                <span className="text-black">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {language === 'ja' ? '処理中...' : 'Processing...'}
              </span>
            ) : (
              language === 'ja' ? '今すぐアップグレード' : 'Upgrade Now'
            )}
          </button>
          
          <button
            onClick={onClose}
            className="w-full text-black py-2 hover:text-gray-700 transition-colors"
          >
            {language === 'ja' ? '後で' : 'Maybe later'}
          </button>
        </div>

        <p className="text-xs text-center text-black mt-4">
          {language === 'ja' 
            ? 'いつでもキャンセル可能 • 安全な決済' 
            : 'Cancel anytime • Secure payment'}
        </p>
      </div>
    </div>
  );
}