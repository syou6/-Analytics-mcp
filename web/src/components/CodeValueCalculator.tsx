'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DollarSign, TrendingUp, Code, GitBranch, Star, Calendar } from 'lucide-react';

interface CodeValueData {
  totalValue: number;
  totalValueFormatted: string;
  totalLines: number;
  repositories: {
    name: string;
    fullName: string;
    description?: string;
    language?: string;
    estimatedLines: number;
    stars: number;
    value: number;
    valueFormatted: string;
    url: string;
  }[];
  insights: string[];
  ossValue: {
    total: number;
    formatted: string;
    message: string;
  };
  potentialEarnings: {
    hourly: { rate: number; formatted: string; description: string };
    monthly: { rate: number; formatted: string; description: string };
    project: { rate: number; formatted: string; description: string };
    freelance: { rate: number; formatted: string; description: string };
  };
  breakdown: {
    byLanguage: {
      language: string;
      value: number;
      valueFormatted: string;
      lines: number;
      repos: number;
      percentage: number;
    }[];
    byYear: {
      year: number;
      value: number;
      valueFormatted: string;
      repos: number;
    }[];
    byType: {
      public: { value: number; formatted: string; count: number };
      private: { value: number; formatted: string; count: number };
    };
  };
}

export default function CodeValueCalculator({ username }: { username: string }) {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CodeValueData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const calculateValue = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/code-value', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to calculate code value');
      }
      
      const result = await response.json();
      setData(result);
      setShowDetails(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="h-5 sm:h-6 w-5 sm:w-6 text-green-600" />
            <span className="line-clamp-1">
              {language === 'ja' ? 'コード資産価値計算' : 'Code Asset Value Calculator'}
            </span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            {language === 'ja' 
              ? 'あなたのコードを外注した場合の価値を計算します'
              : 'Calculate what your code would cost if outsourced'}
          </p>
        </div>
        
        {!showDetails && (
          <button
            onClick={calculateValue}
            disabled={loading}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 sm:h-5 w-4 sm:w-5 border-b-2 border-white"></div>
                <span className="text-sm sm:text-base">{language === 'ja' ? '計算中...' : 'Calculating...'}</span>
              </>
            ) : (
              <>
                <TrendingUp className="h-4 sm:h-5 w-4 sm:w-5" />
                <span className="text-sm sm:text-base">{language === 'ja' ? '価値を計算' : 'Calculate Value'}</span>
              </>
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {data && showDetails && (
        <div className="space-y-6">
          {/* Main Value Display */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 sm:p-8 text-center">
            <p className="text-sm sm:text-base text-gray-600 mb-2">
              {language === 'ja' ? 'あなたのコードの総価値' : 'Your Total Code Value'}
            </p>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 break-words">
              {data.totalValueFormatted}
            </div>
            <p className="text-base sm:text-lg text-gray-600">
              {formatNumber(data.totalLines)} {language === 'ja' ? '行のコード' : 'lines of code'}
            </p>
          </div>

          {/* OSS Contribution Value */}
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  {language === 'ja' ? 'オープンソース貢献価値' : 'Open Source Contribution Value'}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 break-all">
                  {data.ossValue.formatted}
                </p>
              </div>
              <GitBranch className="h-8 sm:h-10 lg:h-12 w-8 sm:w-10 lg:w-12 text-blue-600" />
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">{data.ossValue.message}</p>
          </div>

          {/* Potential Earnings */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              {language === 'ja' ? '潜在的な収益' : 'Potential Earnings'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {Object.entries(data.potentialEarnings).map(([key, value]) => (
                <div key={key} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 capitalize">{key}</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1 break-words">{value.formatted}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              {language === 'ja' ? 'インサイト' : 'Insights'}
            </h3>
            <ul className="space-y-2">
              {data.insights.map((insight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Star className="h-4 sm:h-5 w-4 sm:w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700">{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Language Breakdown */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              {language === 'ja' ? '言語別内訳' : 'Breakdown by Language'}
            </h3>
            <div className="space-y-3">
              {data.breakdown.byLanguage.slice(0, 5).map((lang) => (
                <div key={lang.language} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Code className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400" />
                    <span className="text-sm sm:text-base font-medium text-gray-900">{lang.language}</span>
                    <span className="text-xs sm:text-sm text-gray-500">
                      ({lang.repos} {language === 'ja' ? 'リポジトリ' : 'repos'})
                    </span>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 ml-auto">
                    <div className="w-24 sm:w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                        style={{ width: `${lang.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-gray-900 min-w-[80px] text-right">
                      {lang.valueFormatted.split(' ')[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Repositories */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              {language === 'ja' ? '最も価値の高いリポジトリ' : 'Most Valuable Repositories'}
            </h3>
            <div className="space-y-3">
              {data.repositories.slice(0, 5).map((repo) => (
                <div key={repo.name} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-3">
                      <a 
                        href={repo.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-base font-medium text-blue-600 hover:text-blue-800 inline-flex items-center gap-2 flex-1 min-w-0"
                      >
                        <span className="truncate">{repo.name}</span>
                        <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                      <p className="text-lg font-bold text-gray-900 flex-shrink-0">
                        {repo.valueFormatted.split(' ')[0]}
                      </p>
                    </div>
                    {repo.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{repo.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                      {repo.language && (
                        <span className="flex items-center gap-1">
                          <Code className="h-4 w-4" />
                          {repo.language}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        {repo.stars}
                      </span>
                      <span>{formatNumber(repo.estimatedLines)} lines</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Yearly Trend */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              {language === 'ja' ? '年別価値推移' : 'Value by Year'}
            </h3>
            <div className="space-y-2">
              {data.breakdown.byYear.slice(0, 5).map((year) => (
                <div key={year.year} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-base font-medium text-gray-900">{year.year}</span>
                    <span className="text-sm text-gray-500">
                      ({year.repos} {language === 'ja' ? 'リポジトリ' : 'repos'})
                    </span>
                  </div>
                  <span className="text-base font-semibold text-gray-900">
                    {year.valueFormatted.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recalculate Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={() => {
                setShowDetails(false);
                setData(null);
              }}
              className="px-4 sm:px-6 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-900 font-medium"
            >
              {language === 'ja' ? '閉じる' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}