# Supabase設定チェックリスト

## 1. Supabaseダッシュボードで確認すること

### Authentication → Providers
- GitHub Providerが有効になっているか確認
- Client ID/Secretが正しいか確認

### Authentication → URL Configuration
以下のURLが設定されているか確認：
- Site URL: `https://ana-app-web.vercel.app`
- Redirect URLs:
  - `https://ana-app-web.vercel.app/auth/callback`
  - `https://ana-app-web.vercel.app`
  - `http://localhost:3000/auth/callback` (開発用)

### Project Settings → API
- Project URL: `https://cvhiujltpzxhmknznmuq.supabase.co`
- Anon public key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2aGl1amx0cHp4aG1rbnpubXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNDk5MTcsImV4cCI6MjA3MDYyNTkxN30.WxnQPMbmkCYpJ1aYWpRMk9gndRTfFtFh9_VmLSqNttQ`

## 2. GitHub OAuth Appで確認すること
https://github.com/settings/applications

- Homepage URL: `https://ana-app-web.vercel.app`
- Authorization callback URL: `https://cvhiujltpzxhmknznmuq.supabase.co/auth/v1/callback`

## 3. Vercel環境変数
すべて設定済み：
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- NEXT_PUBLIC_APP_URL
- GITHUB_TOKEN
- STRIPE関連の変数

## 4. SQL実行（RLS修正）
Supabase SQL Editorで実行：
```sql
-- Enable RLS on analysis_cache table
ALTER TABLE public.analysis_cache ENABLE ROW LEVEL SECURITY;

-- Create a simple policy
CREATE POLICY "Enable access for authenticated users only" ON public.analysis_cache
    FOR ALL
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);
```