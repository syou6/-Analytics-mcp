import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const { owner, repo, days = 365 } = await request.json();

    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Owner and repo are required' },
        { status: 400 }
      );
    }

    // Calculate date range
    const until = new Date();
    const since = new Date();
    since.setDate(since.getDate() - days);

    // Fetch ALL commits with pagination
    const allCommits = await fetchAllCommits(owner, repo, since, until);
    
    // Process commits for various visualizations
    const heatmapData = generateAccurateHeatmap(allCommits, days);
    const timeDistribution = calculateTimeDistribution(allCommits);
    const dailyStats = calculateDailyStats(allCommits);
    const contributorStats = calculateContributorStats(allCommits);

    return NextResponse.json({
      totalCommits: allCommits.length,
      heatmap: heatmapData,
      timeDistribution,
      dailyStats,
      contributorStats,
      dateRange: {
        since: since.toISOString(),
        until: until.toISOString()
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

async function fetchAllCommits(
  owner: string, 
  repo: string, 
  since: Date, 
  until: Date
): Promise<any[]> {
  const allCommits = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?` +
      `since=${since.toISOString()}&until=${until.toISOString()}&` +
      `per_page=100&page=${page}`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      if (response.status === 409) {
        // Empty repository
        return [];
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const commits = await response.json();
    
    if (commits.length === 0) {
      hasMore = false;
    } else {
      allCommits.push(...commits);
      
      // Check if there are more pages
      const linkHeader = response.headers.get('Link');
      if (!linkHeader || !linkHeader.includes('rel="next"')) {
        hasMore = false;
      } else {
        page++;
      }
      
      // Safety limit to prevent infinite loops
      if (page > 10) {
        console.warn('Reached maximum page limit');
        hasMore = false;
      }
    }
  }
  
  return allCommits;
}

function generateAccurateHeatmap(commits: any[], days: number) {
  // Create a map of date -> commit count
  const commitsByDate = new Map<string, number>();
  
  commits.forEach((commit) => {
    const date = new Date(commit.commit.author.date);
    const dateKey = date.toISOString().split('T')[0];
    commitsByDate.set(dateKey, (commitsByDate.get(dateKey) || 0) + 1);
  });

  // Calculate the starting Sunday for proper week alignment
  const today = new Date();
  const todayDay = today.getDay(); // 0 = Sunday, 6 = Saturday
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - days - todayDay);
  
  // Ensure we start from Sunday
  while (startDate.getDay() !== 0) {
    startDate.setDate(startDate.getDate() - 1);
  }
  
  // Generate weeks of data
  const weeks = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= today) {
    const weekData = [];
    
    for (let day = 0; day < 7; day++) {
      if (currentDate <= today) {
        const dateKey = currentDate.toISOString().split('T')[0];
        const commitCount = commitsByDate.get(dateKey) || 0;
        weekData.push({
          date: dateKey,
          count: commitCount,
          day: currentDate.getDay()
        });
      } else {
        weekData.push(null); // Future dates
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    if (weekData.some(d => d !== null)) {
      weeks.push(weekData);
    }
  }
  
  return weeks;
}

function calculateTimeDistribution(commits: any[]) {
  // Hourly distribution (0-23)
  const hourlyCount = new Array(24).fill(0);
  
  // Day of week distribution (0=Sunday, 6=Saturday)
  const dayOfWeekCount = new Array(7).fill(0);
  
  commits.forEach((commit) => {
    const date = new Date(commit.commit.author.date);
    
    // Hour distribution
    const hour = date.getHours();
    hourlyCount[hour]++;
    
    // Day of week distribution
    const dayOfWeek = date.getDay();
    dayOfWeekCount[dayOfWeek]++;
  });
  
  // Find peak coding hours
  const peakHour = hourlyCount.indexOf(Math.max(...hourlyCount));
  const peakDay = dayOfWeekCount.indexOf(Math.max(...dayOfWeekCount));
  
  return {
    hourly: hourlyCount,
    dayOfWeek: dayOfWeekCount,
    peakHour,
    peakDay,
    totalCommits: commits.length,
    morningCommits: hourlyCount.slice(6, 12).reduce((a, b) => a + b, 0),
    afternoonCommits: hourlyCount.slice(12, 18).reduce((a, b) => a + b, 0),
    eveningCommits: hourlyCount.slice(18, 24).reduce((a, b) => a + b, 0),
    nightCommits: hourlyCount.slice(0, 6).reduce((a, b) => a + b, 0),
    weekdayCommits: dayOfWeekCount.slice(1, 6).reduce((a, b) => a + b, 0),
    weekendCommits: dayOfWeekCount[0] + dayOfWeekCount[6]
  };
}

function calculateDailyStats(commits: any[]) {
  const commitsByDate = new Map<string, number>();
  
  commits.forEach((commit) => {
    const date = new Date(commit.commit.author.date);
    const dateKey = date.toISOString().split('T')[0];
    commitsByDate.set(dateKey, (commitsByDate.get(dateKey) || 0) + 1);
  });
  
  const dailyCounts = Array.from(commitsByDate.values());
  
  // Calculate statistics
  const maxCommitsPerDay = Math.max(...dailyCounts, 0);
  const avgCommitsPerDay = dailyCounts.length > 0 
    ? dailyCounts.reduce((a, b) => a + b, 0) / dailyCounts.length 
    : 0;
  
  // Calculate current streak
  const today = new Date();
  let currentStreak = 0;
  let checkDate = new Date(today);
  
  while (true) {
    const dateKey = checkDate.toISOString().split('T')[0];
    if (commitsByDate.has(dateKey)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  // Calculate longest streak
  const sortedDates = Array.from(commitsByDate.keys()).sort();
  let longestStreak = 0;
  let tempStreak = 1;
  
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currDate = new Date(sortedDates[i]);
    const dayDiff = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (dayDiff === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);
  
  return {
    totalDaysWithCommits: commitsByDate.size,
    maxCommitsPerDay,
    avgCommitsPerDay: Math.round(avgCommitsPerDay * 10) / 10,
    currentStreak,
    longestStreak
  };
}

function calculateContributorStats(commits: any[]) {
  const contributors = new Map<string, { name: string; email: string; count: number }>();
  
  commits.forEach((commit) => {
    const author = commit.commit.author;
    const key = author.email;
    
    if (!contributors.has(key)) {
      contributors.set(key, {
        name: author.name,
        email: author.email,
        count: 0
      });
    }
    
    const contributor = contributors.get(key)!;
    contributor.count++;
  });
  
  // Sort by contribution count
  const sortedContributors = Array.from(contributors.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 contributors
  
  return {
    totalContributors: contributors.size,
    topContributors: sortedContributors
  };
}