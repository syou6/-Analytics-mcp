'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TrendingUp, Target, Award, Users, Lightbulb, CheckCircle, Clock, XCircle, Star, GitFork } from 'lucide-react';

interface GrowthInsightsProps {
  analysis: any;
  activity: any;
  contributors: any;
  owner: string;
  repo: string;
}

export default function GrowthInsights({ analysis, activity, contributors, owner, repo }: GrowthInsightsProps) {
  const { language } = useLanguage();
  const [growthData, setGrowthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrowthData();
  }, [owner, repo]);

  async function fetchGrowthData() {
    try {
      const response = await fetch('/api/github/repo-growth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner, repo }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setGrowthData(data);
      }
    } catch (error) {
      console.error('Error fetching growth data:', error);
    } finally {
      setLoading(false);
    }
  }

  // Calculate skill progress based on real data
  const totalCommits = activity?.commits?.total || 0;
  const totalIssues = activity?.issues?.total || 0;
  const totalPRs = activity?.pullRequests?.total || 0;
  
  const commitQuality = Math.min(100, Math.round(
    ((totalCommits > 0 ? 50 : 0) + 
     (totalPRs > 0 ? 30 : 0) + 
     (totalIssues > 0 ? 20 : 0))
  ));
  
  const mainLanguage = analysis?.language || 'JavaScript';
  const languageLevel = Math.min(10, Math.floor(totalCommits / 10));
  
  const skillProgress = [
    { 
      skill: mainLanguage, 
      level: languageLevel, 
      progress: Math.min(100, languageLevel * 10),
      trend: totalCommits > 50 ? 'up' : 'stable'
    },
    { 
      skill: language === 'ja' ? 'コミット品質' : 'Commit Quality', 
      level: commitQuality, 
      progress: commitQuality,
      trend: commitQuality > 70 ? 'up' : 'stable'
    },
    { 
      skill: language === 'ja' ? 'コラボレーション' : 'Collaboration', 
      level: contributors?.length || 1, 
      progress: Math.min(100, (contributors?.length || 1) * 20),
      trend: contributors?.length > 3 ? 'up' : 'new'
    }
  ];

  const monthlyGoals = [
    { 
      goal: language === 'ja' ? '今月のコミット' : 'Monthly Commits',
      current: totalCommits,
      target: Math.max(30, totalCommits + 10),
      status: totalCommits > 20 ? 'in-progress' : 'not-started',
      icon: totalCommits > 20 ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />
    },
    { 
      goal: language === 'ja' ? 'Issue解決' : 'Issues Resolved',
      current: activity?.issues?.closed || 0,
      target: Math.max(5, (activity?.issues?.closed || 0) + 3),
      status: activity?.issues?.closed > 0 ? 'in-progress' : 'not-started',
      icon: activity?.issues?.closed > 0 ? <Clock className="h-4 w-4" /> : <XCircle className="h-4 w-4" />
    },
    { 
      goal: language === 'ja' ? 'PR作成' : 'Pull Requests',
      current: activity?.pullRequests?.total || 0,
      target: Math.max(5, (activity?.pullRequests?.total || 0) + 2),
      status: activity?.pullRequests?.total > 0 ? 'in-progress' : 'not-started',
      icon: activity?.pullRequests?.total > 0 ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />
    }
  ];

  // Generate insights based on real data
  const insights = [];
  
  // Commit frequency insight
  if (totalCommits < 10) {
    insights.push({
      type: 'warning',
      message: language === 'ja' 
        ? 'コミット頻度が低いです。定期的な開発を心がけましょう'
        : 'Low commit frequency. Try to maintain regular development'
    });
  } else if (totalCommits > 50) {
    insights.push({
      type: 'success',
      message: language === 'ja'
        ? '素晴らしいコミット頻度！この調子を維持しましょう'
        : 'Excellent commit frequency! Keep up the momentum'
    });
  }
  
  // Open issues insight
  if (analysis?.openIssues > 10) {
    insights.push({
      type: 'warning',
      message: language === 'ja'
        ? `${analysis.openIssues}個の未解決Issueがあります`
        : `${analysis.openIssues} open issues need attention`
    });
  }
  
  // Collaboration insight
  if (contributors?.length <= 1) {
    insights.push({
      type: 'info',
      message: language === 'ja'
        ? 'コラボレーターを増やすことを検討してください'
        : 'Consider inviting collaborators to your project'
    });
  } else if (contributors?.length > 5) {
    insights.push({
      type: 'success',
      message: language === 'ja'
        ? '活発なコラボレーションが行われています！'
        : 'Great collaborative effort!'
    });
  }
  
  // Star growth insight
  if (growthData?.stats?.stars?.trend > 0) {
    insights.push({
      type: 'success',
      message: language === 'ja'
        ? `スター数が増加中（+${growthData.stats.stars.weekly}今週）`
        : `Star count growing (+${growthData?.stats?.stars?.weekly || 0} this week)`
    });
  }

  return (
    <div className="space-y-6">
      {/* Skill Progress */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-bold text-black">
            {language === 'ja' ? 'スキル進歩' : 'Skill Progress'}
          </h3>
        </div>
        
        <div className="space-y-3">
          {skillProgress.map((skill, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-black">{skill.skill}</span>
                <div className="flex items-center">
                  {skill.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500 mr-1" />}
                  {skill.trend === 'new' && <Award className="h-3 w-3 text-purple-500 mr-1" />}
                  <span className="text-sm text-black">
                    {skill.level < 10 ? `Level ${skill.level}` : `${skill.level}/100`}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${skill.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Goals */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <Target className="h-5 w-5 text-green-600 mr-2" />
          <h3 className="text-lg font-bold text-black">
            {language === 'ja' ? '今月の目標' : 'Monthly Goals'}
          </h3>
        </div>
        
        <div className="space-y-3">
          {monthlyGoals.map((goal, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`mr-2 ${
                  goal.status === 'in-progress' ? 'text-yellow-500' :
                  goal.status === 'not-started' ? 'text-red-500' :
                  'text-green-500'
                }`}>
                  {goal.icon}
                </div>
                <span className="text-sm text-black">{goal.goal}</span>
              </div>
              <span className="text-sm font-medium text-black">
                {goal.current}/{goal.target}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
          <h3 className="text-lg font-bold text-black">
            {language === 'ja' ? '改善提案' : 'Improvement Suggestions'}
          </h3>
        </div>
        
        <div className="space-y-2">
          {insights.map((insight, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg text-sm ${
                insight.type === 'warning' ? 'bg-yellow-50 text-yellow-900' :
                insight.type === 'success' ? 'bg-green-50 text-green-900' :
                'bg-blue-50 text-blue-900'
              }`}
            >
              {insight.message}
            </div>
          ))}
        </div>
      </div>

      {/* Community Engagement */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <Users className="h-5 w-5 text-purple-600 mr-2" />
          <h3 className="text-lg font-bold text-black">
            {language === 'ja' ? 'コミュニティ関与' : 'Community Engagement'}
          </h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <p className="text-2xl font-bold text-black">
                {growthData?.stats?.stars?.total || analysis?.stars || 0}
              </p>
            </div>
            <p className="text-xs text-black">
              {language === 'ja' ? 'スター数' : 'Stars'}
              {growthData?.stats?.stars?.weekly > 0 && (
                <span className="text-green-600"> +{growthData.stats.stars.weekly}</span>
              )}
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <GitFork className="h-4 w-4 text-blue-500 mr-1" />
              <p className="text-2xl font-bold text-black">
                {growthData?.stats?.forks?.total || analysis?.forks || 0}
              </p>
            </div>
            <p className="text-xs text-black">
              {language === 'ja' ? 'フォーク' : 'Forks'}
              {growthData?.stats?.forks?.weekly > 0 && (
                <span className="text-green-600"> +{growthData.stats.forks.weekly}</span>
              )}
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-black">
              {activity?.issues?.total || 0}
            </p>
            <p className="text-xs text-black">
              {language === 'ja' ? 'Issue/PR' : 'Issues/PRs'}
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-black">
              {contributors?.length || 0}
            </p>
            <p className="text-xs text-black">
              {language === 'ja' ? '貢献者' : 'Contributors'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}