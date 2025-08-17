import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

interface CommitData {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  author?: {
    login: string;
    avatar_url: string;
  };
  stats?: {
    additions: number;
    deletions: number;
    total: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { username, days = 365, includeStats = false } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Calculate date range
    const until = new Date();
    const since = new Date();
    since.setDate(since.getDate() - days);

    // Fetch user's repositories first
    const repos = await fetchUserRepos(username);
    
    // Fetch commits from all repositories
    const allCommits: CommitData[] = [];
    const repoCommitCounts: Record<string, number> = {};
    
    for (const repo of repos) {
      try {
        const commits = await fetchRepoCommits(
          repo.owner.login,
          repo.name,
          username,
          since,
          until,
          includeStats
        );
        
        if (commits.length > 0) {
          allCommits.push(...commits);
          repoCommitCounts[repo.full_name] = commits.length;
        }
      } catch (error) {
        console.error(`Error fetching commits for ${repo.full_name}:`, error);
        // Continue with other repos even if one fails
      }
    }

    // Sort commits by date
    allCommits.sort((a, b) => 
      new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()
    );

    // Generate various statistics
    const stats = generateCommitStatistics(allCommits, days);
    
    return NextResponse.json({
      success: true,
      data: {
        totalCommits: allCommits.length,
        reposAnalyzed: repos.length,
        repoCommitCounts,
        commits: allCommits.slice(0, 100), // Return latest 100 commits
        statistics: stats,
        dateRange: {
          since: since.toISOString(),
          until: until.toISOString()
        }
      }
    });
  } catch (error: any) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch GitHub data' },
      { status: 500 }
    );
  }
}

async function fetchUserRepos(username: string): Promise<any[]> {
  const allRepos = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&page=${page}&sort=pushed`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch repositories: ${response.status}`);
    }

    const repos = await response.json();
    
    if (repos.length === 0) {
      hasMore = false;
    } else {
      allRepos.push(...repos);
      
      if (repos.length < 100) {
        hasMore = false;
      } else {
        page++;
      }
      
      // Safety limit
      if (page > 5) {
        hasMore = false;
      }
    }
  }

  return allRepos;
}

async function fetchRepoCommits(
  owner: string,
  repo: string,
  author: string,
  since: Date,
  until: Date,
  includeStats: boolean = false
): Promise<CommitData[]> {
  const commits: CommitData[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?` +
      `author=${author}&` +
      `since=${since.toISOString()}&` +
      `until=${until.toISOString()}&` +
      `per_page=100&page=${page}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      if (response.status === 409 || response.status === 404) {
        // Empty repository or not found
        return [];
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const pageCommits = await response.json();
    
    if (!Array.isArray(pageCommits) || pageCommits.length === 0) {
      hasMore = false;
    } else {
      // Optionally fetch detailed stats for each commit
      if (includeStats && pageCommits.length <= 10) {
        for (const commit of pageCommits) {
          const stats = await fetchCommitStats(owner, repo, commit.sha);
          if (stats) {
            commit.stats = stats;
          }
        }
      }
      
      commits.push(...pageCommits);
      
      // Check for more pages
      const linkHeader = response.headers.get('Link');
      if (!linkHeader || !linkHeader.includes('rel="next"')) {
        hasMore = false;
      } else {
        page++;
      }
      
      // Safety limit
      if (page > 5) {
        hasMore = false;
      }
    }
  }

  return commits;
}

async function fetchCommitStats(
  owner: string,
  repo: string,
  sha: string
): Promise<{ additions: number; deletions: number; total: number } | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits/${sha}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.stats || null;
  } catch (error) {
    console.error(`Error fetching commit stats for ${sha}:`, error);
    return null;
  }
}

function generateCommitStatistics(commits: CommitData[], days: number) {
  const now = new Date();
  const stats = {
    dailyAverage: 0,
    weeklyAverage: 0,
    monthlyTotal: 0,
    mostActiveDay: '',
    mostActiveHour: 0,
    languageDistribution: {} as Record<string, number>,
    commitsByDayOfWeek: Array(7).fill(0),
    commitsByHour: Array(24).fill(0),
    commitsByMonth: {} as Record<string, number>,
    streakData: {
      currentStreak: 0,
      longestStreak: 0,
    },
    heatmap: {} as Record<string, number>,
  };

  // Create heatmap data
  const commitDates = new Set<string>();
  commits.forEach(commit => {
    const date = new Date(commit.commit.author.date);
    const dateStr = date.toISOString().split('T')[0];
    commitDates.add(dateStr);
    
    stats.heatmap[dateStr] = (stats.heatmap[dateStr] || 0) + 1;
    
    // Day of week (0 = Sunday)
    stats.commitsByDayOfWeek[date.getDay()]++;
    
    // Hour of day
    stats.commitsByHour[date.getHours()]++;
    
    // Month
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    stats.commitsByMonth[monthKey] = (stats.commitsByMonth[monthKey] || 0) + 1;
  });

  // Calculate streaks
  const sortedDates = Array.from(commitDates).sort();
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate: Date | null = null;

  sortedDates.forEach(dateStr => {
    const date = new Date(dateStr);
    
    if (lastDate) {
      const dayDiff = Math.floor((date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    } else {
      tempStreak = 1;
    }
    
    lastDate = date;
  });
  
  longestStreak = Math.max(longestStreak, tempStreak);
  
  // Check if streak continues to today
  if (lastDate) {
    const daysSinceLastCommit = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceLastCommit <= 1) {
      currentStreak = tempStreak;
    }
  }

  stats.streakData = { currentStreak, longestStreak };

  // Calculate averages
  stats.dailyAverage = commits.length / days;
  stats.weeklyAverage = commits.length / (days / 7);
  
  // Monthly total (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  stats.monthlyTotal = commits.filter(c => 
    new Date(c.commit.author.date) >= thirtyDaysAgo
  ).length;

  // Most active day of week
  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
  const maxDayIndex = stats.commitsByDayOfWeek.indexOf(Math.max(...stats.commitsByDayOfWeek));
  stats.mostActiveDay = dayNames[maxDayIndex];

  // Most active hour
  const maxHourIndex = stats.commitsByHour.indexOf(Math.max(...stats.commitsByHour));
  stats.mostActiveHour = maxHourIndex;

  return stats;
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST method with username and optional days parameter' 
  });
}