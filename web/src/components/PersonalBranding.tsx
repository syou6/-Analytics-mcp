'use client';

import { useState, useEffect } from 'react';
import { User, TrendingUp, Star, Users, GitPullRequest, Award, Globe, Twitter, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAnalysis } from '@/contexts/AnalysisContext';

interface PersonalBrandingProps {
  isDark?: boolean;
  language?: 'en' | 'ja';
}

export default function PersonalBranding({ isDark = false, language = 'en' }: PersonalBrandingProps) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState('');
  const { brandingAnalysis, setBrandingAnalysis, isDataStale } = useAnalysis();

  // キャッシュされたデータがあれば復元
  useEffect(() => {
    if (brandingAnalysis && !isDataStale(brandingAnalysis.timestamp)) {
      setUsername(brandingAnalysis.username);
      setAnalysis(brandingAnalysis);
    }
  }, []);

  const analyzeBranding = async () => {
    if (!username) return;

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/personal-branding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze');
      }

      const analysisData = {
        ...data,
        username,
        timestamp: Date.now()
      };
      setAnalysis(analysisData);
      setBrandingAnalysis(analysisData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };

  return (
    <div className={`rounded-lg shadow-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          <Sparkles className="w-6 h-6 mr-2 text-purple-600" />
          {language === 'en' ? 'Personal Branding Analysis' : '個人ブランディング分析'}
        </h2>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {language === 'en' 
            ? 'Analyze your GitHub presence and developer brand strength'
            : 'GitHubプレゼンスと開発者ブランドの強さを分析'}
        </p>
      </div>

      {/* Input Section */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={language === 'en' ? 'Enter GitHub username' : 'GitHubユーザー名を入力'}
          className={`flex-1 px-4 py-2 rounded-lg border ${
            isDark 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-purple-600`}
        />
        <button
          onClick={analyzeBranding}
          disabled={loading || !username}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
        >
          {loading 
            ? (language === 'en' ? 'Analyzing...' : '分析中...') 
            : (language === 'en' ? 'Analyze' : '分析')}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Profile Header */}
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold flex items-center text-indigo-600">
                  <User className="w-5 h-5 mr-2" />
                  {analysis.profile.name || analysis.profile.username}
                </h3>
                <p className={`text-sm ${isDark ? 'text-blue-400' : 'text-blue-600'} mt-1 font-medium`}>
                  @{analysis.profile.username}
                </p>
                {analysis.profile.bio && (
                  <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {analysis.profile.bio}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-3 text-sm">
                  {analysis.profile.location && (
                    <span className="flex items-center text-gray-700">
                      <Globe className="w-4 h-4 mr-1 text-green-500" />
                      {analysis.profile.location}
                    </span>
                  )}
                  {analysis.profile.company && (
                    <span className="flex items-center text-gray-700">
                      <Award className="w-4 h-4 mr-1 text-orange-500" />
                      {analysis.profile.company}
                    </span>
                  )}
                  {analysis.profile.twitterUsername && (
                    <span className="flex items-center text-gray-700">
                      <Twitter className="w-4 h-4 mr-1 text-blue-400" />
                      @{analysis.profile.twitterUsername}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 font-medium mb-1">
                  {language === 'en' ? 'Brand Score' : 'ブランドスコア'}
                </div>
                <div className={`text-4xl font-bold ${getScoreColor(analysis.scores.brandStrength)}`}>
                  {getScoreGrade(analysis.scores.brandStrength)}
                </div>
                <div className="text-lg font-semibold text-gray-600">
                  {analysis.scores.brandStrength}/100
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-2xl font-bold">{(analysis.profile.followers || 0).toLocaleString()}</span>
              </div>
              <div className="text-sm text-blue-600 font-medium">{language === 'en' ? 'Followers' : 'フォロワー'}</div>
            </div>
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-2xl font-bold">{(analysis.metrics.totalStars || 0).toLocaleString()}</span>
              </div>
              <div className="text-sm text-yellow-600 font-medium">{language === 'en' ? 'Total Stars' : '総スター数'}</div>
            </div>
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <GitPullRequest className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold">{(analysis.metrics.totalPullRequests || 0).toLocaleString()}</span>
              </div>
              <div className="text-sm text-green-600 font-medium">{language === 'en' ? 'Pull Requests' : 'プルリクエスト'}</div>
            </div>
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="text-2xl font-bold">{(analysis.metrics.totalContributions || 0).toLocaleString()}</span>
              </div>
              <div className="text-sm text-purple-600 font-medium">{language === 'en' ? 'Contributions' : 'コントリビューション'}</div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h4 className="font-semibold mb-4 text-indigo-600">
              {language === 'en' ? 'Brand Strength Breakdown' : 'ブランド強度の内訳'}
            </h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-purple-700 font-medium">{language === 'en' ? 'Influence Score' : '影響力スコア'}</span>
                  <span className="text-purple-600 font-bold">{analysis.scores.influence}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                    style={{ width: `${analysis.scores.influence}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-green-700 font-medium">{language === 'en' ? 'Activity Score' : '活動スコア'}</span>
                  <span className="text-green-600 font-bold">{analysis.scores.activity}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-600 to-teal-600 h-2 rounded-full"
                    style={{ width: `${analysis.scores.activity}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-orange-700 font-medium">{language === 'en' ? 'Expertise Level' : '専門知識レベル'}</span>
                  <span className="text-orange-600 font-bold">{analysis.scores.expertiseLevel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Languages */}
          {analysis.topLanguages && analysis.topLanguages.length > 0 && (
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h4 className="font-semibold mb-3 text-blue-600">
                {language === 'en' ? 'Top Languages' : 'トップ言語'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.topLanguages.map((lang: any) => (
                  <span 
                    key={lang.language}
                    className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 font-medium rounded-full text-sm shadow-sm"
                  >
                    {lang.language} ({lang.count})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gradient-to-r from-purple-900 to-blue-900' : 'bg-gradient-to-r from-purple-50 to-blue-50'}`}>
              <h4 className="font-semibold mb-3 text-purple-600">
                {language === 'en' ? 'Recommendations to Improve Your Brand' : 'ブランド改善のための推奨事項'}
              </h4>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-purple-500">•</span>
                    <span className="text-sm text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Community Impact */}
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h4 className="font-semibold mb-3 text-teal-600">
              {language === 'en' ? 'Community Impact' : 'コミュニティへの影響'}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="font-bold text-teal-600">{analysis.communityImpact.organizations}</span>
                <span className="ml-2 text-gray-600 font-medium">
                  {language === 'en' ? 'Organizations' : '組織'}
                </span>
              </div>
              <div>
                <span className="font-bold text-indigo-600">{analysis.communityImpact.gists}</span>
                <span className="ml-2 text-gray-600 font-medium">
                  {language === 'en' ? 'Gists' : 'Gist'}
                </span>
              </div>
              <div>
                <span className="font-bold text-pink-600">{analysis.communityImpact.sponsorships}</span>
                <span className="ml-2 text-gray-600 font-medium">
                  {language === 'en' ? 'Sponsorships' : 'スポンサーシップ'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}