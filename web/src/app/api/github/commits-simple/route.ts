import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const { owner, repo, days = 30 } = await request.json();

    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Owner and repo are required' },
        { status: 400 }
      );
    }

    // Calculate date range
    const until = new Date();
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Fetch commits using REST API
    const commitsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?since=${since.toISOString()}&until=${until.toISOString()}&per_page=100`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!commitsResponse.ok) {
      throw new Error('Failed to fetch commits');
    }

    const commits = await commitsResponse.json();

    // Process commits for heatmap
    const heatmapData = processCommitsForHeatmap(commits);
    const timeDistribution = processCommitsForTimeDistribution(commits);

    return NextResponse.json({
      totalCommits: commits.length,
      heatmap: heatmapData,
      timeDistribution,
      commits: commits.slice(0, 10), // Return first 10 commits for reference
    });
  } catch (error: any) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch GitHub data' },
      { status: 500 }
    );
  }
}

function processCommitsForHeatmap(commits: any[]) {
  // Create a map of date -> commit count
  const dateMap = new Map<string, number>();
  
  commits.forEach((commit) => {
    const date = new Date(commit.commit.author.date);
    const dateKey = date.toISOString().split('T')[0];
    dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + 1);
  });

  // Generate 52 weeks of data
  const weeks = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364); // 52 weeks ago
  
  for (let week = 0; week < 52; week++) {
    const weekData = [];
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + (week * 7) + day);
      const dateKey = currentDate.toISOString().split('T')[0];
      weekData.push(dateMap.get(dateKey) || 0);
    }
    weeks.push(weekData);
  }
  
  return weeks;
}

function processCommitsForTimeDistribution(commits: any[]) {
  // Create hourly distribution
  const hourlyCount = new Array(24).fill(0);
  
  commits.forEach((commit) => {
    const date = new Date(commit.commit.author.date);
    const hour = date.getHours();
    hourlyCount[hour]++;
  });
  
  return hourlyCount;
}