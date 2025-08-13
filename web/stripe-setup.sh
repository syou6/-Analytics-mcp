#!/bin/bash

echo "🚀 Stripe セットアップスクリプト"
echo "================================"

# カラー定義
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# .env.localファイルのパス
ENV_FILE=".env.local"

# 1. Stripe CLIログイン確認
echo -e "\n${BLUE}1. Stripe CLIのログイン状態を確認中...${NC}"
if ! stripe config --list &>/dev/null; then
    echo -e "${YELLOW}Stripeにログインしてください${NC}"
    echo "ブラウザが開きます..."
    stripe login
else
    echo -e "${GREEN}✅ Stripeにログイン済み${NC}"
fi

# 2. アカウント情報の取得
echo -e "\n${BLUE}2. Stripeアカウント情報を取得中...${NC}"
ACCOUNT_ID=$(stripe config --list | grep account_id | awk '{print $2}')
if [ -z "$ACCOUNT_ID" ]; then
    echo -e "${RED}❌ アカウントIDが取得できませんでした${NC}"
    exit 1
fi
echo -e "${GREEN}✅ アカウントID: $ACCOUNT_ID${NC}"

# 3. APIキーの取得（テスト環境）
echo -e "\n${BLUE}3. APIキーを取得中...${NC}"
echo -e "${YELLOW}注意: このスクリプトはテスト環境のキーを使用します${NC}"

# Stripe CLIはAPIキーを直接取得できないため、手動入力が必要
echo -e "\n${YELLOW}Stripeダッシュボードから以下の情報を取得してください:${NC}"
echo "1. https://dashboard.stripe.com/test/apikeys にアクセス"
echo "2. 以下のキーをコピー:"
echo ""

# シークレットキーの入力
echo -n "シークレットキー (sk_test_...): "
read -s STRIPE_SECRET_KEY
echo ""

# 公開可能キーの入力
echo -n "公開可能キー (pk_test_...): "
read STRIPE_PUBLISHABLE_KEY

# 4. 商品と価格の作成
echo -e "\n${BLUE}4. 商品と価格を作成中...${NC}"

# 商品を作成
PRODUCT_RESPONSE=$(stripe products create \
  --name="GitHub Analytics Pro" \
  --description="Unlimited analyses with AI-powered insights" \
  2>/dev/null)

if [ $? -eq 0 ]; then
    PRODUCT_ID=$(echo "$PRODUCT_RESPONSE" | grep '"id"' | head -1 | cut -d'"' -f4)
    echo -e "${GREEN}✅ 商品作成完了: $PRODUCT_ID${NC}"
    
    # 価格を作成（¥980/月）
    PRICE_RESPONSE=$(stripe prices create \
      --product="$PRODUCT_ID" \
      --unit-amount=980 \
      --currency=jpy \
      --recurring[interval]=month \
      2>/dev/null)
    
    if [ $? -eq 0 ]; then
        PRICE_ID=$(echo "$PRICE_RESPONSE" | grep '"id"' | head -1 | cut -d'"' -f4)
        echo -e "${GREEN}✅ 価格作成完了: $PRICE_ID${NC}"
    else
        echo -e "${RED}❌ 価格の作成に失敗しました${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  商品が既に存在する可能性があります${NC}"
    echo -n "既存の価格ID (price_...): "
    read PRICE_ID
fi

# 5. Webhookエンドポイントの作成
echo -e "\n${BLUE}5. Webhookエンドポイントを設定中...${NC}"
echo -n "本番環境のURL (例: https://your-app.vercel.app): "
read APP_URL

if [ ! -z "$APP_URL" ]; then
    WEBHOOK_RESPONSE=$(stripe webhook_endpoints create \
      --url="${APP_URL}/api/stripe/webhook" \
      --enabled-events checkout.session.completed,customer.subscription.updated,customer.subscription.deleted,invoice.payment_succeeded,invoice.payment_failed \
      2>/dev/null)
    
    if [ $? -eq 0 ]; then
        WEBHOOK_SECRET=$(echo "$WEBHOOK_RESPONSE" | grep '"secret"' | cut -d'"' -f4)
        echo -e "${GREEN}✅ Webhookエンドポイント作成完了${NC}"
    else
        echo -e "${YELLOW}⚠️  Webhookエンドポイントが既に存在する可能性があります${NC}"
    fi
fi

# ローカル開発用のWebhook設定
echo -e "\n${BLUE}6. ローカル開発用のWebhook設定${NC}"
echo -e "${YELLOW}ローカル開発時は別ターミナルで以下を実行してください:${NC}"
echo "stripe listen --forward-to localhost:3000/api/stripe/webhook"
echo ""
echo -n "ローカル開発用のWebhookシークレット (whsec_...) [スキップする場合はEnter]: "
read LOCAL_WEBHOOK_SECRET

if [ ! -z "$LOCAL_WEBHOOK_SECRET" ]; then
    WEBHOOK_SECRET=$LOCAL_WEBHOOK_SECRET
fi

# 6. .env.localファイルの作成/更新
echo -e "\n${BLUE}7. .env.localファイルを更新中...${NC}"

# バックアップ作成
if [ -f "$ENV_FILE" ]; then
    cp "$ENV_FILE" "${ENV_FILE}.backup.$(date +%Y%m%d%H%M%S)"
    echo -e "${GREEN}✅ 既存の.env.localをバックアップしました${NC}"
fi

# Stripe設定を追加/更新
cat >> "$ENV_FILE" << EOF

# ========================================
# Stripe Configuration (自動生成: $(date))
# ========================================
STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY}
STRIPE_WEBHOOK_SECRET=${WEBHOOK_SECRET:-whsec_REPLACE_ME}
STRIPE_PRICE_ID=${PRICE_ID}

# Application URL
NEXT_PUBLIC_APP_URL=${APP_URL:-http://localhost:3000}
EOF

echo -e "${GREEN}✅ .env.localファイルを更新しました${NC}"

# 7. Supabaseの設定確認
echo -e "\n${BLUE}8. Supabaseの設定${NC}"
echo -e "${YELLOW}Supabaseのサービスロールキーが必要です${NC}"
echo "1. https://app.supabase.com のプロジェクトにアクセス"
echo "2. Settings > API から Service Role Key をコピー"
echo ""
echo -n "Supabaseサービスロールキー (eyJ...): "
read -s SUPABASE_SERVICE_KEY
echo ""

if [ ! -z "$SUPABASE_SERVICE_KEY" ]; then
    echo "SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_KEY}" >> "$ENV_FILE"
    echo -e "${GREEN}✅ Supabaseキーを追加しました${NC}"
fi

# 8. 完了メッセージ
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Stripeセットアップが完了しました！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "次のステップ:"
echo "1. Supabaseでデータベーステーブルを作成:"
echo "   ${BLUE}psql setup-database.sql${NC}"
echo ""
echo "2. アプリケーションを再起動:"
echo "   ${BLUE}npm run dev${NC}"
echo ""
echo "3. ローカルでテストする場合は別ターミナルで:"
echo "   ${BLUE}stripe listen --forward-to localhost:3000/api/stripe/webhook${NC}"
echo ""
echo -e "${YELLOW}テスト用カード番号: 4242 4242 4242 4242${NC}"
echo ""

# 設定内容の確認
echo "設定された値:"
echo "- 商品ID: $PRODUCT_ID"
echo "- 価格ID: $PRICE_ID"
echo "- Webhook: ${APP_URL}/api/stripe/webhook"