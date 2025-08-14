import { NextResponse } from 'next/server';

export async function GET() {
  // Check if environment variables are loaded
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Mask the key for security but show enough to verify
  const maskedKey = key ? 
    `${key.substring(0, 40)}...${key.substring(key.length - 10)}` : 
    'NOT SET';
  
  return NextResponse.json({
    supabase_url: url || 'NOT SET',
    anon_key_preview: maskedKey,
    url_from_hardcoded: 'https://cvhiujltpzxhmknznmuq.supabase.co',
    key_length: key?.length || 0,
    env_vars_exist: {
      url: !!url,
      key: !!key,
    },
    vercel_env: process.env.VERCEL_ENV || 'not-vercel',
    node_env: process.env.NODE_ENV,
  });
}