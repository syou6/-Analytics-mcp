import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

// Store public dashboards in memory (in production, use database)
const publicDashboards = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const { analysis, contributors, languages, activity } = await request.json();
    
    // Generate unique public ID
    const dashboardData = {
      analysis,
      contributors,
      languages,
      activity,
      createdAt: new Date().toISOString(),
      views: 0,
    };
    
    // Create hash for unique URL
    const hash = createHash('sha256')
      .update(JSON.stringify(dashboardData) + Date.now())
      .digest('hex')
      .substring(0, 12);
    
    // Store dashboard data
    publicDashboards.set(hash, dashboardData);
    
    // In production, store in database
    // await supabase.from('public_dashboards').insert({ id: hash, data: dashboardData });
    
    return NextResponse.json({
      publicId: hash,
      url: `/public/${hash}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create public dashboard' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Dashboard ID required' },
        { status: 400 }
      );
    }
    
    const dashboard = publicDashboards.get(id);
    
    if (!dashboard) {
      return NextResponse.json(
        { error: 'Dashboard not found' },
        { status: 404 }
      );
    }
    
    // Increment views
    dashboard.views++;
    
    return NextResponse.json(dashboard);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch dashboard' },
      { status: 500 }
    );
  }
}