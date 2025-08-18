'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Star, 
  GitCommit, 
  GitFork, 
  Eye,
  Calendar,
  TrendingUp, 
  TrendingDown,
  Minus,
  ExternalLink,
  Code,
  Users,
  Activity,
  AlertCircle
} from 'lucide-react';

interface RepoData {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  size: number;
  visibility: string;
  defaultBranch: string;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  url: string;
  homepage: string | null;
  topics: string[];
  license: { name: string } | null;
  // カスタムデータ
  monthlyCommits?: number;
  weeklyCommits?: number;
  contributors?: number;
  trend?: 'up' | 'down' | 'stable';
  activityScore?: number;
}

interface RepositoryPerformanceCardsProps {
  userRepos?: any[];
  username?: string;
}

export default function RepositoryPerformanceCards({ userRepos, username }: RepositoryPerformanceCardsProps) {
  const { language } = useLanguage();
  const [repos, setRepos] = useState<RepoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'popular'>('all');
  const [sortBy, setSortBy] = useState<'activity' | 'stars' | 'updated'>('activity');

  useEffect(() => {
    if (userRepos && userRepos.length > 0) {
      processRepoData();
    }
  }, [userRepos, sortBy, filter]);

  async function processRepoData() {
    setLoading(true);
    
    const processedRepos: RepoData[] = userRepos.map(repo => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name || repo.fullName,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count || repo.stars || 0,
      forks: repo.forks_count || repo.forks || 0,
      watchers: repo.watchers_count || repo.watchers || 0,
      openIssues: repo.open_issues_count || repo.openIssues || 0,
      size: repo.size || 0,
      visibility: repo.visibility || 'public',
      defaultBranch: repo.default_branch || 'main',
      createdAt: repo.created_at || repo.createdAt,
      updatedAt: repo.updated_at || repo.updatedAt,
      pushedAt: repo.pushed_at || repo.pushedAt,
      url: repo.html_url || repo.url,
      homepage: repo.homepage,
      topics: repo.topics || [],
      license: repo.license,
      // アクティビティスコアの計算
      activityScore: calculateActivityScore(repo),
      trend: calculateTrend(repo),
    }));

    // フィルタリング
    let filteredRepos = processedRepos;
    if (filter === 'active') {
      filteredRepos = processedRepos.filter(repo => {
        const daysSinceUpdate = getDaysSince(repo.pushedAt);
        return daysSinceUpdate < 30;
      });
    } else if (filter === 'popular') {
      filteredRepos = processedRepos.filter(repo => repo.stars > 0 || repo.forks > 0);
    }

    // ソート
    filteredRepos.sort((a, b) => {
      switch (sortBy) {
        case 'activity':
          return (b.activityScore || 0) - (a.activityScore || 0);
        case 'stars':
          return b.stars - a.stars;
        case 'updated':
          return new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime();
        default:
          return 0;
      }
    });

    setRepos(filteredRepos);
    setLoading(false);
  }

  function calculateActivityScore(repo: any): number {
    const daysSinceUpdate = getDaysSince(repo.pushed_at || repo.pushedAt);
    const daysSinceCreation = getDaysSince(repo.created_at || repo.createdAt);
    
    let score = 0;
    
    // 最近の更新
    if (daysSinceUpdate < 7) score += 30;
    else if (daysSinceUpdate < 30) score += 20;
    else if (daysSinceUpdate < 90) score += 10;
    
    // スター数
    score += Math.min(repo.stargazers_count || repo.stars || 0, 50);
    
    // フォーク数
    score += Math.min((repo.forks_count || repo.forks || 0) * 2, 20);
    
    // イシュー数（活発な議論）
    if (repo.open_issues_count > 0) score += 10;
    
    // リポジトリの年齢ボーナス（長期メンテナンス）
    if (daysSinceCreation > 365 && daysSinceUpdate < 90) score += 15;
    
    return score;
  }

  function calculateTrend(repo: any): 'up' | 'down' | 'stable' {
    const daysSinceUpdate = getDaysSince(repo.pushed_at || repo.pushedAt);
    
    if (daysSinceUpdate < 7) return 'up';
    if (daysSinceUpdate > 60) return 'down';
    return 'stable';
  }

  function getDaysSince(dateString: string): number {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const days = getDaysSince(dateString);
    
    if (days === 0) return language === 'ja' ? '今日' : 'Today';
    if (days === 1) return language === 'ja' ? '昨日' : 'Yesterday';
    if (days < 7) return language === 'ja' ? `${days}日前` : `${days}d ago`;
    if (days < 30) return language === 'ja' ? `${Math.floor(days / 7)}週間前` : `${Math.floor(days / 7)}w ago`;
    if (days < 365) return language === 'ja' ? `${Math.floor(days / 30)}ヶ月前` : `${Math.floor(days / 30)}mo ago`;
    return language === 'ja' ? `${Math.floor(days / 365)}年前` : `${Math.floor(days / 365)}y ago`;
  }

  function formatSize(kb: number): string {
    if (kb < 1024) return `${kb} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  }

  function getLanguageColor(lang: string | null): string {
    const colors: { [key: string]: string } = {
      'JavaScript': 'bg-yellow-400',
      'TypeScript': 'bg-blue-600',
      'Python': 'bg-blue-500',
      'Java': 'bg-orange-500',
      'Go': 'bg-cyan-500',
      'Rust': 'bg-orange-700',
      'Ruby': 'bg-red-600',
      'PHP': 'bg-purple-500',
      'C++': 'bg-pink-600',
      'C': 'bg-gray-600',
      'C#': 'bg-green-600',
      'Swift': 'bg-orange-400',
      'Kotlin': 'bg-purple-600',
      'Dart': 'bg-cyan-600',
      'Vue': 'bg-green-500',
      'HTML': 'bg-red-500',
      'CSS': 'bg-blue-500',
      'Shell': 'bg-gray-700',
    };
    
    return colors[lang || ''] || 'bg-gray-400';
  }

  function getTrendIcon(trend: 'up' | 'down' | 'stable' | undefined) {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  }

  function getActivityBadge(score: number | undefined) {
    if (!score) return null;
    
    if (score >= 70) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          {language === 'ja' ? '非常に活発' : 'Very Active'}
        </span>
      );
    }
    if (score >= 40) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          {language === 'ja' ? '活発' : 'Active'}
        </span>
      );
    }
    if (score >= 20) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
          {language === 'ja' ? '普通' : 'Moderate'}
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
        {language === 'ja' ? '低活動' : 'Low Activity'}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      {/* ヘッダー */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {language === 'ja' ? 'リポジトリ分析' : 'Repository Analysis'}
          </h2>
          
          <div className="flex flex-wrap gap-2">
            {/* フィルター */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{language === 'ja' ? 'すべて' : 'All'}</option>
              <option value="active">{language === 'ja' ? 'アクティブ' : 'Active'}</option>
              <option value="popular">{language === 'ja' ? '人気' : 'Popular'}</option>
            </select>
            
            {/* ソート */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="activity">{language === 'ja' ? '活動度順' : 'Activity'}</option>
              <option value="stars">{language === 'ja' ? 'スター順' : 'Stars'}</option>
              <option value="updated">{language === 'ja' ? '更新順' : 'Updated'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* リポジトリカード */}
      <div className="p-6">
        {repos.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'ja' ? 'リポジトリが見つかりません' : 'No repositories found'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((repo) => (
              <div
                key={repo.id}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
              >
                {/* リポジトリヘッダー */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate"
                    >
                      {repo.name}
                      <ExternalLink className="h-4 w-4 flex-shrink-0" />
                    </a>
                    <div className="flex items-center gap-2 mt-1">
                      {repo.language && (
                        <span className="flex items-center gap-1">
                          <span className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`} />
                          <span className="text-xs text-gray-600 dark:text-gray-400">{repo.language}</span>
                        </span>
                      )}
                      {repo.visibility === 'private' && (
                        <span className="px-2 py-0.5 text-xs bg-gray-600 text-white rounded">
                          Private
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(repo.trend)}
                    {getActivityBadge(repo.activityScore)}
                  </div>
                </div>

                {/* 説明 */}
                {repo.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {repo.description}
                  </p>
                )}

                {/* 統計情報 */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {repo.stars}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {language === 'ja' ? 'スター' : 'Stars'}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <GitFork className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {repo.forks}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {language === 'ja' ? 'フォーク' : 'Forks'}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Eye className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {repo.watchers}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {language === 'ja' ? '監視' : 'Watch'}
                    </p>
                  </div>
                </div>

                {/* メタ情報 */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(repo.pushedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {repo.openIssues > 0 && (
                      <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <AlertCircle className="h-3 w-3" />
                        {repo.openIssues}
                      </span>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatSize(repo.size)}
                    </span>
                  </div>
                </div>

                {/* トピックス */}
                {repo.topics && repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {repo.topics.slice(0, 3).map((topic, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded"
                      >
                        {topic}
                      </span>
                    ))}
                    {repo.topics.length > 3 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{repo.topics.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* サマリー */}
      {repos.length > 0 && (
        <div className="px-6 pb-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {language === 'ja' ? '総リポジトリ数' : 'Total Repos'}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {repos.length}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {language === 'ja' ? '総スター数' : 'Total Stars'}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {repos.reduce((sum, r) => sum + r.stars, 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {language === 'ja' ? '総フォーク数' : 'Total Forks'}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {repos.reduce((sum, r) => sum + r.forks, 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {language === 'ja' ? 'アクティブ率' : 'Active Rate'}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round((repos.filter(r => r.trend === 'up').length / repos.length) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}