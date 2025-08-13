import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // GraphQL query for user statistics
    const query = `
      query($login: String!) {
        user(login: $login) {
          login
          name
          avatarUrl
          bio
          followers {
            totalCount
          }
          following {
            totalCount
          }
          repositories(first: 100, privacy: PUBLIC) {
            totalCount
            nodes {
              stargazerCount
              forkCount
            }
          }
          contributionsCollection {
            totalCommitContributions
            totalIssueContributions
            totalPullRequestContributions
            totalPullRequestReviewContributions
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
            commitContributionsByRepository(maxRepositories: 10) {
              repository {
                name
                owner {
                  login
                }
              }
              contributions {
                totalCount
              }
            }
          }
          organizations(first: 10) {
            totalCount
            nodes {
              name
              avatarUrl
            }
          }
          pullRequests(first: 100, states: [OPEN, MERGED]) {
            totalCount
          }
          issues(first: 100, states: [OPEN, CLOSED]) {
            totalCount
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
        variables: { login: username }
      }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
    }

    const user = data.data?.user;
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate total stars and forks
    const totalStars = user.repositories.nodes.reduce((sum: number, repo: any) => 
      sum + repo.stargazerCount, 0);
    const totalForks = user.repositories.nodes.reduce((sum: number, repo: any) => 
      sum + repo.forkCount, 0);

    // Process contribution calendar for current streak
    const contributionDays = user.contributionsCollection.contributionCalendar.weeks
      .flatMap((week: any) => week.contributionDays)
      .reverse();
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    for (const day of contributionDays) {
      if (day.contributionCount > 0) {
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        if (currentStreak === 0) {
          currentStreak = tempStreak;
        }
      } else {
        if (currentStreak === 0 && tempStreak > 0) {
          currentStreak = tempStreak;
        }
        tempStreak = 0;
      }
    }

    return NextResponse.json({
      profile: {
        username: user.login,
        name: user.name,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
      },
      stats: {
        followers: user.followers.totalCount,
        following: user.following.totalCount,
        totalRepos: user.repositories.totalCount,
        totalStars,
        totalForks,
        totalCommits: user.contributionsCollection.totalCommitContributions,
        totalPRs: user.pullRequests.totalCount,
        totalIssues: user.issues.totalCount,
        totalContributions: user.contributionsCollection.contributionCalendar.totalContributions,
        currentStreak,
        longestStreak,
      },
      organizations: user.organizations.nodes,
      topRepositories: user.contributionsCollection.commitContributionsByRepository.map((item: any) => ({
        name: item.repository.name,
        owner: item.repository.owner.login,
        contributions: item.contributions.totalCount,
      })),
      contributionCalendar: user.contributionsCollection.contributionCalendar.weeks,
    });
  } catch (error: any) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch GitHub data' },
      { status: 500 }
    );
  }
}