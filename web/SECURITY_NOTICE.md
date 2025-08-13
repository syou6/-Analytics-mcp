# ⚠️ セキュリティ注意事項

## 重要：本番環境デプロイ前に必ず実施してください

### 1. GitHub Personal Access Tokenの再生成
現在のトークンは公開されている可能性があるため、必ず新しいトークンを生成してください。

**手順：**
1. https://github.com/settings/tokens にアクセス
2. 古いトークンを削除
3. 新しいトークンを生成（必要な権限: `repo`, `read:user`）
4. `.env.local`を更新

### 2. Gemini API Keyの再生成
同様にGemini APIキーも再生成を推奨します。

**手順：**
1. https://makersuite.google.com/app/apikey にアクセス
2. 新しいAPIキーを生成
3. `.env.local`を更新

### 3. Stripe APIキーの確認
テスト用キーから本番用キーに切り替えてください。

**手順：**
1. Stripeダッシュボードで本番用キーを取得
2. `.env.local`のキーを更新（`sk_live_`と`pk_live_`で始まるキー）

### 4. 環境変数の管理
**Vercelでのデプロイ時：**
- `.env.local`をGitにコミットしない
- Vercelダッシュボードで環境変数を設定
- Settings > Environment Variables から設定

**必須環境変数：**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
GITHUB_TOKEN
GEMINI_API_KEY
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_ID
NEXT_PUBLIC_APP_URL
```

### 5. .gitignoreの確認
`.env.local`が`.gitignore`に含まれていることを確認：
```
# local env files
.env*.local
```

## セキュリティベストプラクティス

1. **定期的なトークンローテーション** - 3ヶ月ごとに更新
2. **最小権限の原則** - 必要最小限の権限のみ付与
3. **アクセスログの監視** - 異常なアクセスパターンを監視
4. **環境ごとの分離** - 開発/ステージング/本番で異なるキーを使用

---

⚠️ **これらの対策を実施しないと、APIキーが悪用される可能性があります**