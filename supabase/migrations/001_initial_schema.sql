-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ユーザープロファイル
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  github_username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'business')),
  api_key TEXT UNIQUE DEFAULT gen_random_uuid()::TEXT,
  github_token TEXT, -- 暗号化して保存
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 組織管理（チームプラン用）
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_type TEXT DEFAULT 'business' CHECK (plan_type IN ('business', 'enterprise')),
  seats INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 組織メンバー
CREATE TABLE organization_members (
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  PRIMARY KEY (org_id, user_id)
);

-- 分析履歴
CREATE TABLE analysis_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  repo_owner TEXT NOT NULL,
  repo_name TEXT NOT NULL,
  analysis_type TEXT NOT NULL,
  request_params JSONB,
  response_data JSONB,
  tokens_used INTEGER DEFAULT 0,
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 分析結果キャッシュ
CREATE TABLE analysis_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT UNIQUE NOT NULL,
  repo_slug TEXT NOT NULL,
  analysis_type TEXT NOT NULL,
  data JSONB NOT NULL,
  hit_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '6 hours'
);

-- 使用量管理
CREATE TABLE usage_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  api_calls INTEGER DEFAULT 0,
  repos_analyzed INTEGER DEFAULT 0,
  tokens_consumed INTEGER DEFAULT 0,
  cache_hits INTEGER DEFAULT 0,
  UNIQUE(user_id, date)
);

-- サブスクリプション
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  status TEXT DEFAULT 'trialing',
  trial_ends_at TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- お気に入りリポジトリ
CREATE TABLE favorite_repos (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  repo_slug TEXT NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, repo_slug)
);

-- インデックス
CREATE INDEX idx_analysis_history_user_id ON analysis_history(user_id);
CREATE INDEX idx_analysis_history_repo ON analysis_history(repo_owner, repo_name);
CREATE INDEX idx_analysis_cache_expires ON analysis_cache(expires_at);
CREATE INDEX idx_usage_metrics_user_date ON usage_metrics(user_id, date);
CREATE INDEX idx_favorite_repos_user ON favorite_repos(user_id);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_repos ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Analysis history policies
CREATE POLICY "Users can view own analysis history" ON analysis_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own analysis history" ON analysis_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Usage metrics policies
CREATE POLICY "Users can view own usage metrics" ON usage_metrics
  FOR SELECT USING (auth.uid() = user_id);

-- Favorite repos policies
CREATE POLICY "Users can manage own favorite repos" ON favorite_repos
  FOR ALL USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update usage metrics
CREATE OR REPLACE FUNCTION increment_usage(
  p_user_id UUID,
  p_api_calls INTEGER DEFAULT 1,
  p_repos_analyzed INTEGER DEFAULT 0,
  p_tokens_consumed INTEGER DEFAULT 0,
  p_cache_hits INTEGER DEFAULT 0
)
RETURNS void AS $$
BEGIN
  INSERT INTO usage_metrics (user_id, date, api_calls, repos_analyzed, tokens_consumed, cache_hits)
  VALUES (p_user_id, CURRENT_DATE, p_api_calls, p_repos_analyzed, p_tokens_consumed, p_cache_hits)
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    api_calls = usage_metrics.api_calls + p_api_calls,
    repos_analyzed = usage_metrics.repos_analyzed + p_repos_analyzed,
    tokens_consumed = usage_metrics.tokens_consumed + p_tokens_consumed,
    cache_hits = usage_metrics.cache_hits + p_cache_hits;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;