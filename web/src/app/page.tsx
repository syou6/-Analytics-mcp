'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@supabase/supabase-js';
import { Github, BarChart3, Users, Code2, TrendingUp, Zap, Shield, Share2, Crown, Lock, Sparkles } from 'lucide-react';
import LanguageToggle from '@/components/LanguageToggle';
import UpgradeModal from '@/components/UpgradeModal';
import ActivitySummaryCards from '@/components/ActivitySummaryCards';
import CommitHeatmap from '@/components/CommitHeatmap';
import CommitTimeDistribution from '@/components/CommitTimeDistribution';
import RepositoryPerformanceTable from '@/components/RepositoryPerformanceTable';
import GrowthInsights from '@/components/GrowthInsights';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';

export default function Home() {
  const { user, loading, signOut: authSignOut } = useAuth();
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseAnonKey) {
        const client = createClient(supabaseUrl, supabaseAnonKey);
        setSupabase(client);
      }
    }
  }, []);

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
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function signOut() {
    await authSignOut();
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
            price="¥980"
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
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [usage, setUsage] = useState<any>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Fetch user's repositories and subscription status
  useEffect(() => {
    if (user) {
      checkSubscription();
      if (activeTab === 'my-repos') {
        fetchUserRepos();
      }
      
      // Check for successful payment redirect
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');
      if (sessionId) {
        setShowSuccessMessage(true);
        // Clean up URL
        window.history.replaceState({}, document.title, '/');
        
        // Verify payment and create subscription if needed
        verifyPayment(sessionId);
        
        // Hide message after 5 seconds
        setTimeout(() => setShowSuccessMessage(false), 5000);
      }
    }
  }, [user, activeTab]);

  async function checkSubscription() {
    try {
      const response = await fetch(`/api/subscription?userId=${user.id}`);
      if (!response.ok) {
        console.error('Subscription API error:', response.status);
        // Set default values on error
        setSubscription({
          isPro: false,
          analysesRemaining: 10,
          aiAnalysesRemaining: 0,
          limits: { analyses: 10, aiAnalyses: 0 }
        });
        return;
      }
      const data = await response.json();
      setSubscription(data);
      setUsage(data.usage);
    } catch (error) {
      console.error('Error checking subscription:', error);
      // Set default values on error
      setSubscription({
        isPro: false,
        analysesRemaining: 10,
        aiAnalysesRemaining: 0,
        limits: { analyses: 10, aiAnalyses: 0 }
      });
    }
  }

  async function verifyPayment(sessionId: string) {
    try {
      // First, verify the payment with Stripe
      const response = await fetch('/api/check-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, userId: user.id }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('Payment verified, updating subscription status...');
        // Wait a bit then refresh subscription status
        setTimeout(() => {
          checkSubscription();
        }, 1000);
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
    }
  }

  async function fetchUserRepos() {
    setLoadingRepos(true);
    try {
      // GitHubユーザー名を取得（メールアドレスから推測するか、プロフィールから取得）
      const response = await fetch('/api/user-repos');
      
      if (!response.ok) {
        console.error('User repos API error:', response.status);
        setUserRepos([]);
        return;
      }
      
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
    
    // Check if user has AI analysis access
    if (subscription && !subscription.isPro) {
      setShowUpgrade(true);
      return;
    }
    
    // Check AI usage limits for Pro users
    if (subscription && subscription.isPro && subscription.aiAnalysesRemaining <= 0) {
      alert(language === 'ja' ? 'AI分析の月間上限に達しました' : 'Monthly AI analysis limit reached');
      return;
    }
    
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
      
      // Track AI usage
      await fetch('/api/track-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, type: 'ai' }),
      });
      
      // Refresh subscription status
      checkSubscription();
    } catch (error: any) {
      console.error('AI Analysis error:', error);
      alert(error.message || 'Failed to get AI analysis');
    } finally {
      setLoadingAI(false);
    }
  }

  async function sharePublicDashboard() {
    try {
      const response = await fetch('/api/public-dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysis,
          contributors,
          languages,
          activity,
        }),
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      // Copy link to clipboard
      const publicUrl = `${window.location.origin}/public/${data.publicId}`;
      await navigator.clipboard.writeText(publicUrl);
      
      // Show success message
      alert(`Public dashboard created! Link copied to clipboard:\n${publicUrl}`);
      
      // Open in new tab
      window.open(publicUrl, '_blank');
    } catch (error: any) {
      console.error('Error sharing dashboard:', error);
      alert(error.message || 'Failed to create public dashboard');
    }
  }

  async function analyzeRepo() {
    if (!repoUrl) return;
    
    // Check usage limits
    if (subscription && !subscription.isPro && subscription.analysesRemaining <= 0) {
      setShowUpgrade(true);
      return;
    }
    
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
      
      // Track usage
      await fetch('/api/track-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, type: 'analysis' }),
      });
      
      // Refresh subscription status
      checkSubscription();
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message || 'Failed to analyze repository');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg max-w-md">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  {language === 'ja' ? '決済が完了しました！' : 'Payment Successful!'}
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    {language === 'ja' 
                      ? 'Proプランへのアップグレードが完了しました。全機能をお楽しみください！' 
                      : 'You have been upgraded to Pro. Enjoy all features!'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Github className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-black">GitHub Analytics MCP</span>
            </div>
            <div className="flex items-center space-x-4">
              {subscription && (
                <div className="flex items-center space-x-2">
                  {subscription.isPro ? (
                    <>
                      <span className="flex items-center bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full text-sm">
                        <Crown className="h-4 w-4 mr-1" />
                        Pro
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={async () => {
                            const res = await fetch('/api/stripe/billing-portal', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ userId: user.id }),
                            });
                            const data = await res.json();
                            if (data.url) window.location.href = data.url;
                          }}
                          className="text-sm text-black hover:underline"
                        >
                          {language === 'ja' ? '請求書' : 'Billing'}
                        </button>
                        <span className="text-gray-400">|</span>
                        <button
                          onClick={async () => {
                            if (confirm(language === 'ja' 
                              ? 'サブスクリプションをキャンセルしますか？\n現在の請求期間の終了まで利用可能です。' 
                              : 'Cancel subscription?\nYou can still use it until the end of the current billing period.')) {
                              const res = await fetch('/api/stripe/cancel-subscription', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ userId: user.id }),
                              });
                              const data = await res.json();
                              if (data.success) {
                                alert(language === 'ja' 
                                  ? `サブスクリプションは ${new Date(data.cancelAt).toLocaleDateString()} にキャンセルされます` 
                                  : `Subscription will be canceled on ${new Date(data.cancelAt).toLocaleDateString()}`);
                                checkSubscription();
                              }
                            }
                          }}
                          className="text-sm text-red-600 hover:underline"
                        >
                          {language === 'ja' ? 'キャンセル' : 'Cancel'}
                        </button>
                      </div>
                      <span className="text-sm text-black">
                        {subscription.analysesRemaining}/{subscription.limits?.analyses || 100} {language === 'ja' ? '分析' : 'analyses'}
                      </span>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowUpgrade(true)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm hover:opacity-90 flex items-center"
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        Upgrade to Pro
                      </button>
                      <span className={`text-sm ${subscription.analysesRemaining <= 3 ? 'text-red-600 font-semibold' : 'text-black'}`}>
                        {subscription.analysesRemaining}/{subscription.limits?.analyses || 10} {language === 'ja' ? '分析' : 'analyses'}
                        {subscription.analysesRemaining <= 3 && ' ⚠️'}
                      </span>
                    </>
                  )}
                </div>
              )}
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
            <h2 className="text-2xl font-bold mb-4 text-black">{t('yourRepositories', language)}</h2>
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
            <h2 className="text-2xl font-bold mb-4 text-black">{t('analyzeAnyRepository', language)}</h2>
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
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content - 2 columns */}
            <div className="lg:col-span-2 space-y-8">
              {/* Activity Summary Cards */}
              <ActivitySummaryCards 
                analysis={analysis}
                activity={activity}
                languages={languages}
              />

              {/* Repository Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-black">
                  {analysis.owner}/{analysis.repo}
                </h3>
                <button
                  onClick={() => sharePublicDashboard()}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share Dashboard</span>
                </button>
              </div>
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
                  Primary Language: <span className="font-semibold text-black">{analysis.language || 'Unknown'}</span>
                </p>
                <p className="text-black">
                  License: <span className="font-semibold text-black">{analysis.license || 'No license'}</span>
                </p>
                <p className="text-black">
                  Created: <span className="font-semibold text-black">{analysis.createdAt ? new Date(analysis.createdAt).toLocaleDateString() : 'Unknown'}</span>
                </p>
                <p className="text-black">
                  Last Updated: <span className="font-semibold text-black">{analysis.updatedAt ? new Date(analysis.updatedAt).toLocaleDateString() : 'Unknown'}</span>
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

            {/* Commit Heatmap and Time Distribution */}
            <div className="grid md:grid-cols-2 gap-8">
              {subscription?.isPro ? (
                <>
                  <CommitHeatmap owner={analysis.owner} repo={analysis.repo} />
                  <CommitTimeDistribution owner={analysis.owner} repo={analysis.repo} />
                </>
              ) : (
                <>
                  <div className="bg-gray-100 rounded-lg shadow p-6 border-2 border-gray-300 relative">
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90 rounded-lg">
                      <div className="text-center">
                        <Lock className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 font-semibold">{language === 'ja' ? 'コミットヒートマップ' : 'Commit Heatmap'}</p>
                        <p className="text-sm text-gray-500">{language === 'ja' ? 'Pro機能' : 'Pro Feature'}</p>
                      </div>
                    </div>
                    <div className="blur-sm opacity-50">
                      <CommitHeatmap owner={analysis.owner} repo={analysis.repo} />
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-lg shadow p-6 border-2 border-gray-300 relative">
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90 rounded-lg">
                      <div className="text-center">
                        <Lock className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 font-semibold">{language === 'ja' ? '時間別分布' : 'Time Distribution'}</p>
                        <p className="text-sm text-gray-500">{language === 'ja' ? 'Pro機能' : 'Pro Feature'}</p>
                      </div>
                    </div>
                    <div className="blur-sm opacity-50">
                      <CommitTimeDistribution owner={analysis.owner} repo={analysis.repo} />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Repository Performance Table */}
            <RepositoryPerformanceTable userRepos={userRepos} />

            {/* Languages */}
            {languages && languages.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-4 text-black">📊 {t('languageComposition', language)}</h3>
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
                <h3 className="text-xl font-bold mb-4 text-black">👥 {t('topContributors', language)}</h3>
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
              <div className={`rounded-lg shadow p-6 ${subscription?.isPro ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold mb-4 ${subscription?.isPro ? 'text-white' : 'text-gray-600'}`}>
                      {subscription?.isPro ? '🤖' : '🔒'} {t('aiAnalysisTitle', language)}
                    </h3>
                    <p className={`mb-4 ${subscription?.isPro ? 'text-white/90' : 'text-gray-500'}`}>
                      {subscription?.isPro 
                        ? 'Gemini AI analyzes this repository in detail and evaluates growth strategies and investment value'
                        : language === 'ja' 
                          ? 'AI分析はProプランの機能です。アップグレードして詳細な分析を取得しましょう'
                          : 'AI Analysis is a Pro feature. Upgrade to get detailed insights'}
                    </p>
                  </div>
                  {!subscription?.isPro && (
                    <div className="ml-4">
                      <Lock className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <button
                  onClick={subscription?.isPro ? getAIAnalysis : () => setShowUpgrade(true)}
                  disabled={subscription?.isPro && loadingAI}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    subscription?.isPro 
                      ? 'bg-white text-purple-600 hover:bg-gray-100 disabled:opacity-50'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90'
                  }`}
                >
                  {subscription?.isPro 
                    ? (loadingAI ? 'Analyzing with AI...' : 'Start AI Analysis')
                    : (language === 'ja' ? '🔓 Proにアップグレード' : '🔓 Upgrade to Pro')}
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
                                <span className="font-medium text-black">比較:</span> {comp.comparison}
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
                <h3 className="text-xl font-bold mb-4 text-black">📈 {t('recentActivity', language)} ({activity.period})</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-black mb-2">{t('commits', language)}</h4>
                    <p className="text-2xl font-bold text-black">{activity.commits?.total || 0}</p>
                    <p className="text-sm text-black">by {activity.commits?.authors || 0} authors</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-2">{t('issues', language)}</h4>
                    <p className="text-2xl font-bold text-black">{activity.issues?.total || 0}</p>
                    <p className="text-sm text-black">
                      {activity.issues?.open || 0} open, {activity.issues?.closed || 0} closed
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-2">{t('pullRequests', language)}</h4>
                    <p className="text-2xl font-bold text-black">{activity.pullRequests?.total || 0}</p>
                    <p className="text-sm text-black">
                      {activity.pullRequests?.open || 0} open, {activity.pullRequests?.merged || 0} merged
                    </p>
                  </div>
                </div>
              </div>
            )}
            </div>

            {/* Growth Insights Sidebar */}
            <div className="lg:col-span-1">
              {subscription?.isPro ? (
                <GrowthInsights 
                  analysis={analysis}
                  activity={activity}
                  contributors={contributors}
                  owner={analysis?.owner || ''}
                  repo={analysis?.repo || ''}
                />
              ) : (
                <div className="bg-gray-100 rounded-lg shadow p-6 border-2 border-gray-300">
                  <div className="text-center py-12">
                    <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-600 mb-2">
                      {language === 'ja' ? '成長インサイト' : 'Growth Insights'}
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                      {language === 'ja' 
                        ? 'スキル進歩、目標追跡、AI提案など'
                        : 'Skill progress, goal tracking, AI suggestions'}
                    </p>
                    <button
                      onClick={() => setShowUpgrade(true)}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:opacity-90"
                    >
                      <Sparkles className="inline h-4 w-4 mr-1" />
                      {language === 'ja' ? 'Proで解放' : 'Unlock with Pro'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
      
      {/* Upgrade Modal */}
      <UpgradeModal 
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        userId={user.id}
        userEmail={user.email}
      />
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
      <p className="text-2xl font-bold text-black">{value}</p>
    </div>
  );
}