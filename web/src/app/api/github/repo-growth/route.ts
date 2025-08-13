import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const { owner, repo } = await request.json();

    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Owner and repo are required' },
        { status: 400 }
      );
    }

    // Fetch repository data
    const repoResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!repoResponse.ok) {
      throw new Error('Failed to fetch repository data');
    }

    const repoData = await repoResponse.json();

    // Fetch recent stargazers (with timestamps if available)
    const stargazersResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/stargazers?per_page=100`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.star+json', // To get starred_at timestamp
        },
      }
    );

    let recentStargazers = [];
    if (stargazersResponse.ok) {
      const stargazers = await stargazersResponse.json();
      recentStargazers = stargazers.map((s: any) => ({
        starred_at: s.starred_at,
        user: s.user?.login,
        avatar: s.user?.avatar_url,
      }));
    }

    // Fetch recent issues
    const issuesResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=30`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    let issuesData = { open: 0, closed: 0, total: 0 };
    if (issuesResponse.ok) {
      const issues = await issuesResponse.json();
      issuesData = {
        open: issues.filter((i: any) => i.state === 'open').length,
        closed: issues.filter((i: any) => i.state === 'closed').length,
        total: issues.length,
      };
    }

    // Fetch recent forks
    const forksResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/forks?sort=newest&per_page=30`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    let recentForks = [];
    if (forksResponse.ok) {
      const forks = await forksResponse.json();
      recentForks = forks.map((f: any) => ({
        created_at: f.created_at,
        owner: f.owner?.login,
        avatar: f.owner?.avatar_url,
      }));
    }

    // Calculate growth metrics
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const weeklyStars = recentStargazers.filter(
      (s: any) => s.starred_at && new Date(s.starred_at) > sevenDaysAgo
    ).length;

    const monthlyStars = recentStargazers.filter(
      (s: any) => s.starred_at && new Date(s.starred_at) > thirtyDaysAgo
    ).length;

    const weeklyForks = recentForks.filter(
      (f: any) => new Date(f.created_at) > sevenDaysAgo
    ).length;

    const monthlyForks = recentForks.filter(
      (f: any) => new Date(f.created_at) > thirtyDaysAgo
    ).length;

    // Generate trend data
    const starTrend = calculateTrend(monthlyStars, weeklyStars);
    const forkTrend = calculateTrend(monthlyForks, weeklyForks);

    // Generate chart data
    const chartData = generateChartData(recentStargazers, recentForks);

    return NextResponse.json({
      stats: {
        stars: {
          total: repoData.stargazers_count || 0,
          weekly: weeklyStars,
          monthly: monthlyStars,
          trend: starTrend,
        },
        forks: {
          total: repoData.forks_count || 0,
          weekly: weeklyForks,
          monthly: monthlyForks,
          trend: forkTrend,
        },
        watchers: {
          total: repoData.subscribers_count || 0,
          trend: 0, // Can't calculate without historical data
        },
        issues: {
          open: repoData.open_issues_count || 0,
          closed: issuesData.closed,
          total: issuesData.total,
        },
      },
      chartData,
      recentActivity: {
        stargazers: recentStargazers.slice(0, 5),
        forks: recentForks.slice(0, 5),
      },
      repository: {
        name: repoData.name,
        description: repoData.description,
        created_at: repoData.created_at,
        updated_at: repoData.updated_at,
        language: repoData.language,
        topics: repoData.topics || [],
      },
    });
  } catch (error: any) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch repository growth data' },
      { status: 500 }
    );
  }
}

function calculateTrend(monthly: number, weekly: number): number {
  if (monthly === 0) return 0;
  const weeklyAverage = monthly / 4;
  if (weekly > weeklyAverage * 1.2) return 15;
  if (weekly > weeklyAverage) return 8;
  if (weekly < weeklyAverage * 0.8) return -10;
  if (weekly < weeklyAverage) return -5;
  return 0;
}

function generateChartData(stargazers: any[], forks: any[]) {
  // Generate last 12 months of data
  const months = [];
  const now = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    
    const starsInMonth = stargazers.filter((s: any) => {
      if (!s.starred_at) return false;
      const starDate = new Date(s.starred_at);
      return starDate >= date && starDate < nextMonth;
    }).length;
    
    const forksInMonth = forks.filter((f: any) => {
      const forkDate = new Date(f.created_at);
      return forkDate >= date && forkDate < nextMonth;
    }).length;
    
    months.push({
      month: date.toLocaleString('en', { month: 'short' }),
      stars: starsInMonth,
      forks: forksInMonth,
    });
  }
  
  return months;
}