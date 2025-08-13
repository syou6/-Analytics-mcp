'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Github, BarChart3, Users, Code2, TrendingUp, Zap, Shield } from 'lucide-react';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    const { data: authListener } = supabase?.auth?.onAuthStateChange(
      async (event: any, session: any) => {
        const currentUser = session?.user;
        setUser(currentUser ?? null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  async function checkUser() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser() || { data: { user: null } };
      setUser(user);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGitHub() {
    try {
      if (!supabase) {
       alert('Authentication is not configured');
       return;
     }
     const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          scopes: 'read:user repo',
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function signOut() {
    try {
      if (!supabase) return;
     const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return <Dashboard user={user} onSignOut={signOut} />;
  }

  return <LandingPage onSignIn={signInWithGitHub} />;
}

function LandingPage({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Github className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-black">GitHub Analytics MCP</span>
            </div>
            <button
              onClick={onSignIn}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign in with GitHub
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-black mb-6">
            AI-Powered GitHub Analytics
            <br />
            <span className="text-blue-600">Right in Your AI Assistant</span>
          </h1>
          <p className="text-xl text-black mb-8 max-w-3xl mx-auto">
            Analyze repositories, track contributions, and get insights without leaving your conversation.
            Built for the MCP (Model Context Protocol) ecosystem.
          </p>
          <button
            onClick={onSignIn}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
          >
            <Github className="h-5 w-5" />
            <span>Get Started with GitHub</span>
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-black">Powerful Analytics at Your Fingertips</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<BarChart3 className="h-8 w-8 text-blue-600" />}
            title="Repository Insights"
            description="Get comprehensive statistics about stars, forks, issues, and more"
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-blue-600" />}
            title="Contributor Analysis"
            description="Track top contributors and their impact on your projects"
          />
          <FeatureCard
            icon={<Code2 className="h-8 w-8 text-blue-600" />}
            title="Language Stats"
            description="Understand your codebase composition and technology stack"
          />
          <FeatureCard
            icon={<TrendingUp className="h-8 w-8 text-blue-600" />}
            title="Activity Tracking"
            description="Monitor PRs, issues, and commits over time"
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8 text-blue-600" />}
            title="Lightning Fast"
            description="Cached results and optimized queries for instant responses"
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8 text-blue-600" />}
            title="Secure & Private"
            description="Your data is encrypted and never shared with third parties"
          />
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50 rounded-3xl">
        <h2 className="text-3xl font-bold text-center mb-12 text-black">Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <PricingCard
            name="Free"
            price="¥0"
            features={[
              "10 repos/month",
              "Basic statistics",
              "24-hour cache",
              "Community support"
            ]}
            highlighted={false}
          />
          <PricingCard
            name="Pro"
            price="¥1,500"
            features={[
              "100 repos/month",
              "Advanced analytics",
              "6-hour cache",
              "Email support",
              "CSV exports"
            ]}
            highlighted={true}
          />
          <PricingCard
            name="Business"
            price="¥5,000"
            features={[
              "Unlimited repos",
              "Real-time data",
              "1-hour cache",
              "Priority support",
              "Team sharing (5 seats)",
              "API access"
            ]}
            highlighted={false}
          />
        </div>
      </section>
    </div>
  );
}

function Dashboard({ user, onSignOut }: { user: any; onSignOut: () => void }) {
  const { language } = useLanguage();
  const [repoUrl, setRepoUrl] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [analysisType, setAnalysisType] = useState('repo');
  const [contributors, setContributors] = useState<any>(null);
  const [languages, setLanguages] = useState<any>(null);
  const [activity, setActivity] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [userRepos, setUserRepos] = useState<any[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [activeTab, setActiveTab] = useState<'my-repos' | 'search'>('my-repos');

  // Fetch user's repositories
  useEffect(() => {
    if (user && activeTab === 'my-repos') {
      fetchUserRepos();
    }
  }, [user, activeTab]);

  async function fetchUserRepos() {
    setLoadingRepos(true);
    try {
      // GitHubユーザー名を取得（メールアドレスから推測するか、プロフィールから取得）
      const response = await fetch('/api/user-repos');
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      
      setUserRepos(data.repos || []);
    } catch (error: any) {
      console.error('Error fetching repos:', error);
      // エラーの場合は空配列
      setUserRepos([]);
    } finally {
      setLoadingRepos(false);
    }
  }

  async function analyzeUserRepo(repo: any) {
    setActiveTab('search');
    setRepoUrl(repo.fullName);
    
    // Execute analysis directly
    const owner = repo.owner.login;
    const repoName = repo.name;
    
    setLoading(true);
    try {
      const [repoData, contributorsData, languagesData, activityData] = await Promise.all([
        fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ owner, repo: repoName, analysisType: 'repo' }),
        }).then(r => r.json()),
        fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ owner, repo: repoName, analysisType: 'contributors' }),
        }).then(r => r.json()),
        fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ owner, repo: repoName, analysisType: 'languages' }),
        }).then(r => r.json()),
        fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ owner, repo: repoName, analysisType: 'activity' }),
        }).then(r => r.json()),
      ]);
      
      if (repoData.error) throw new Error(repoData.error);
      
      setAnalysis({ ...repoData, owner, repo: repoName });
      setContributors(contributorsData);
      setLanguages(languagesData);
      setActivity(activityData);
      setAiAnalysis(null); // Reset AI analysis
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message || 'Failed to analyze repository');
    } finally {
      setLoading(false);
    }
  }

  async function getAIAnalysis() {
    if (!analysis || loadingAI) return;
    
    setLoadingAI(true);
    try {
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repoData: analysis,
          languages,
          activity,
          contributors,
          lang: localStorage.getItem('language') || 'ja',
        }),
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setAiAnalysis(data);
    } catch (error: any) {
      console.error('AI Analysis error:', error);
      alert(error.message || 'Failed to get AI analysis');
    } finally {
      setLoadingAI(false);
    }
  }

  async function analyzeRepo() {
    if (!repoUrl) return;
    
    setLoading(true);
    try {
      // Parse repo URL or owner/repo format
      let owner, repo;
      
      if (repoUrl.includes('github.com')) {
        const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        if (!match) {
          alert('Invalid GitHub URL');
          return;
        }
        [, owner, repo] = match;
      } else if (repoUrl.includes('/')) {
        [owner, repo] = repoUrl.split('/');
      } else {
        alert('Please enter a valid GitHub URL or owner/repo format');
        return;
      }
      
      // Remove .git extension if present
      repo = repo.replace(/\.git$/, '');
      
      // Fetch all analysis types
      const [repoData, contributorsData, languagesData, activityData] = await Promise.all([
        fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ owner, repo, analysisType: 'repo' }),
        }).then(r => r.json()),
        fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ owner, repo, analysisType: 'contributors' }),
        }).then(r => r.json()),
        fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ owner, repo, analysisType: 'languages' }),
        }).then(r => r.json()),
        fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ owner, repo, analysisType: 'activity' }),
        }).then(r => r.json()),
      ]);
      
      if (repoData.error) throw new Error(repoData.error);
      
      setAnalysis({ ...repoData, owner, repo });
      setContributors(contributorsData);
      setLanguages(languagesData);
      setActivity(activityData);
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message || 'Failed to analyze repository');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Github className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-black">GitHub Analytics MCP</span>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <span className="text-black">{user.email}</span>
              <button
                onClick={onSignOut}
                className="text-black hover:text-black"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('my-repos')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'my-repos'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-black hover:text-black'
              }`}
            >
              📁 My Repositories
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'search'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-black hover:text-black'
              }`}
            >
              🔍 Search Any Repository
            </button>
          </div>
        </div>

        {/* My Repositories Tab */}
        {activeTab === 'my-repos' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">{t('yourRepositories', language)}</h2>
            {loadingRepos ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-black">{t('loadingRepositories', language)}</p>
              </div>
            ) : userRepos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userRepos.map((repo) => (
                  <div
                    key={repo.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => analyzeUserRepo(repo)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-black truncate flex-1">{repo.name}</h3>
                      {repo.isPrivate && (
                        <span className="ml-2 px-2 py-1 bg-gray-100 text-black text-xs rounded">🔒 {t('private', language)}</span>
                      )}
                    </div>
                    <p className="text-sm text-black mb-3 line-clamp-2">{repo.description || t('noDescription', language)}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-3">
                        {repo.language && (
                          <span className="flex items-center text-black">
                            <span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
                            {repo.language}
                          </span>
                        )}
                        <span className="text-black">⭐ {repo.stars}</span>
                        <span className="text-black">🍴 {repo.forks}</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <button className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm">
                        {t('analyze', language)} →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-black">{t('noRepositories', language)}</p>
                <p className="text-sm text-black mt-2">{t('createFirst', language)}</p>
              </div>
            )}
          </div>
        )}

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">{t('analyzeAnyRepository', language)}</h2>
            <div className="flex space-x-4">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder={t('searchPlaceholder', language)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              onKeyPress={(e) => e.key === 'Enter' && analyzeRepo()}
            />
            <button
              onClick={analyzeRepo}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? t('analyzing', language) : t('analyzeButton', language)}
            </button>
          </div>
        </div>
        )}

        {analysis && (
          <div className="space-y-8">
            {/* Repository Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4">
                {analysis.owner}/{analysis.repo}
              </h3>
              {analysis.description && (
                <p className="text-black mb-4">{analysis.description}</p>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="⭐ Stars" value={analysis.stars?.toLocaleString() || '0'} />
                <StatCard label="🍴 Forks" value={analysis.forks?.toLocaleString() || '0'} />
                <StatCard label="📝 Open Issues" value={analysis.openIssues?.toLocaleString() || '0'} />
                <StatCard label="👀 Watchers" value={analysis.watchers?.toLocaleString() || '0'} />
              </div>
              <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-2">
                <p className="text-black">
                  Primary Language: <span className="font-semibold">{analysis.language || 'Unknown'}</span>
                </p>
                <p className="text-black">
                  License: <span className="font-semibold">{analysis.license || 'No license'}</span>
                </p>
                <p className="text-black">
                  Created: <span className="font-semibold">{analysis.createdAt ? new Date(analysis.createdAt).toLocaleDateString() : 'Unknown'}</span>
                </p>
                <p className="text-black">
                  Last Updated: <span className="font-semibold">{analysis.updatedAt ? new Date(analysis.updatedAt).toLocaleDateString() : 'Unknown'}</span>
                </p>
              </div>
              {analysis.topics && analysis.topics.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-black mb-2">Topics:</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.topics.map((topic: string) => (
                      <span key={topic} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Languages */}
            {languages && languages.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-4">📊 {t('languageComposition', language)}</h3>
                <div className="space-y-3">
                  {languages.slice(0, 5).map((lang: any) => (
                    <div key={lang.language} className="flex items-center">
                      <span className="w-32 text-black">{lang.language}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-6 ml-4">
                        <div 
                          className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${lang.percentage}%` }}
                        >
                          <span className="text-white text-xs font-semibold">{lang.percentage}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contributors */}
            {contributors && contributors.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-4">👥 {t('topContributors', language)}</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {contributors.slice(0, 10).map((contributor: any) => (
                    <a 
                      key={contributor.username}
                      href={contributor.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <img 
                        src={contributor.avatarUrl} 
                        alt={contributor.username}
                        className="w-12 h-12 rounded-full mb-2"
                      />
                      <span className="text-sm font-medium text-black text-center">{contributor.username}</span>
                      <span className="text-xs text-black">{contributor.contributions} commits</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* AI Analysis Button */}
            {analysis && !aiAnalysis && (
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-4 text-white">🤖 {t('aiAnalysisTitle', language)}</h3>
                <p className="mb-4 text-white/90">Gemini AI analyzes this repository in detail and evaluates growth strategies and investment value</p>
                <button
                  onClick={getAIAnalysis}
                  disabled={loadingAI}
                  className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {loadingAI ? 'Analyzing with AI...' : 'Start AI Analysis'}
                </button>
              </div>
            )}

            {/* AI Analysis Results */}
            {aiAnalysis && (
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow p-6 border-2 border-purple-200">
                <h3 className="text-xl font-bold mb-4 text-purple-800">🤖 {t('aiAnalysisReport', language)}</h3>
                
                {/* Health Score */}
                {aiAnalysis.healthScore && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-black">{t('healthScore', language)}</h4>
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl font-bold text-purple-600">
                        {aiAnalysis.healthScore.grade}
                      </div>
                      <div className="text-2xl text-black">
                        {aiAnalysis.healthScore.total}/100
                      </div>
                    </div>
                    <div className="mt-3 space-y-2">
                      {aiAnalysis.healthScore.factors.map((factor: any) => (
                        <div key={factor.name} className="flex items-center">
                          <span className="w-24 text-sm">{factor.name}</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-4 ml-2">
                            <div 
                              className="bg-purple-600 h-4 rounded-full"
                              style={{ width: `${(factor.score / factor.max) * 100}%` }}
                            />
                          </div>
                          <span className="ml-2 text-sm">{Math.round(factor.score)}/{factor.max}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Insights */}
                {aiAnalysis.insights && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-black">{t('aiInsights', language)}</h4>
                    <div className="space-y-3">
                      {aiAnalysis.insights.map((insight: any, i: number) => (
                        <div 
                          key={i}
                          className={`p-3 rounded-lg ${
                            insight.type === 'positive' ? 'bg-green-50 border border-green-200 text-green-900' :
                            insight.type === 'warning' ? 'bg-yellow-50 border border-yellow-200 text-yellow-900' :
                            'bg-blue-50 border border-blue-200 text-blue-900'
                          }`}
                        >
                          <div className="font-semibold flex items-center">
                            {insight.aiGenerated && <span className="mr-2">✨</span>}
                            {insight.title}
                          </div>
                          <div className="text-sm mt-1">{insight.description}</div>
                          {insight.suggestion && (
                            <div className="text-sm mt-2 font-medium">
                              💡 Suggestion: {insight.suggestion}
                            </div>
                          )}
                          {insight.futureGrowth && (
                            <div className="text-sm mt-2">
                              📈 成長予測: {insight.futureGrowth}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {aiAnalysis.recommendations && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-black">{t('recommendedActions', language)}</h4>
                    <div className="space-y-3">
                      {aiAnalysis.recommendations.map((rec: any, i: number) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-black">{rec.title}</span>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              rec.priority === 'high' ? 'bg-red-100 text-red-900' :
                              rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-900' :
                              'bg-green-100 text-green-900'
                            }`}>
                              {rec.priority === 'high' ? '高' : rec.priority === 'medium' ? '中' : '低'}優先度
                            </span>
                          </div>
                          <ul className="text-sm space-y-1 text-black">
                            {rec.actions.map((action: string, j: number) => (
                              <li key={j} className="flex items-start">
                                <span className="mr-2">•</span>
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Competitor Analysis */}
                {aiAnalysis.competitorAnalysis && (
                  <div>
                    <h4 className="font-semibold mb-3 text-black">🎯 {t('competitorAnalysis', language)}</h4>
                    
                    {/* 市場ポジション概要 */}
                    {aiAnalysis.competitorAnalysis.analysis && (
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4 border border-blue-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-black">市場ポジション</p>
                            <p className="text-xl font-bold text-blue-700">
                              {aiAnalysis.competitorAnalysis.marketPosition.rank}/
                              {aiAnalysis.competitorAnalysis.marketPosition.total}位
                            </p>
                            <p className="text-sm text-black">
                              上位{aiAnalysis.competitorAnalysis.marketPosition.percentile}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-black">Competitor Average Stars</p>
                            <p className="text-xl font-bold text-purple-700">
                              {aiAnalysis.competitorAnalysis.analysis.averageStars?.toLocaleString()}
                            </p>
                            <p className="text-sm text-black">
                              Total Competitors: {aiAnalysis.competitorAnalysis.analysis.totalCompetitors?.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-black">ポジション</p>
                            <p className="text-xl font-bold text-green-700">
                              {aiAnalysis.competitorAnalysis.analysis.yourPosition}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Competitor Repository Details */}
                    <div className="space-y-3">
                      {aiAnalysis.competitorAnalysis.similarRepos.length > 0 ? (
                        aiAnalysis.competitorAnalysis.similarRepos.map((comp: any, i: number) => (
                          <div key={i} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <a 
                                  href={comp.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  {comp.name}
                                </a>
                                {comp.description && (
                                  <p className="text-sm text-black mt-1 line-clamp-2">{comp.description}</p>
                                )}
                              </div>
                              {comp.growth !== 'N/A' && (
                                <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded">
                                  {comp.growth}
                                </span>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-4 gap-2 mb-2">
                              <div className="text-sm">
                                <span className="text-black">⭐ スター</span>
                                <p className="font-semibold text-black">{comp.stars?.toLocaleString()}</p>
                              </div>
                              <div className="text-sm">
                                <span className="text-black">🍴 フォーク</span>
                                <p className="font-semibold text-black">{comp.forks?.toLocaleString() || '-'}</p>
                              </div>
                              <div className="text-sm">
                                <span className="text-black">📝 イシュー</span>
                                <p className="font-semibold text-black">{comp.issues?.toLocaleString() || '-'}</p>
                              </div>
                              <div className="text-sm">
                                <span className="text-black">🔥 活動</span>
                                <p className="font-semibold text-black">
                                  {comp.recentActivity ? `${comp.recentActivity} commits/month` : '-'}
                                </p>
                              </div>
                            </div>
                            
                            <div className="pt-2 border-t border-gray-100">
                              <p className="text-sm text-black">
                                <span className="font-medium">比較:</span> {comp.comparison}
                              </p>
                              {comp.language && (
                                <p className="text-xs text-black mt-1">
                                  主要言語: {comp.language}
                                </p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : aiAnalysis.competitorAnalysis.similarRepos.map((comp: any, i: number) => (
                        <div key={i} className="border-t border-gray-200 pt-2 mt-2">
                          <div className="font-medium text-black">{comp.name}</div>
                          <div className="text-sm text-black">
                            ⭐ {comp.stars} ({comp.growth})
                          </div>
                          <div className="text-sm text-black">{comp.comparison}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Activity */}
            {activity && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-4">📈 {t('recentActivity', language)} ({activity.period})</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-black mb-2">{t('commits', language)}</h4>
                    <p className="text-2xl font-bold">{activity.commits?.total || 0}</p>
                    <p className="text-sm text-black">by {activity.commits?.authors || 0} authors</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-2">{t('issues', language)}</h4>
                    <p className="text-2xl font-bold">{activity.issues?.total || 0}</p>
                    <p className="text-sm text-black">
                      {activity.issues?.open || 0} open, {activity.issues?.closed || 0} closed
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-2">{t('pullRequests', language)}</h4>
                    <p className="text-2xl font-bold">{activity.pullRequests?.total || 0}</p>
                    <p className="text-sm text-black">
                      {activity.pullRequests?.open || 0} open, {activity.pullRequests?.merged || 0} merged
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Usage Info Section */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h3 className="text-xl font-bold mb-4">📊 {t('usageStatus', language)}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm text-black font-medium">{t('analysesThisMonth', language)}</p>
              <p className="text-2xl font-bold text-black">3 / 10</p>
              <p className="text-xs text-black mt-1">{t('freePlan', language)}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <p className="text-sm text-black font-medium">{t('aiAnalysisUsage', language)}</p>
              <p className="text-2xl font-bold text-black">0 / 0</p>
              <p className="text-xs text-black mt-1">{t('proFeature', language)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <p className="text-sm text-black font-medium">{t('cachePeriod', language)}</p>
              <p className="text-2xl font-bold text-black">24 {t('hours', language)}</p>
              <p className="text-xs text-black mt-1">{t('dataUpdateFrequency', language)}</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-black mb-2">🚀 {t('upgradeToPro', language)}</h4>
            <ul className="text-sm text-black space-y-1 mb-3">
              <li>✨ {t('aiDeepAnalysis', language)}</li>
              <li>📈 {t('monthlyRepoLimit', language)}</li>
              <li>💾 {t('csvJsonExport', language)}</li>
              <li>⚡ {t('shorterCache', language)}</li>
            </ul>
            <button 
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium opacity-50 cursor-not-allowed"
              disabled
            >
              {t('startMonthly', language)} (Coming Soon)
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-black">{title}</h3>
      <p className="text-black">{description}</p>
    </div>
  );
}

function PricingCard({ name, price, features, highlighted }: { name: string; price: string; features: string[]; highlighted: boolean }) {
  return (
    <div className={`bg-white p-8 rounded-lg ${highlighted ? 'ring-2 ring-blue-600 shadow-lg' : 'shadow-sm'}`}>
      {highlighted && (
        <div className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
          MOST POPULAR
        </div>
      )}
      <h3 className="text-2xl font-bold mb-2 text-black">{name}</h3>
      <p className="text-4xl font-bold mb-6 text-black">
        {price}
        <span className="text-lg text-black">/month</span>
      </p>
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start">
            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-black">{feature}</span>
          </li>
        ))}
      </ul>
      <button className={`w-full py-3 rounded-lg font-semibold transition-colors ${
        highlighted 
          ? 'bg-blue-600 text-white hover:bg-blue-700' 
          : 'bg-gray-100 text-black hover:bg-gray-200'
      }`}>
        Get Started
      </button>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <p className="text-black text-sm">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}