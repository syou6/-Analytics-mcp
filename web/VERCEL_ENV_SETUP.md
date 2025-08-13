# Vercel環境変数設定手順

## 重要：以下の環境変数をVercelに設定してください

1. Vercelダッシュボード → プロジェクト選択
2. Settings → Environment Variables
3. 以下を追加：

### 必須環境変数

| 変数名 | 説明 |
|--------|------|
| `GITHUB_TOKEN` | GitHubパーソナルアクセストークン（.env.localから） |
| `NEXT_PUBLIC_SUPABASE_URL` | https://cvhiujltpzxhmknznmuq.supabase.co |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | .env.localから |
| `SUPABASE_SERVICE_ROLE_KEY` | .env.localから |
| `GEMINI_API_KEY` | .env.localから |
| `STRIPE_SECRET_KEY` | .env.localから |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | .env.localから |
| `STRIPE_WEBHOOK_SECRET` | whsec_PENDING（後で更新） |
| `STRIPE_PRICE_ID` | price_1RvdFbGiViXuiYkw8toJIjhL |
| `NEXT_PUBLIC_APP_URL` | https://ana-app-web.vercel.app |

## 設定後の確認

1. すべての環境変数を追加
2. "Save" をクリック
3. Deployments → 最新のデプロイ → "..." → "Redeploy"
4. "Use existing Build Cache" のチェックを外す
5. "Redeploy" をクリック

## トラブルシューティング

もし401エラーが続く場合：

1. `GITHUB_TOKEN`が正しいか確認
   - GitHubで新しいトークンを生成：Settings → Developer settings → Personal access tokens
   - 必要なスコープ: `repo`, `read:user`

2. Supabaseの設定確認
   - Authentication → URL Configuration
   - 以下のURLが追加されているか確認：
     - https://ana-app-web.vercel.app
     - http://localhost:3000