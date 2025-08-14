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
    console.log('=== CHECK-PAYMENT START ===');
    console.log('Timestamp:', new Date().toISOString());
    
    if (!stripe) {
      console.error('Stripe not configured');
      return NextResponse.json({ error: 'Payment processing not configured' }, { status: 503 });
    }

    const { sessionId, userId } = await request.json();
    console.log('Request data:', { sessionId, userId });
    
    if (!sessionId || !userId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('Stripe session:', {
      id: session.id,
      payment_status: session.payment_status,
      status: session.status,
      customer: session.customer,
      subscription: session.subscription,
      metadata: session.metadata
    });
    
    if (session.payment_status === 'paid' && session.status === 'complete') {
      console.log('Payment confirmed, checking existing subscription...');
      // Check if subscription already exists
      const { data: existingSubscription, error: selectError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      console.log('Existing subscription:', existingSubscription);
      console.log('Select error:', selectError?.message);

      if (!existingSubscription || existingSubscription.status !== 'active') {
        console.log('Creating/updating subscription...');
        // Create or update subscription record
        const subscriptionData = {
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          status: 'active',
          current_period_start: new Date(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          updated_at: new Date(),
        };

        // If no existing subscription, add created_at
        if (!existingSubscription) {
          (subscriptionData as any).created_at = new Date();
        }

        console.log('Upserting subscription data:', subscriptionData);
        
        const { data: upsertResult, error: subError } = await supabase
          .from('subscriptions')
          .upsert(subscriptionData, { onConflict: 'user_id' })
          .select();
        
        console.log('Upsert result:', upsertResult);
        
        if (subError) {
          console.error('Error creating subscription:', subError);
          console.error('Error details:', subError);
        } else {
          console.log('Subscription activated successfully for user:', userId);
          console.log('Created subscription:', upsertResult);
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
      }

      console.log('=== CHECK-PAYMENT END SUCCESS ===');
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