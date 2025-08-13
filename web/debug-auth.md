# Supabase認証デバッグチェックリスト

## 1. Supabaseダッシュボードで確認

### Authentication → Providers → GitHub
- [ ] Client ID が正しく設定されている
- [ ] Client Secret が正しく設定されている  
- [ ] Callback URL: `https://cvhiujltpzxhmknznmuq.supabase.co/auth/v1/callback`

### Authentication → URL Configuration
以下のURLがすべて追加されているか確認：
- [ ] `http://localhost:3000`
- [ ] `http://localhost:3000/auth/callback`
- [ ] `https://ana-app-web.vercel.app`
- [ ] `https://ana-app-web.vercel.app/auth/callback`

### Settings → API
- [ ] Project URL: `https://cvhiujltpzxhmknznmuq.supabase.co`
- [ ] Anon Key が `.env.local` の `NEXT_PUBLIC_SUPABASE_ANON_KEY` と一致

## 2. GitHub OAuth App設定で確認

### Authorization callback URL
- [ ] `https://cvhiujltpzxhmknznmuq.supabase.co/auth/v1/callback`

## 3. Vercel環境変数
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `GITHUB_TOKEN`
- [ ] その他の環境変数

## 4. ローカルテスト
```bash
# 開発サーバーで動作確認
http://localhost:3000
```

もしローカルで動作する場合は、Vercelの環境変数の問題の可能性が高い。