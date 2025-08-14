import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { envConfig } from '@/lib/env-config';

const supabase = createClient(
  'https://cvhiujltpzxhmknznmuq.supabase.co',
  envConfig.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2aGl1amx0cHp4aG1rbnpubXVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA0OTkxNywiZXhwIjoyMDcwNjI1OTE3fQ.teNeiAAYG6qKVTlG9yx3dC9HVYFBCqjU0wqXJvCn_J8'
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get subscription data
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId);

    // Get usage data
    const { data: usage, error: usageError } = await supabase
      .from('usage_tracking')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    // Get user data
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId);

    return NextResponse.json({
      user: {
        id: user?.id,
        email: user?.email,
        created_at: user?.created_at,
      },
      subscription: subscription || [],
      subscription_error: subError?.message,
      usage: usage || [],
      usage_error: usageError?.message,
      debug: {
        tables_exist: {
          subscriptions: !subError?.message?.includes('does not exist'),
          usage_tracking: !usageError?.message?.includes('does not exist'),
        },
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error: any) {
    console.error('Debug subscription error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to debug subscription'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Manually create a test subscription
    const { data, error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        stripe_customer_id: 'manual_test_' + Date.now(),
        stripe_subscription_id: 'manual_sub_' + Date.now(),
        status: 'active',
        current_period_start: new Date(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        created_at: new Date(),
        updated_at: new Date(),
      })
      .select()
      .single();

    if (error) {
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
      message: 'Manual subscription created'
    });
  } catch (error: any) {
    console.error('Manual subscription error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to create manual subscription'
    }, { status: 500 });
  }
}