'use client';

import { TrendingUp, TrendingDown, Calendar, Code, GitCommit, Activity } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ActivityCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  icon: React.ReactNode;
  color: string;
}

function ActivityCard({ title, value, subtitle, trend, icon, color }: ActivityCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-sm text-black mb-1">{title}</p>
      <p className="text-2xl font-bold text-black">{value}</p>
      {subtitle && <p className="text-xs text-black mt-1">{subtitle}</p>}
    </div>
  );
}

interface ActivitySummaryProps {
  analysis: any;
  activity: any;
  languages: any;
}

export default function ActivitySummaryCards({ analysis, activity, languages }: ActivitySummaryProps) {
  const { language } = useLanguage();
  
  // Calculate statistics
  const totalCommits = activity?.commits?.total || 0;
  const activeDays = activity?.commits?.authors || 0;
  const totalAdditions = activity?.commits?.additions || 0;
  const totalDeletions = activity?.commits?.deletions || 0;
  
  // Fix language data structure
  const languageData = Array.isArray(languages) ? languages : languages?.languages;
  const mainLanguage = languageData?.[0]?.language || languageData?.[0]?.name || analysis?.language || 'N/A';
  const mainLanguagePercent = languageData?.[0]?.percentage || 0;
  
  // Calculate trends (mock data for now - would come from historical data)
  const commitsTrend = 12; // +12% from last month
  const codeChurn = totalAdditions - totalDeletions;

  const cards = [
    {
      title: language === 'ja' ? '今月のコミット' : 'Monthly Commits',
      value: totalCommits,
      subtitle: language === 'ja' ? `${activeDays}人の貢献者` : `${activeDays} contributors`,
      trend: totalCommits > 50 ? 12 : totalCommits > 20 ? 5 : -5,
      icon: <GitCommit className="h-5 w-5 text-white" />,
      color: 'bg-blue-500'
    },
    {
      title: language === 'ja' ? '貢献者数' : 'Contributors',
      value: activeDays,
      subtitle: language === 'ja' ? '過去30日間' : 'Last 30 days',
      icon: <Calendar className="h-5 w-5 text-white" />,
      color: 'bg-green-500'
    },
    {
      title: language === 'ja' ? 'コード変更' : 'Code Changes',
      value: `+${totalAdditions.toLocaleString()}`,
      subtitle: language === 'ja' ? `-${totalDeletions.toLocaleString()} 削除` : `-${totalDeletions.toLocaleString()} deleted`,
      trend: codeChurn > 0 ? 5 : -5,
      icon: <Code className="h-5 w-5 text-white" />,
      color: 'bg-purple-500'
    },
    {
      title: language === 'ja' ? '主要言語' : 'Main Language',
      value: mainLanguage,
      subtitle: `${mainLanguagePercent}%`,
      icon: <Activity className="h-5 w-5 text-white" />,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <ActivityCard key={index} {...card} />
      ))}
    </div>
  );
}