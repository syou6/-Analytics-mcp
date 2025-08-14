-- Manual Pro activation for user
-- Replace USER_ID with your actual user ID: 8cd48d0a-8440-4781-ac46-e3adb274a888

-- First, check if subscription exists
SELECT * FROM public.subscriptions WHERE user_id = '8cd48d0a-8440-4781-ac46-e3adb274a888';

-- If no subscription exists, create one:
INSERT INTO public.subscriptions (
  user_id,
  stripe_customer_id,
  stripe_subscription_id,
  status,
  current_period_start,
  current_period_end,
  created_at,
  updated_at
) VALUES (
  '8cd48d0a-8440-4781-ac46-e3adb274a888',
  'manual_customer_' || EXTRACT(EPOCH FROM NOW())::text,
  'manual_sub_' || EXTRACT(EPOCH FROM NOW())::text,
  'active',
  NOW(),
  NOW() + INTERVAL '30 days',
  NOW(),
  NOW()
);

-- Or if subscription exists but inactive, update it:
UPDATE public.subscriptions 
SET 
  status = 'active',
  current_period_start = NOW(),
  current_period_end = NOW() + INTERVAL '30 days',
  updated_at = NOW()
WHERE user_id = '8cd48d0a-8440-4781-ac46-e3adb274a888';

-- Initialize usage tracking
INSERT INTO public.usage_tracking (
  user_id,
  analysis_count,
  ai_analysis_count,
  period_start,
  period_end,
  created_at,
  updated_at
) VALUES (
  '8cd48d0a-8440-4781-ac46-e3adb274a888',
  0,
  0,
  DATE_TRUNC('month', NOW()),
  DATE_TRUNC('month', NOW()) + INTERVAL '1 month',
  NOW(),
  NOW()
) ON CONFLICT (user_id, period_start) 
DO UPDATE SET
  updated_at = NOW();

-- Verify the subscription
SELECT * FROM public.subscriptions WHERE user_id = '8cd48d0a-8440-4781-ac46-e3adb274a888';