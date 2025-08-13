export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    limits: {
      reposPerMonth: 10,
      apiCallsPerDay: 50,
      exportEnabled: false,
      aiAnalysis: false,
      realtimeData: false,
      cacheHours: 24,
    },
    features: [
      '10 repos/month',
      'Basic statistics',
      '24-hour cache',
      'Community support',
    ],
  },
  pro: {
    name: 'Pro',
    price: 980,
    priceId: 'price_pro_monthly', // Stripe price ID
    limits: {
      reposPerMonth: 100,
      apiCallsPerDay: 500,
      exportEnabled: true,
      aiAnalysis: true,
      realtimeData: false,
      cacheHours: 6,
    },
    features: [
      '100 repos/month',
      'AI-powered insights',
      'CSV/JSON exports',
      '6-hour cache',
      'Email support',
      'Trend analysis',
    ],
  },
  business: {
    name: 'Business',
    price: 5000,
    priceId: 'price_business_monthly',
    limits: {
      reposPerMonth: -1, // unlimited
      apiCallsPerDay: -1,
      exportEnabled: true,
      aiAnalysis: true,
      realtimeData: true,
      cacheHours: 1,
      teamSeats: 5,
    },
    features: [
      'Unlimited repos',
      'Real-time data',
      'Advanced AI analysis',
      'Team sharing (5 seats)',
      'API access',
      'Priority support',
      'Custom integrations',
    ],
  },
};