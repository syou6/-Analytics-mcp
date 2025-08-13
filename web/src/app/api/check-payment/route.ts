import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )
  : null;

export async function POST(request: NextRequest) {
  try {
    if (!stripe || !supabase) {
      return NextResponse.json({ error: 'Not configured' }, { status: 503 });
    }

    const { sessionId, userId } = await request.json();
    
    if (!sessionId || !userId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid' && session.status === 'complete') {
      // Check if subscription already exists
      const { data: existingSubscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!existingSubscription) {
        // Create subscription record if webhook hasn't processed yet
        await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            status: 'active',
            current_period_start: new Date(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            created_at: new Date(),
            updated_at: new Date(),
          });

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
      }

      return NextResponse.json({ 
        success: true, 
        subscription: 'active',
        message: 'Payment confirmed and subscription activated'
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Payment not completed'
      });
    }
  } catch (error: any) {
    console.error('Check payment error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to check payment status'
    }, { status: 500 });
  }
}