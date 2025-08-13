#!/usr/bin/env node

/**
 * Stripe Quick Setup Script
 * Node.jsでStripeの設定を自動化
 */

const readline = require('readline');
const fs = require('fs');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log('🚀 Stripe クイックセットアップ');
  console.log('================================\n');

  try {
    // 1. Stripe CLIがインストールされているか確認
    try {
      execSync('stripe --version', { stdio: 'ignore' });
      console.log('✅ Stripe CLIが検出されました\n');
    } catch {
      console.log('❌ Stripe CLIがインストールされていません');
      console.log('以下のコマンドでインストールしてください:');
      console.log('brew install stripe/stripe-cli/stripe\n');
      process.exit(1);
    }

    // 2. 必要な情報を収集
    console.log('📝 以下の情報を入力してください:\n');
    
    const config = {};
    
    // Stripeダッシュボードから取得
    console.log('Stripeダッシュボード (https://dashboard.stripe.com/test/apikeys) から:');
    config.STRIPE_SECRET_KEY = await question('シークレットキー (sk_test_...): ');
    config.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = await question('公開可能キー (pk_test_...): ');
    
    // アプリケーションURL
    config.NEXT_PUBLIC_APP_URL = await question('\nアプリケーションURL (デフォルト: http://localhost:3000): ') || 'http://localhost:3000';
    
    // Supabase
    console.log('\nSupabaseダッシュボード (Settings > API) から:');
    config.SUPABASE_SERVICE_ROLE_KEY = await question('サービスロールキー (eyJ...): ');

    // 3. 商品と価格を作成（CLIを使用）
    console.log('\n📦 商品と価格を作成中...');
    
    try {
      // 商品作成
      const productCmd = `stripe products create --name="GitHub Analytics Pro" --description="Unlimited analyses with AI-powered insights" --api-key="${config.STRIPE_SECRET_KEY}"`;
      const productResult = execSync(productCmd, { encoding: 'utf-8' });
      const productId = JSON.parse(productResult).id;
      console.log(`✅ 商品作成完了: ${productId}`);
      
      // 価格作成
      const priceCmd = `stripe prices create --product="${productId}" --unit-amount=980 --currency=jpy --recurring[interval]=month --api-key="${config.STRIPE_SECRET_KEY}"`;
      const priceResult = execSync(priceCmd, { encoding: 'utf-8' });
      config.STRIPE_PRICE_ID = JSON.parse(priceResult).id;
      console.log(`✅ 価格作成完了: ${config.STRIPE_PRICE_ID}`);
    } catch (error) {
      console.log('⚠️  商品作成でエラーが発生しました（既に存在する可能性があります）');
      config.STRIPE_PRICE_ID = await question('既存の価格ID (price_...): ');
    }

    // 4. ローカル開発用のWebhook
    console.log('\n🔗 ローカル開発用のWebhook設定');
    console.log('別のターミナルで以下を実行してください:');
    console.log('stripe listen --forward-to localhost:3000/api/stripe/webhook\n');
    config.STRIPE_WEBHOOK_SECRET = await question('表示されたWebhookシークレット (whsec_...): ');

    // 5. .env.localファイルを作成
    console.log('\n📝 .env.localファイルを作成中...');
    
    const envContent = `# Stripe Configuration
STRIPE_SECRET_KEY=${config.STRIPE_SECRET_KEY}
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${config.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
STRIPE_WEBHOOK_SECRET=${config.STRIPE_WEBHOOK_SECRET}
STRIPE_PRICE_ID=${config.STRIPE_PRICE_ID}

# Application URL
NEXT_PUBLIC_APP_URL=${config.NEXT_PUBLIC_APP_URL}

# Supabase
SUPABASE_SERVICE_ROLE_KEY=${config.SUPABASE_SERVICE_ROLE_KEY}
`;

    // 既存のファイルをバックアップ
    if (fs.existsSync('.env.local')) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      fs.copyFileSync('.env.local', `.env.local.backup.${timestamp}`);
      console.log('✅ 既存の.env.localをバックアップしました');
    }

    // 新しい設定を追加
    fs.appendFileSync('.env.local', '\n' + envContent);
    console.log('✅ .env.localファイルを更新しました');

    // 6. 完了メッセージ
    console.log('\n========================================');
    console.log('✅ セットアップが完了しました！');
    console.log('========================================\n');
    console.log('次のステップ:');
    console.log('1. Supabaseでテーブルを作成: setup-database.sql を実行');
    console.log('2. アプリケーションを再起動: npm run dev');
    console.log('3. テスト決済: カード番号 4242 4242 4242 4242');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
  } finally {
    rl.close();
  }
}

main();