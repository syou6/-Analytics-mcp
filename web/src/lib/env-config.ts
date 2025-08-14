// Centralized environment configuration
// This file helps with environment variable issues on Vercel

export const envConfig = {
  // GitHub configuration
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  
  // Stripe configuration  
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  STRIPE_PRICE_ID: process.env.STRIPE_PRICE_ID,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  
  // Supabase configuration (already hardcoded in supabase-browser.ts)
  SUPABASE_URL: 'https://cvhiujltpzxhmknznmuq.supabase.co',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  
  // App configuration
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://ana-app-web.vercel.app',
  
  // Gemini API
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
};

// Helper to check if all required env vars are set
export function checkEnvVars() {
  const missing = [];
  
  if (!envConfig.GITHUB_TOKEN) missing.push('GITHUB_TOKEN');
  if (!envConfig.STRIPE_SECRET_KEY) missing.push('STRIPE_SECRET_KEY');
  if (!envConfig.STRIPE_PUBLISHABLE_KEY) missing.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
  
  return {
    isValid: missing.length === 0,
    missing,
  };
}