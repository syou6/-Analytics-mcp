import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://cvhiujltpzxhmknznmuq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2aGl1amx0cHp4aG1rbnpubXVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA0OTkxNywiZXhwIjoyMDcwNjI1OTE3fQ.teNeiAAYG6qKVTlG9yx3dC9HVYFBCqjU0wqXJvCn_J8',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: NextRequest) {
  try {
    const { sessionId, userId } = await request.json();
    
    const debugInfo: any = {
      timestamp: new Date().toISOString(),
      userId,
      sessionId
    };

    // 1. Check Stripe session
    if (sessionId && stripe) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
          expand: ['subscription', 'customer']
        });
        
        debugInfo.stripeSession = {
          id: session.id,
          payment_status: session.payment_status,
          status: session.status,
          customer: session.customer,
          subscription: session.subscription,
          metadata: session.metadata,
          amount_total: session.amount_total,
          currency: session.currency
        };
      } catch (e: any) {
        debugInfo.stripeError = e.message;
      }
    }

    // 2. Check Supabase subscriptions table
    if (userId) {
      const { data: subscriptions, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId);
      
      debugInfo.supabaseSubscriptions = {
        data: subscriptions,
        error: subError?.message,
        count: subscriptions?.length || 0
      };

      // Check usage tracking
      const { data: usage, error: usageError } = await supabase
        .from('usage_tracking')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);
      
      debugInfo.usageTracking = {
        data: usage,
        error: usageError?.message
      };
    }

    // 3. Test subscription creation
    if (userId && sessionId && stripe) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      if (session.payment_status === 'paid' && session.status === 'complete') {
        debugInfo.paymentConfirmed = true;
        
        // Try to create subscription
        const subscriptionData = {
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string || 'manual_' + Date.now(),
          status: 'active',
          current_period_start: new Date(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          updated_at: new Date(),
          created_at: new Date()
        };
        
        debugInfo.attemptedSubscriptionData = subscriptionData;
        
        const { data: upsertResult, error: upsertError } = await supabase
          .from('subscriptions')
          .upsert(subscriptionData, { 
            onConflict: 'user_id',
            ignoreDuplicates: false 
          })
          .select();
        
        debugInfo.upsertResult = {
          data: upsertResult,
          error: upsertError?.message
        };
      }
    }

    // 4. Re-check subscription status
    if (userId) {
      const { data: finalCheck } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();
      
      debugInfo.finalSubscriptionCheck = finalCheck;
    }

    return NextResponse.json(debugInfo);
  } catch (error: any) {
    console.error('Debug payment error:', error);
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}