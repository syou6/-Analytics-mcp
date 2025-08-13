import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payment processing is not configured' },
        { status: 503 }
      );
    }

    const { userId, userEmail, priceId } = await request.json();
    
    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: 'User information is required' },
        { status: 400 }
      );
    }

    // Create or use price ID for ¥980/month subscription
    const finalPriceId = priceId || process.env.STRIPE_PRICE_ID;
    
    if (!finalPriceId) {
      // Create a price if not configured
      const price = await stripe.prices.create({
        currency: 'jpy',
        unit_amount: 980,
        recurring: {
          interval: 'month',
        },
        product_data: {
          name: 'GitHub Analytics Pro',
        },
      });
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
        customer_email: userEmail,
        metadata: {
          user_id: userId,
        },
        subscription_data: {
          metadata: {
            user_id: userId,
          },
        },
      });

      return NextResponse.json({ sessionId: session.id, url: session.url });
    }

    // Create checkout session with existing price
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: finalPriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
      customer_email: userEmail,
      metadata: {
        user_id: userId,
      },
      subscription_data: {
        metadata: {
          user_id: userId,
        },
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Checkout session error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}