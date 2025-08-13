-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create usage tracking table
CREATE TABLE IF NOT EXISTS public.usage_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_count INTEGER DEFAULT 0,
  ai_analysis_count INTEGER DEFAULT 0,
  period_start TIMESTAMP WITH TIME ZONE DEFAULT date_trunc('month', NOW()),
  period_end TIMESTAMP WITH TIME ZONE DEFAULT (date_trunc('month', NOW()) + INTERVAL '1 month'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, period_start)
);

-- Create RLS policies
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- Subscriptions policies
CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions" ON public.subscriptions
  FOR ALL USING (auth.role() = 'service_role');

-- Usage tracking policies
CREATE POLICY "Users can view own usage" ON public.usage_tracking
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage usage" ON public.usage_tracking
  FOR ALL USING (auth.role() = 'service_role');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_usage_tracking_updated_at
  BEFORE UPDATE ON public.usage_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to check user's subscription status
CREATE OR REPLACE FUNCTION public.get_user_subscription_status(user_uuid UUID)
RETURNS TABLE (
  is_pro BOOLEAN,
  analyses_remaining INTEGER,
  ai_analyses_remaining INTEGER
) AS $$
DECLARE
  sub_status TEXT;
  usage_count INTEGER;
  ai_usage_count INTEGER;
BEGIN
  -- Get subscription status
  SELECT status INTO sub_status
  FROM public.subscriptions
  WHERE user_id = user_uuid
    AND status = 'active'
  ORDER BY created_at DESC
  LIMIT 1;

  -- Get current month usage
  SELECT analysis_count, ai_analysis_count 
  INTO usage_count, ai_usage_count
  FROM public.usage_tracking
  WHERE user_id = user_uuid
    AND period_start = date_trunc('month', NOW());

  -- Set defaults if no usage record
  IF usage_count IS NULL THEN
    usage_count := 0;
  END IF;
  IF ai_usage_count IS NULL THEN
    ai_usage_count := 0;
  END IF;

  -- Return subscription status and remaining analyses
  IF sub_status = 'active' THEN
    RETURN QUERY SELECT 
      TRUE as is_pro,
      GREATEST(100 - usage_count, 0) as analyses_remaining,
      GREATEST(100 - ai_usage_count, 0) as ai_analyses_remaining;
  ELSE
    RETURN QUERY SELECT 
      FALSE as is_pro,
      GREATEST(10 - usage_count, 0) as analyses_remaining,
      0 as ai_analyses_remaining;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;