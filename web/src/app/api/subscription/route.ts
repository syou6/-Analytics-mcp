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
      return NextResponse.json({ 
        isPro: false,
        analysesRemaining: 10,
        aiAnalysesRemaining: 0,
      });
    }

    // Get subscription status
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, current_period_end')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    // Get current usage
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const { data: usage } = await supabase
      .from('usage_tracking')
      .select('analysis_count, ai_analysis_count')
      .eq('user_id', userId)
      .gte('period_start', currentMonth.toISOString())
      .single();

    const isPro = subscription?.status === 'active';
    const analysisCount = usage?.analysis_count || 0;
    const aiAnalysisCount = usage?.ai_analysis_count || 0;

    const limits = isPro ? {
      analyses: 100,
      aiAnalyses: 100,
    } : {
      analyses: 10,
      aiAnalyses: 0,
    };

    return NextResponse.json({
      isPro,
      analysesRemaining: Math.max(0, limits.analyses - analysisCount),
      aiAnalysesRemaining: Math.max(0, limits.aiAnalyses - aiAnalysisCount),
      subscription: subscription ? {
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
      } : null,
      usage: {
        analyses: analysisCount,
        aiAnalyses: aiAnalysisCount,
      },
      limits,
    });
  } catch (error: any) {
    console.error('Subscription check error:', error);
    return NextResponse.json({ 
      isPro: false,
      analysesRemaining: 10,
      aiAnalysesRemaining: 0,
      error: error.message,
    });
  }
}