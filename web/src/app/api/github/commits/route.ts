import { NextRequest, NextResponse } from 'next/server';
import { envConfig } from '@/lib/env-config';

const GITHUB_TOKEN = envConfig.GITHUB_TOKEN;

export async function POST(request: NextRequest) {
  try {
    if (!GITHUB_TOKEN) {
      console.error('GitHub token not configured');
      return NextResponse.json(
        { error: 'GitHub API not configured. Please check environment variables.' },
        { status: 500 }
      );
    }

    const { owner, repo, days = 30 } = await request.json();

    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Owner and repo are required' },
        { status: 400 }
      );
    }

    // Calculate date range
    const until = new Date().toISOString();
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    // GraphQL query for commit history
    const query = `
      query($owner: String!, $name: String!, $since: GitTimestamp!, $until: GitTimestamp!) {
        repository(owner: $owner, name: $name) {
          defaultBranchRef {
            target {
              ... on Commit {
                history(since: $since, until: $until, first: 100) {
                  totalCount
                  edges {
                    node {
                      committedDate
                      additions
                      deletions
                      author {
                        name
                        email
                        user {
                          login
                          avatarUrl
                        }
                      }
                      message
                    }
                  }
                  pageInfo {
                    hasNextPage
                    endCursor
                  }
                }
              }
            }
          }
          contributorsConnection(first: 100) {
            totalCount
            edges {
              node {
                login
                avatarUrl
                contributionsCollection {
                  contributionCalendar {
                    totalContributions
                    weeks {
                      contributionDays {
                        contributionCount
                        date
                      }
                    }
                  }
                  commitContributionsByRepository(maxRepositories: 1) {
                    contributions {
                      totalCount
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { owner, name: repo, since, until }
      }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return NextResponse.json({ error: 'Failed to fetch commit data' }, { status: 500 });
    }

    // Process commit data for heatmap
    const commits = data.data?.repository?.defaultBranchRef?.target?.history?.edges || [];
    const heatmapData = processCommitsForHeatmap(commits);
    const timeDistribution = processCommitsForTimeDistribution(commits);
    const monthlyStats = processMonthlyStats(commits);

    return NextResponse.json({
      totalCommits: data.data?.repository?.defaultBranchRef?.target?.history?.totalCount || 0,
      heatmap: heatmapData,
      timeDistribution,
      monthlyStats,
      commits: commits.map((edge: any) => edge.node),
      contributorsCount: data.data?.repository?.contributorsConnection?.totalCount || 0,
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
  
  commits.forEach(({ node }) => {
    const date = new Date(node.committedDate);
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
  
  commits.forEach(({ node }) => {
    const date = new Date(node.committedDate);
    const hour = date.getHours();
    hourlyCount[hour]++;
  });
  
  return hourlyCount;
}

function processMonthlyStats(commits: any[]) {
  const monthlyStats = new Map<string, {
    commits: number;
    additions: number;
    deletions: number;
    authors: Set<string>;
  }>();

  commits.forEach(({ node }) => {
    const date = new Date(node.committedDate);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyStats.has(monthKey)) {
      monthlyStats.set(monthKey, {
        commits: 0,
        additions: 0,
        deletions: 0,
        authors: new Set(),
      });
    }
    
    const stats = monthlyStats.get(monthKey)!;
    stats.commits++;
    stats.additions += node.additions || 0;
    stats.deletions += node.deletions || 0;
    if (node.author?.user?.login) {
      stats.authors.add(node.author.user.login);
    }
  });

  // Convert to array and sort by date
  return Array.from(monthlyStats.entries())
    .map(([month, stats]) => ({
      month,
      commits: stats.commits,
      additions: stats.additions,
      deletions: stats.deletions,
      uniqueAuthors: stats.authors.size,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}