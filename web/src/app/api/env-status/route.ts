import { NextResponse } from 'next/server';
import { envConfig, checkEnvVars } from '@/lib/env-config';

export async function GET() {
  const envCheck = checkEnvVars();
  
  // Mask sensitive data
  const maskedConfig = {
    GITHUB_TOKEN: envConfig.GITHUB_TOKEN ? `${envConfig.GITHUB_TOKEN.substring(0, 10)}...` : 'NOT SET',
    STRIPE_SECRET_KEY: envConfig.STRIPE_SECRET_KEY ? `${envConfig.STRIPE_SECRET_KEY.substring(0, 10)}...` : 'NOT SET',
    STRIPE_PUBLISHABLE_KEY: envConfig.STRIPE_PUBLISHABLE_KEY ? `${envConfig.STRIPE_PUBLISHABLE_KEY.substring(0, 10)}...` : 'NOT SET',
    STRIPE_PRICE_ID: envConfig.STRIPE_PRICE_ID || 'NOT SET',
    APP_URL: envConfig.APP_URL,
    SUPABASE_URL: envConfig.SUPABASE_URL,
    GEMINI_API_KEY: envConfig.GEMINI_API_KEY ? 'SET' : 'NOT SET',
  };
  
  return NextResponse.json({
    status: envCheck.isValid ? 'OK' : 'MISSING_ENV_VARS',
    missing: envCheck.missing,
    config: maskedConfig,
    vercel: {
      isVercel: !!process.env.VERCEL,
      env: process.env.VERCEL_ENV,
    },
    help: envCheck.isValid ? null : 'Please set the missing environment variables in Vercel dashboard',
  });
}