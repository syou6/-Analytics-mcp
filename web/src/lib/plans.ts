// 🎉 期間限定キャンペーン: 全プラン無料！
export const CAMPAIGN = {
  active: true,
  title: '🎉 Launch Campaign: All Pro Features FREE!',
  titleJa: '🎉 ローンチキャンペーン：Pro機能が全て無料！',
  description: 'Limited time offer - Get $80/year value absolutely free',
  descriptionJa: '期間限定 - 年額12,000円相当が完全無料',
  endDate: null, // TBD
};

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    originalPrice: 0,
    limits: {
      reposPerMonth: CAMPAIGN.active ? -1 : 10,
      apiCallsPerDay: CAMPAIGN.active ? -1 : 50,
      exportEnabled: CAMPAIGN.active ? true : false,
      aiAnalysis: CAMPAIGN.active ? true : false,
      realtimeData: CAMPAIGN.active ? true : false,
      cacheHours: CAMPAIGN.active ? 1 : 24,
    },
    features: [
      '10 Repository Analyses/month',
      'Basic Statistics',
      'Language Breakdown',
      'Contributor List',
      '24-hour Data Cache',
    ],
  },
  pro: {
    name: 'Professional',
    price: CAMPAIGN.active ? 0 : 980,
    originalPrice: 980,
    priceUSD: CAMPAIGN.active ? 0 : 9.8,
    originalPriceUSD: 9.8,
    limits: {
      reposPerMonth: -1,
      apiCallsPerDay: -1,
      exportEnabled: true,
      aiAnalysis: true,
      realtimeData: true,
      cacheHours: 1,
    },
    features: [
      'Unlimited Repository Analyses',
      'AI-Powered Insights (Gemini)',
      'Commit Heatmaps',
      'Time Distribution Charts',
      'Personal Branding Tools',
      'Portfolio Generation',
      'Public Dashboard Sharing',
      'Priority Support',
    ],
    popular: true,
  },
  enterprise: {
    name: 'Enterprise',
    price: CAMPAIGN.active ? 0 : 5000,
    originalPrice: 5000,
    priceUSD: CAMPAIGN.active ? 0 : 50,
    originalPriceUSD: 50,
    limits: {
      reposPerMonth: -1,
      apiCallsPerDay: -1,
      exportEnabled: true,
      aiAnalysis: true,
      realtimeData: true,
      cacheHours: 0.5,
      teamSeats: 5,
    },
    features: [
      'Everything in Pro',
      'Team Collaboration (5 seats)',
      'Custom API Access',
      'Dedicated Support',
      'Custom Integrations',
      'SLA Guarantee',
      'Advanced Analytics',
    ],
  },
};