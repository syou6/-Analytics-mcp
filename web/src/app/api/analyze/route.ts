import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const { owner, repo, analysisType = 'repo' } = await request.json();

    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Owner and repo are required' },
        { status: 400 }
      );
    }

    let data;
    
    switch (analysisType) {
      case 'repo':
        data = await analyzeRepo(owner, repo);
        break;
      case 'contributors':
        data = await analyzeContributors(owner, repo);
        break;
      case 'languages':
        data = await analyzeLanguages(owner, repo);
        break;
      case 'activity':
        data = await analyzeActivity(owner, repo);
        break;
      default:
        data = await analyzeRepo(owner, repo);
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze repository' },
      { status: 500 }
    );
  }
}

async function analyzeRepo(owner: string, repo: string) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    name: data.name,
    description: data.description,
    stars: data.stargazers_count,
    forks: data.forks_count,
    openIssues: data.open_issues_count,
    watchers: data.watchers_count,
    language: data.language,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    topics: data.topics || [],
    license: data.license?.name || 'No license',
    isPrivate: data.private,
    defaultBranch: data.default_branch,
    size: data.size,
    homepage: data.homepage,
  };
}

async function analyzeContributors(owner: string, repo: string, limit = 10) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=${limit}`,
    {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  const contributors = await response.json();

  return contributors.map((contributor: any) => ({
    username: contributor.login,
    contributions: contributor.contributions,
    avatarUrl: contributor.avatar_url,
    profileUrl: contributor.html_url,
    type: contributor.type,
  }));
}

async function analyzeLanguages(owner: string, repo: string) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/languages`,
    {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  const languages = await response.json();
  
  const total = Object.values(languages).reduce((sum: number, bytes: any) => sum + bytes, 0) as number;
  
  const languagesWithPercentage = Object.entries(languages).map(([lang, bytes]) => ({
    language: lang,
    bytes: bytes as number,
    percentage: Math.round(((bytes as number) / total) * 1000) / 10,
  }));

  return languagesWithPercentage.sort((a, b) => b.bytes - a.bytes);
}

async function analyzeActivity(owner: string, repo: string, days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceISO = since.toISOString();

  // Get recent commits
  const commitsResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits?since=${sinceISO}&per_page=100`,
    {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  // Get recent issues
  const issuesResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues?state=all&since=${sinceISO}&per_page=100`,
    {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  // Get recent PRs
  const prsResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls?state=all&sort=created&direction=desc&per_page=100`,
    {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  const commits = commitsResponse.ok ? await commitsResponse.json() : [];
  const issues = issuesResponse.ok ? await issuesResponse.json() : [];
  const prs = prsResponse.ok ? await prsResponse.json() : [];

  // Filter PRs by date
  const recentPrs = prs.filter((pr: any) => new Date(pr.created_at) > since);

  // Calculate additions and deletions from commits
  let totalAdditions = 0;
  let totalDeletions = 0;
  
  // Fetch detailed commit stats for recent commits (limit to 10 for performance)
  const recentCommitShas = commits.slice(0, 10).map((c: any) => c.sha);
  for (const sha of recentCommitShas) {
    try {
      const commitDetailResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits/${sha}`,
        {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );
      if (commitDetailResponse.ok) {
        const detail = await commitDetailResponse.json();
        totalAdditions += detail.stats?.additions || 0;
        totalDeletions += detail.stats?.deletions || 0;
      }
    } catch (e) {
      // Skip if individual commit fetch fails
    }
  }

  return {
    period: `Last ${days} days`,
    commits: {
      total: commits.length,
      authors: [...new Set(commits.map((c: any) => c.commit.author?.name).filter(Boolean))].length,
      additions: totalAdditions,
      deletions: totalDeletions,
    },
    issues: {
      total: issues.length,
      open: issues.filter((i: any) => i.state === 'open').length,
      closed: issues.filter((i: any) => i.state === 'closed').length,
    },
    pullRequests: {
      total: recentPrs.length,
      open: recentPrs.filter((pr: any) => pr.state === 'open').length,
      merged: recentPrs.filter((pr: any) => pr.merged_at).length,
    },
  };
}