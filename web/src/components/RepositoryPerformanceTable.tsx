'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Star, GitCommit, Clock, TrendingUp, ExternalLink } from 'lucide-react';

interface RepoStats {
  name: string;
  fullName: string;
  language: string;
  monthlyCommits: number;
  stars: number;
  lastUpdate: string;
  trend: 'up' | 'down' | 'stable';
  url: string;
}

interface RepositoryPerformanceTableProps {
  userRepos?: any[];
}

export default function RepositoryPerformanceTable({ userRepos }: RepositoryPerformanceTableProps) {
  const { language } = useLanguage();
  const [repos, setRepos] = useState<RepoStats[]>([]);
  const [sortBy, setSortBy] = useState<'commits' | 'stars' | 'updated'>('commits');

  useEffect(() => {
    if (userRepos && userRepos.length > 0) {
      fetchRepoStats();
    }
  }, [userRepos]);

  async function fetchRepoStats() {
    if (!userRepos) return;
    const formattedRepos = await Promise.all(
      userRepos.slice(0, 10).map(async (repo) => {
        try {
          // Fetch actual commit stats for each repo
          const response = await fetch('/api/github/commits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              owner: repo.owner.login, 
              repo: repo.name, 
              days: 30 
            }),
          });
          
          const data = await response.json();
          const monthlyCommits = data.totalCommits || 0;
          
          // Determine trend based on recent activity
          const trend = monthlyCommits > 10 ? 'up' : monthlyCommits > 5 ? 'stable' : 'down';
          
          return {
            name: repo.name,
            fullName: repo.fullName,
            language: repo.language || 'N/A',
            monthlyCommits,
            stars: repo.stars || 0,
            lastUpdate: formatTimeAgo(new Date(repo.updatedAt)),
            trend: trend as 'up' | 'down' | 'stable',
            url: repo.url
          };
        } catch (error) {
          // Fallback for rate limiting or errors
          return {
            name: repo.name,
            fullName: repo.fullName,
            language: repo.language || 'N/A',
            monthlyCommits: 0,
            stars: repo.stars || 0,
            lastUpdate: formatTimeAgo(new Date(repo.updatedAt)),
            trend: 'stable' as 'stable',
            url: repo.url
          };
        }
      })
    );
    
    setRepos(formattedRepos);
  }

  function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return language === 'ja' ? '今日' : 'Today';
    if (days === 1) return language === 'ja' ? '昨日' : 'Yesterday';
    if (days < 7) return language === 'ja' ? `${days}日前` : `${days} days ago`;
    if (days < 30) return language === 'ja' ? `${Math.floor(days / 7)}週間前` : `${Math.floor(days / 7)} weeks ago`;
    return language === 'ja' ? `${Math.floor(days / 30)}ヶ月前` : `${Math.floor(days / 30)} months ago`;
  }

  function sortRepos(repos: RepoStats[]): RepoStats[] {
    const sorted = [...repos];
    switch (sortBy) {
      case 'commits':
        return sorted.sort((a, b) => b.monthlyCommits - a.monthlyCommits);
      case 'stars':
        return sorted.sort((a, b) => b.stars - a.stars);
      case 'updated':
        return sorted.sort((a, b) => {
          // Sort by last update (mock implementation)
          return 0;
        });
      default:
        return sorted;
    }
  }

  const sortedRepos = sortRepos(repos);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-black">
          {language === 'ja' ? 'リポジトリ別パフォーマンス' : 'Repository Performance'}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                {language === 'ja' ? 'リポジトリ名' : 'Repository'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                {language === 'ja' ? '言語' : 'Language'}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => setSortBy('commits')}
              >
                <div className="flex items-center">
                  <GitCommit className="h-4 w-4 mr-1" />
                  {language === 'ja' ? '今月のコミット' : 'Monthly Commits'}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => setSortBy('stars')}
              >
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  {language === 'ja' ? 'スター' : 'Stars'}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => setSortBy('updated')}
              >
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {language === 'ja' ? '最終更新' : 'Last Update'}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                {language === 'ja' ? 'トレンド' : 'Trend'}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedRepos.map((repo, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <a 
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-black hover:text-blue-600"
                  >
                    <span className="font-medium">{repo.name}</span>
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {repo.language}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {repo.monthlyCommits}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    {repo.stars}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {repo.lastUpdate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {repo.trend === 'up' && (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  )}
                  {repo.trend === 'down' && (
                    <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />
                  )}
                  {repo.trend === 'stable' && (
                    <div className="h-4 w-4 bg-gray-400 rounded-full" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}