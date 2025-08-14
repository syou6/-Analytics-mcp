import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { envConfig } from '@/lib/env-config';

const supabase = createClient(
  'https://cvhiujltpzxhmknznmuq.supabase.co',
  envConfig.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2aGl1amx0cHp4aG1rbnpubXVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA0OTkxNywiZXhwIjoyMDcwNjI1OTE3fQ.teNeiAAYG6qKVTlG9yx3dC9HVYFBCqjU0wqXJvCn_J8'
);

export async function POST(request: NextRequest) {
  try {
    const { userId, customerId, subscriptionId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Create or update subscription
    const { data, error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        stripe_customer_id: customerId || 'test_customer_' + Date.now(),
        stripe_subscription_id: subscriptionId || 'test_sub_' + Date.now(),
        status: 'active',
        current_period_start: new Date(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        created_at: new Date(),
        updated_at: new Date(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating subscription:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Initialize usage tracking
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    await supabase
      .from('usage_tracking')
      .upsert({
        user_id: userId,
        analysis_count: 0,
        ai_analysis_count: 0,
        period_start: currentMonth.toISOString(),
        period_end: nextMonth.toISOString(),
      });

    return NextResponse.json({ 
      success: true, 
      subscription: data,
      message: 'Test subscription created successfully'
    });
  } catch (error: any) {
    console.error('Simulate webhook error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to simulate webhook'
    }, { status: 500 });
  }
}