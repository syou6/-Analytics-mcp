import { NextResponse } from 'next/server';

export async function GET() {
  // Decode the anon key to check its claims
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  try {
    // JWT structure: header.payload.signature
    const parts = anonKey.split('.');
    if (parts.length !== 3) {
      return NextResponse.json({ error: 'Invalid JWT format' });
    }
    
    // Decode the payload (base64url)
    const payload = JSON.parse(
      Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()
    );
    
    return NextResponse.json({
      jwt_payload: payload,
      supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      jwt_ref: payload.ref,
      jwt_role: payload.role,
      jwt_iat: new Date(payload.iat * 1000).toISOString(),
      jwt_exp: new Date(payload.exp * 1000).toISOString(),
      matches_url: process.env.NEXT_PUBLIC_SUPABASE_URL?.includes(payload.ref),
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Failed to decode JWT',
      message: error.message 
    });
  }
}