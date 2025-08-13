# Vercel設定確認チェックリスト

## 1. Vercelダッシュボードで確認

### Settings → Git
- [ ] **Connected Git Repository**: `syou6/-Analytics-mcp` になっているか
  - もし `syou6/ANA--app` になっている場合は、切断して再接続が必要
- [ ] **Production Branch**: `main`
- [ ] **Root Directory**: `web`
- [ ] **Auto-deploy**: Enabled

### もしリポジトリが違う場合の修正手順：
1. Settings → Git → Disconnect
2. "Connect Git Repository" をクリック
3. GitHubから `syou6/-Analytics-mcp` を選択
4. Import

## 2. GitHub側で確認

GitHubリポジトリ → Settings → Webhooks で：
- Vercelのwebhookが存在するか確認
- 最近のdeliveryが成功しているか確認

## 3. 手動デプロイ

Vercelダッシュボードから：
1. プロジェクトのページで "..." メニュー
2. "Redeploy" をクリック
3. "Use existing Build Cache" のチェックを外す
4. "Redeploy" を実行

## 4. もし全て失敗する場合

新しいプロジェクトとしてインポート：
1. Vercelダッシュボード → "Add New" → "Project"
2. GitHub リポジトリ `syou6/-Analytics-mcp` を選択
3. Root Directory: `web` を設定
4. 環境変数を全て設定
5. Deploy

## 必要な環境変数（再確認）
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- GITHUB_TOKEN
- GEMINI_API_KEY
- STRIPE_SECRET_KEY
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- STRIPE_WEBHOOK_SECRET
- STRIPE_PRICE_ID
- NEXT_PUBLIC_APP_URL (デプロイURL)
- SUPABASE_SERVICE_ROLE_KEY