# Supabase リダイレクトURL設定

Supabaseダッシュボード → Authentication → URL Configuration で以下を追加：

## Redirect URLs (必須)
```
http://localhost:3000
http://localhost:3000/auth
https://ana-app-web.vercel.app
https://ana-app-web.vercel.app/auth
```

## 設定手順
1. https://supabase.com/dashboard にログイン
2. プロジェクトを選択
3. Authentication → URL Configuration
4. Redirect URLsに上記のURLを全て追加
5. Save

これにより、認証後に `/auth` ページにリダイレクトされ、そこでセッションを処理します。