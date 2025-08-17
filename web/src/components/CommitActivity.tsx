'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, GitCommit, TrendingUp, Clock, Award } from 'lucide-react';

interface CommitStats {
  totalCommits: number;
  reposAnalyzed: number;
  repoCommitCounts: Record<string, number>;
  statistics: {
    dailyAverage: number;
    weeklyAverage: number;
    monthlyTotal: number;
    mostActiveDay: string;
    mostActiveHour: number;
    commitsByDayOfWeek: number[];
    commitsByHour: number[];
    commitsByMonth: Record<string, number>;
    streakData: {
      currentStreak: number;
      longestStreak: number;
    };
    heatmap: Record<string, number>;
  };
}

export default function CommitActivity({ username }: { username: string }) {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<CommitStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(365);

  const fetchCommitData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/github/commits-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, days }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      } else {
        setError(result.error || '取得に失敗しました');
      }
    } catch (err) {
      setError('データの取得中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchCommitData();
    }
  }, [username, days]);

  const generateHeatmapData = () => {
    if (!stats) return [];
    
    const today = new Date();
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      data.push({
        date: dateStr,
        count: stats.statistics.heatmap[dateStr] || 0,
        day: date.getDay(),
      });
    }
    
    return data;
  };

  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (count <= 2) return 'bg-green-200';
    if (count <= 5) return 'bg-green-400';
    if (count <= 10) return 'bg-green-600';
    return 'bg-green-800';
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={fetchCommitData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const dayNames = language === 'ja' 
    ? ['日', '月', '火', '水', '木', '金', '土']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <GitCommit className="h-6 w-6 text-blue-600" />
          {language === 'ja' ? 'コミット活動' : 'Commit Activity'}
        </h2>
        
        <div className="flex items-center gap-2">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
          >
            <option value={30}>30日</option>
            <option value={90}>90日</option>
            <option value={180}>180日</option>
            <option value={365}>1年</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'ja' ? '総コミット数' : 'Total Commits'}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalCommits.toLocaleString()}
              </p>
            </div>
            <GitCommit className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'ja' ? '現在のストリーク' : 'Current Streak'}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.statistics.streakData.currentStreak} {language === 'ja' ? '日' : 'days'}
              </p>
            </div>
            <Award className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'ja' ? '日平均' : 'Daily Average'}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.statistics.dailyAverage.toFixed(1)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'ja' ? '最長ストリーク' : 'Longest Streak'}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.statistics.streakData.longestStreak} {language === 'ja' ? '日' : 'days'}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          {language === 'ja' ? 'コントリビューションヒートマップ' : 'Contribution Heatmap'}
        </h3>
        <div className="overflow-x-auto">
          <div className="inline-block">
            <div className="grid grid-cols-53 gap-1" style={{ gridTemplateColumns: 'repeat(53, minmax(0, 1fr))' }}>
              {generateHeatmapData().reduce((weeks, day, index) => {
                const weekIndex = Math.floor(index / 7);
                if (!weeks[weekIndex]) weeks[weekIndex] = [];
                weeks[weekIndex].push(day);
                return weeks;
              }, [] as any[]).map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-rows-7 gap-1">
                  {week.map((day: any, dayIndex: number) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-3 h-3 rounded-sm ${getIntensityClass(day.count)} hover:ring-2 hover:ring-blue-400 cursor-pointer`}
                      title={`${day.date}: ${day.count} commits`}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-600 dark:text-gray-400">
              <span>{language === 'ja' ? '少' : 'Less'}</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-800 rounded-sm"></div>
              </div>
              <span>{language === 'ja' ? '多' : 'More'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity by Day and Hour */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* By Day of Week */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            {language === 'ja' ? '曜日別活動' : 'Activity by Day'}
          </h3>
          <div className="space-y-2">
            {stats.statistics.commitsByDayOfWeek.map((count, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-sm w-8 text-gray-600 dark:text-gray-400">
                  {dayNames[index]}
                </span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-end pr-2"
                    style={{ 
                      width: `${(count / Math.max(...stats.statistics.commitsByDayOfWeek)) * 100}%`,
                      minWidth: count > 0 ? '30px' : '0'
                    }}
                  >
                    <span className="text-xs text-white font-medium">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Hour */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            {language === 'ja' ? '時間帯別活動' : 'Activity by Hour'}
          </h3>
          <div className="h-32">
            <div className="flex items-end justify-between h-full gap-1">
              {stats.statistics.commitsByHour.map((count, hour) => (
                <div 
                  key={hour} 
                  className="flex-1 flex flex-col items-center justify-end"
                >
                  <div 
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t hover:from-blue-700 hover:to-blue-500 transition-colors"
                    style={{ 
                      height: `${(count / Math.max(...stats.statistics.commitsByHour)) * 100}%`,
                      minHeight: count > 0 ? '4px' : '0'
                    }}
                    title={`${hour}:00 - ${count} commits`}
                  />
                  {hour % 3 === 0 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {hour}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'ja' 
                ? `最も活発な時間: ${stats.statistics.mostActiveHour}時`
                : `Most active at ${stats.statistics.mostActiveHour}:00`}
            </p>
          </div>
        </div>
      </div>

      {/* Top Repositories */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          {language === 'ja' ? 'リポジトリ別コミット数' : 'Commits by Repository'}
        </h3>
        <div className="space-y-2">
          {Object.entries(stats.repoCommitCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([repo, count]) => (
              <div key={repo} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {repo.split('/')[1]}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {count} commits
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}