'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: 'NONE' | 'FIRST_QUARTILE' | 'SECOND_QUARTILE' | 'THIRD_QUARTILE' | 'FOURTH_QUARTILE';
}

interface GitHubGrassProps {
  username: string;
  year?: number;
}

export default function GitHubGrass({ username, year }: GitHubGrassProps) {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const currentYear = year || new Date().getFullYear();

  useEffect(() => {
    fetchContributions();
  }, [username, currentYear]);

  const fetchContributions = async () => {
    setLoading(true);
    setError(null);

    try {
      // GitHub GraphQL APIを使用してコントリビューションデータを取得
      const query = `
        query($username: String!, $from: DateTime!, $to: DateTime!) {
          user(login: $username) {
            contributionsCollection(from: $from, to: $to) {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    date
                    contributionCount
                    contributionLevel
                  }
                }
              }
            }
          }
        }
      `;

      const variables = {
        username,
        from: `${currentYear}-01-01T00:00:00Z`,
        to: `${currentYear}-12-31T23:59:59Z`
      };

      const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables })
      });

      if (!response.ok) {
        // GraphQL APIが使えない場合は、REST APIを使用
        await fetchContributionsViaREST();
        return;
      }

      const data = await response.json();
      
      if (data.errors) {
        await fetchContributionsViaREST();
        return;
      }

      const weeks = data.data.user.contributionsCollection.contributionCalendar.weeks;
      const allDays: ContributionDay[] = [];
      
      weeks.forEach((week: any) => {
        week.contributionDays.forEach((day: any) => {
          allDays.push(day);
        });
      });

      setContributions(allDays);
      setTotalContributions(data.data.user.contributionsCollection.contributionCalendar.totalContributions);
    } catch (err) {
      console.error('GraphQL API failed, falling back to REST API:', err);
      await fetchContributionsViaREST();
    } finally {
      setLoading(false);
    }
  };

  const fetchContributionsViaREST = async () => {
    try {
      // REST APIを使用してコミットデータを取得し、草データを生成
      const response = await fetch('/api/github/commits-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username, 
          days: 365,
          includeStats: false 
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // ヒートマップデータから草データを生成
        const grassData = generateGrassFromHeatmap(result.data.statistics.heatmap);
        setContributions(grassData);
        setTotalContributions(result.data.totalCommits);
      } else {
        setError(result.error || 'データの取得に失敗しました');
      }
    } catch (err) {
      setError('コントリビューションデータの取得に失敗しました');
    }
  };

  const generateGrassFromHeatmap = (heatmap: Record<string, number>): ContributionDay[] => {
    const days: ContributionDay[] = [];
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const count = heatmap[dateStr] || 0;
      
      days.push({
        date: dateStr,
        contributionCount: count,
        contributionLevel: getContributionLevel(count)
      });
    }
    
    return days;
  };

  const getContributionLevel = (count: number): ContributionDay['contributionLevel'] => {
    if (count === 0) return 'NONE';
    if (count <= 3) return 'FIRST_QUARTILE';
    if (count <= 6) return 'SECOND_QUARTILE';
    if (count <= 9) return 'THIRD_QUARTILE';
    return 'FOURTH_QUARTILE';
  };

  const getLevelColor = (level: ContributionDay['contributionLevel']) => {
    switch (level) {
      case 'NONE':
        return 'bg-gray-100 dark:bg-gray-800';
      case 'FIRST_QUARTILE':
        return 'bg-green-200 dark:bg-green-900';
      case 'SECOND_QUARTILE':
        return 'bg-green-400 dark:bg-green-700';
      case 'THIRD_QUARTILE':
        return 'bg-green-600 dark:bg-green-500';
      case 'FOURTH_QUARTILE':
        return 'bg-green-800 dark:bg-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  // 年の最初の日から週ごとにグループ化
  const groupByWeeks = () => {
    const weeks: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];
    
    // 年の最初の日の曜日を取得
    const firstDay = new Date(currentYear, 0, 1);
    const firstDayOfWeek = firstDay.getDay();
    
    // 最初の週の空白を埋める
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({
        date: '',
        contributionCount: 0,
        contributionLevel: 'NONE'
      });
    }
    
    contributions.forEach((day) => {
      currentWeek.push(day);
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    
    // 最後の週を追加
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({
          date: '',
          contributionCount: 0,
          contributionLevel: 'NONE'
        });
      }
      weeks.push(currentWeek);
    }
    
    return weeks;
  };

  const monthLabels = language === 'ja' 
    ? ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dayLabels = language === 'ja'
    ? ['日', '月', '火', '水', '木', '金', '土']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
          <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
        <div className="text-red-600 dark:text-red-400 text-center">
          <p>{error}</p>
          <button 
            onClick={fetchContributions}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {language === 'ja' ? '再試行' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  const weeks = groupByWeeks();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {totalContributions} {language === 'ja' ? 'コントリビューション' : 'contributions'} in {currentYear}
        </h2>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block">
          {/* Month labels */}
          <div className="flex mb-2 ml-10">
            {monthLabels.map((month, index) => (
              <div key={month} className="flex-1 text-xs text-gray-600 dark:text-gray-400" style={{ minWidth: `${100/12}%` }}>
                {month}
              </div>
            ))}
          </div>

          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col justify-between mr-2 py-1">
              {dayLabels.map((day, index) => (
                index % 2 === 1 && (
                  <div key={day} className="text-xs text-gray-600 dark:text-gray-400 h-3 leading-3">
                    {day}
                  </div>
                )
              ))}
            </div>

            {/* Contribution grid */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-3 h-3 rounded-sm ${
                        day.date ? getLevelColor(day.contributionLevel) : 'invisible'
                      } hover:ring-2 hover:ring-blue-400 cursor-pointer transition-all`}
                      title={day.date ? `${day.date}: ${day.contributionCount} ${language === 'ja' ? 'コントリビューション' : 'contributions'}` : ''}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 text-xs text-gray-600 dark:text-gray-400">
            <span>{language === 'ja' ? '少' : 'Less'}</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-200 dark:bg-green-900 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-400 dark:bg-green-700 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-600 dark:bg-green-500 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-800 dark:bg-green-300 rounded-sm"></div>
            </div>
            <span>{language === 'ja' ? '多' : 'More'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}