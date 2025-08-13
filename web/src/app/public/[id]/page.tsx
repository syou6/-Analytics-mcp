'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Github, BarChart3, Users, Code2, Share2, Eye } from 'lucide-react';
import Link from 'next/link';

export default function PublicDashboard() {
  const params = useParams();
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, [params.id]);

  async function fetchDashboard() {
    try {
      const response = await fetch(`/api/public-dashboard?id=${params.id}`);
      const data = await response.json();
      
      if (data.error) {
        console.error(data.error);
      } else {
        setDashboard(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-black mb-4">Dashboard Not Found</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          Go to Homepage
        </Link>
      </div>
    );
  }

  const { analysis, contributors, languages, activity, views } = dashboard;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Github className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-black">GitHub Analytics MCP</span>
              <span className="text-sm text-black bg-green-100 px-2 py-1 rounded">Public Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="flex items-center text-black">
                <Eye className="h-4 w-4 mr-1" />
                {views} views
              </span>
              <Link 
                href="/"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your Own
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Repository Overview */}
        {analysis && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-black">
              {analysis.owner}/{analysis.repo}
            </h2>
            {analysis.description && (
              <p className="text-black mb-4">{analysis.description}</p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="⭐ Stars" value={analysis.stars?.toLocaleString() || '0'} />
              <StatCard label="🍴 Forks" value={analysis.forks?.toLocaleString() || '0'} />
              <StatCard label="📝 Open Issues" value={analysis.openIssues?.toLocaleString() || '0'} />
              <StatCard label="👀 Watchers" value={analysis.watchers?.toLocaleString() || '0'} />
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Language Composition */}
          {languages && languages.languages && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4 text-black">📊 Language Composition</h3>
              <div className="space-y-3">
                {languages.languages.map((lang: any, index: number) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-black">{lang.name}</span>
                      <span className="text-sm text-black">{lang.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${lang.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Contributors */}
          {contributors && contributors.contributors && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4 text-black">👥 Top Contributors</h3>
              <div className="space-y-3">
                {contributors.contributors.slice(0, 5).map((contributor: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={contributor.avatar}
                        alt={contributor.username}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="font-medium text-black">{contributor.username}</span>
                    </div>
                    <span className="text-sm text-black">{contributor.contributions} commits</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Activity */}
        {activity && (
          <div className="bg-white rounded-lg shadow p-6 mt-8">
            <h3 className="text-xl font-bold mb-4 text-black">📈 Recent Activity ({activity.period})</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-black mb-2">Commits</h4>
                <p className="text-2xl font-bold text-black">{activity.commits?.total || 0}</p>
                <p className="text-sm text-black">by {activity.commits?.authors || 0} authors</p>
              </div>
              <div>
                <h4 className="font-semibold text-black mb-2">Issues</h4>
                <p className="text-2xl font-bold text-black">{activity.issues?.total || 0}</p>
                <p className="text-sm text-black">
                  {activity.issues?.open || 0} open, {activity.issues?.closed || 0} closed
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-black mb-2">Pull Requests</h4>
                <p className="text-2xl font-bold text-black">{activity.pullRequests?.total || 0}</p>
                <p className="text-sm text-black">
                  {activity.pullRequests?.open || 0} open, {activity.pullRequests?.merged || 0} merged
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow p-8 mt-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Want Your Own GitHub Analytics?
          </h3>
          <p className="text-white mb-6">
            Get AI-powered insights, track your progress, and improve your GitHub performance.
          </p>
          <Link
            href="/"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Start Free Today
          </Link>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <p className="text-sm text-black mb-1">{label}</p>
      <p className="text-2xl font-bold text-black">{value}</p>
    </div>
  );
}