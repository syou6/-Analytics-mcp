import Stripe from 'stripe';

// Only initialize Stripe if the secret key is available
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-07-30.basil',
      typescript: true,
    })
  : null;

export const getStripeJs = async () => {
  const { loadStripe } = await import('@stripe/stripe-js');
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
};

export const PLANS = {
  free: {
    name: 'Free Plan',
    price: 0,
    currency: 'jpy',
    interval: null,
    features: {
      analysesPerMonth: 10,
      aiAnalysis: false,
      exportData: false,
      cacheDuration: 24, // hours
      prioritySupport: false,
    },
  },
  pro_monthly: {
    name: 'Pro Plan',
    price: 1500,
    currency: 'jpy',
    interval: 'month',
    priceId: process.env.STRIPE_PRICE_ID_MONTHLY,
    features: {
      analysesPerMonth: 100,
      aiAnalysis: true,
      exportData: true,
      cacheDuration: 6, // hours
      prioritySupport: true,
    },
  },
  pro_yearly: {
    name: 'Pro Plan (Annual)',
    price: 15000,
    currency: 'jpy',
    interval: 'year',
    priceId: process.env.STRIPE_PRICE_ID_YEARLY,
    features: {
      analysesPerMonth: 100,
      aiAnalysis: true,
      exportData: true,
      cacheDuration: 6, // hours
      prioritySupport: true,
    },
  },
};