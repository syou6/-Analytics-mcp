import { NextRequest, NextResponse } from 'next/server';
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
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    console.log('=== CLEANUP SUBSCRIPTIONS START ===');
    console.log('User ID:', userId);

    // 1. Get all subscriptions for this user
    const { data: subscriptions, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching subscriptions:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    console.log(`Found ${subscriptions?.length || 0} subscriptions for user`);

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ 
        message: 'No subscriptions found',
        deletedCount: 0 
      });
    }

    // 2. Find the most recent valid subscription (with real Stripe IDs)
    const validSubscription = subscriptions.find(sub => 
      sub.stripe_customer_id?.startsWith('cus_') && 
      sub.stripe_subscription_id?.startsWith('sub_') &&
      sub.status === 'active'
    );

    if (!validSubscription) {
      console.log('No valid Stripe subscription found');
      return NextResponse.json({ 
        message: 'No valid Stripe subscription found',
        deletedCount: 0,
        subscriptions 
      });
    }

    console.log('Keeping valid subscription:', {
      id: validSubscription.id,
      stripe_customer_id: validSubscription.stripe_customer_id,
      stripe_subscription_id: validSubscription.stripe_subscription_id
    });

    // 3. Delete all other subscriptions
    const idsToDelete = subscriptions
      .filter(sub => sub.id !== validSubscription.id)
      .map(sub => sub.id);

    if (idsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('subscriptions')
        .delete()
        .in('id', idsToDelete);

      if (deleteError) {
        console.error('Error deleting duplicates:', deleteError);
        return NextResponse.json({ error: deleteError.message }, { status: 500 });
      }

      console.log(`Deleted ${idsToDelete.length} duplicate subscriptions`);
    }

    console.log('=== CLEANUP SUBSCRIPTIONS END ===');

    return NextResponse.json({ 
      success: true,
      message: 'Cleanup completed',
      keptSubscription: validSubscription,
      deletedCount: idsToDelete.length,
      deletedIds: idsToDelete
    });

  } catch (error: any) {
    console.error('Cleanup error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to cleanup subscriptions'
    }, { status: 500 });
  }
}