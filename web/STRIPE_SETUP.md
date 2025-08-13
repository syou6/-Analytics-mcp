# Stripe Integration Setup Guide

## Prerequisites
- Stripe account (create one at https://stripe.com)
- Supabase project with authentication set up
- Next.js application running

## Step 1: Get Your Stripe Keys
1. Log in to your Stripe Dashboard
2. Navigate to Developers > API keys
3. Copy your **Secret key** (starts with `sk_`)
4. Copy your **Publishable key** (starts with `pk_`)

## Step 2: Create a Product and Price
1. Go to Products in your Stripe Dashboard
2. Click "Add product"
3. Set up your product:
   - Name: `GitHub Analytics Pro`
   - Description: `Unlimited analyses with AI-powered insights`
   - Pricing: ¥980 per month
4. Copy the Price ID (starts with `price_`)

## Step 3: Set Up Webhook
1. Go to Developers > Webhooks
2. Click "Add endpoint"
3. Set endpoint URL: `https://your-domain.com/api/stripe/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the Webhook signing secret (starts with `whsec_`)

## Step 4: Configure Environment Variables
Add these to your `.env.local`:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_actual_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key
STRIPE_WEBHOOK_SECRET=whsec_your_actual_secret
STRIPE_PRICE_ID=price_your_actual_price_id

# Application URL
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Supabase Service Role Key (needed for webhook)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Step 5: Set Up Database Tables
Run these SQL commands in your Supabase SQL editor:

```sql
-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create usage tracking table
CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_count INTEGER DEFAULT 0,
  ai_analysis_count INTEGER DEFAULT 0,
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, period_start)
);

-- Create indexes for better performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_usage_tracking_user_id ON usage_tracking(user_id);
CREATE INDEX idx_usage_tracking_period ON usage_tracking(period_start, period_end);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own usage" ON usage_tracking
  FOR SELECT USING (auth.uid() = user_id);

-- Service role can do everything (for webhook)
CREATE POLICY "Service role full access subscriptions" ON subscriptions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access usage" ON usage_tracking
  FOR ALL USING (auth.role() = 'service_role');
```

## Step 6: Test Your Integration

### Test Mode
1. Use Stripe test keys (they start with `sk_test_` and `pk_test_`)
2. Use test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Requires authentication: `4000 0025 0000 3155`

### Testing Webhooks Locally
Use Stripe CLI for local testing:
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Production Checklist
- [ ] Switch to live Stripe keys
- [ ] Update webhook endpoint URL to production domain
- [ ] Enable webhook signature verification
- [ ] Set up proper error handling and logging
- [ ] Configure email notifications for payment failures
- [ ] Test the complete payment flow
- [ ] Set up monitoring and alerts

## Troubleshooting

### Common Issues

1. **Webhook signature verification fails**
   - Make sure you're using the correct webhook secret
   - Ensure raw body is being passed (no JSON parsing before verification)

2. **Subscription not updating**
   - Check Supabase RLS policies
   - Verify service role key is correct
   - Check webhook logs in Stripe Dashboard

3. **Checkout session not redirecting**
   - Verify NEXT_PUBLIC_APP_URL is correct
   - Check browser console for errors

## Support
For issues with:
- Stripe: https://stripe.com/docs
- Supabase: https://supabase.com/docs
- This integration: Create an issue in the repository