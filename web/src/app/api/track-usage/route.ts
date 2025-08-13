import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )
  : null;

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ success: true });
    }

    const { userId, type } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ success: true });
    }

    // Get or create current month's usage record
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const { data: existingUsage } = await supabase
      .from('usage_tracking')
      .select('*')
      .eq('user_id', userId)
      .gte('period_start', currentMonth.toISOString())
      .single();

    if (existingUsage) {
      // Update existing record
      const updateData = type === 'ai' 
        ? { ai_analysis_count: (existingUsage.ai_analysis_count || 0) + 1 }
        : { analysis_count: (existingUsage.analysis_count || 0) + 1 };

      await supabase
        .from('usage_tracking')
        .update(updateData)
        .eq('id', existingUsage.id);
    } else {
      // Create new record
      const insertData = {
        user_id: userId,
        analysis_count: type === 'analysis' ? 1 : 0,
        ai_analysis_count: type === 'ai' ? 1 : 0,
        period_start: currentMonth.toISOString(),
        period_end: nextMonth.toISOString(),
      };

      await supabase
        .from('usage_tracking')
        .insert(insertData);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Usage tracking error:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message,
    });
  }
}