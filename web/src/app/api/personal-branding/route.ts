import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // For MVP, we'll skip auth check to allow testing
    // In production, you should validate the user session properly
    const userId = 'test-user';

    // GitHub GraphQL query for comprehensive user data
    const query = `
      query($username: String!) {
        user(login: $username) {
          login
          name
          bio
          company
          location
          websiteUrl
          twitterUsername
          followers {
            totalCount
          }
          following {
            totalCount
          }
          repositories(first: 100, orderBy: {field: STARGAZERS, direction: DESC}) {
            totalCount
            nodes {
              name
              stargazerCount
              forkCount
              primaryLanguage {
                name
              }
              isPrivate
              isFork
              createdAt
              pushedAt
              description
            }
          }
          pullRequests(first: 100, states: MERGED) {
            totalCount
          }
          issues(first: 100) {
            totalCount
          }
          organizations(first: 10) {
            nodes {
              name
              description
              membersWithRole {
                totalCount
              }
            }
          }
          contributionsCollection {
            totalCommitContributions
            totalPullRequestContributions
            totalIssueContributions
            totalRepositoryContributions
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
          starredRepositories {
            totalCount
          }
          gists {
            totalCount
          }
          sponsorshipsAsSponsor {
            totalCount
          }
          sponsorshipsAsMaintainer {
            totalCount
          }
          createdAt
          updatedAt
        }
      }
    `;

    // Fetch data from GitHub
    const githubToken = process.env.GITHUB_TOKEN;
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username }
      }),
    });

    const data = await response.json();

    if (data.errors) {
      return NextResponse.json({ error: 'GitHub API error', details: data.errors }, { status: 500 });
    }

    const userData = data.data.user;

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate branding metrics
    const brandingAnalysis = calculateBrandingMetrics(userData);

    // For MVP, skip usage tracking
    // In production, implement proper usage limits

    return NextResponse.json(brandingAnalysis);
  } catch (error) {
    console.error('Error in personal branding analysis:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateBrandingMetrics(userData: any) {
  const totalStars = userData.repositories.nodes
    .filter((repo: any) => !repo.isFork)
    .reduce((sum: number, repo: any) => sum + repo.stargazerCount, 0);

  const totalForks = userData.repositories.nodes
    .filter((repo: any) => !repo.isFork)
    .reduce((sum: number, repo: any) => sum + repo.forkCount, 0);

  const activeRepos = userData.repositories.nodes
    .filter((repo: any) => {
      if (repo.isFork) return false;
      const pushedAt = new Date(repo.pushedAt);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return pushedAt > sixMonthsAgo;
    }).length;

  const languages = userData.repositories.nodes
    .filter((repo: any) => repo.primaryLanguage)
    .reduce((acc: any, repo: any) => {
      const lang = repo.primaryLanguage.name;
      acc[lang] = (acc[lang] || 0) + 1;
      return acc;
    }, {});

  const topLanguages = Object.entries(languages)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 5)
    .map(([lang, count]) => ({ language: lang, count }));

  // Calculate influence score (0-100)
  const influenceFactors = {
    followers: Math.min(userData.followers.totalCount / 10, 100) * 0.3,
    stars: Math.min(totalStars / 100, 100) * 0.25,
    contributions: Math.min(userData.contributionsCollection.totalCommitContributions / 1000, 100) * 0.2,
    repositories: Math.min(userData.repositories.totalCount / 50, 100) * 0.15,
    engagement: Math.min((totalForks + userData.pullRequests.totalCount + userData.issues.totalCount) / 100, 100) * 0.1
  };

  const influenceScore = Math.round(
    Object.values(influenceFactors).reduce((sum, val) => sum + val, 0)
  );

  // Calculate activity score
  const recentContributions = userData.contributionsCollection.contributionCalendar.weeks
    .slice(-4)
    .reduce((sum: number, week: any) => {
      return sum + week.contributionDays.reduce((weekSum: number, day: any) => 
        weekSum + day.contributionCount, 0);
    }, 0);

  const activityScore = Math.min(Math.round((recentContributions / 100) * 100), 100);

  // Calculate expertise level
  let expertiseLevel = 'Beginner';
  const accountAge = (new Date().getTime() - new Date(userData.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 365);
  
  if (accountAge > 5 && totalStars > 500 && userData.followers.totalCount > 100) {
    expertiseLevel = 'Expert';
  } else if (accountAge > 3 && totalStars > 100 && userData.followers.totalCount > 50) {
    expertiseLevel = 'Advanced';
  } else if (accountAge > 1 && totalStars > 20) {
    expertiseLevel = 'Intermediate';
  }

  // Calculate community impact
  const communityImpact = {
    pullRequests: userData.pullRequests.totalCount,
    issues: userData.issues.totalCount,
    organizations: userData.organizations.nodes.length,
    gists: userData.gists.totalCount,
    sponsorships: userData.sponsorshipsAsSponsor.totalCount + userData.sponsorshipsAsMaintainer.totalCount
  };

  // Brand strength calculation
  const brandStrength = {
    reach: userData.followers.totalCount,
    engagement: totalStars + totalForks,
    consistency: activityScore,
    expertise: expertiseLevel === 'Expert' ? 100 : expertiseLevel === 'Advanced' ? 75 : expertiseLevel === 'Intermediate' ? 50 : 25
  };

  const overallBrandScore = Math.round(
    (brandStrength.reach * 0.3 + 
     brandStrength.engagement * 0.3 + 
     brandStrength.consistency * 0.2 + 
     brandStrength.expertise * 0.2) / 10
  );

  // Recommendations based on analysis
  const recommendations = generateRecommendations({
    followers: userData.followers.totalCount,
    totalStars,
    activeRepos,
    recentContributions,
    bio: userData.bio,
    websiteUrl: userData.websiteUrl,
    twitterUsername: userData.twitterUsername
  });

  return {
    profile: {
      username: userData.login,
      name: userData.name,
      bio: userData.bio,
      company: userData.company,
      location: userData.location,
      websiteUrl: userData.websiteUrl,
      twitterUsername: userData.twitterUsername,
      createdAt: userData.createdAt,
      followers: userData.followers.totalCount,
      following: userData.following.totalCount
    },
    metrics: {
      totalRepositories: userData.repositories.totalCount,
      totalStars,
      totalForks,
      activeRepositories: activeRepos,
      totalContributions: userData.contributionsCollection.totalContributions,
      totalPullRequests: userData.pullRequests.totalCount,
      totalIssues: userData.issues.totalCount,
      starredRepositories: userData.starredRepositories.totalCount
    },
    scores: {
      influence: influenceScore,
      activity: activityScore,
      brandStrength: overallBrandScore,
      expertiseLevel
    },
    topLanguages,
    communityImpact,
    brandStrength,
    recommendations,
    contributionGraph: {
      total: userData.contributionsCollection.totalContributions,
      recentWeeks: userData.contributionsCollection.contributionCalendar.weeks.slice(-12)
    }
  };
}

function generateRecommendations(data: any): string[] {
  const recommendations = [];

  if (data.followers < 100) {
    recommendations.push('🎯 Increase visibility by contributing to popular open-source projects');
  }
  if (data.totalStars < 50) {
    recommendations.push('⭐ Create valuable repositories that solve real problems to earn more stars');
  }
  if (data.activeRepos < 3) {
    recommendations.push('🚀 Keep your repositories active with regular updates and maintenance');
  }
  if (data.recentContributions < 50) {
    recommendations.push('📈 Increase your commit frequency to show consistent activity');
  }
  if (!data.bio) {
    recommendations.push('✍️ Add a compelling bio to your profile to tell your story');
  }
  if (!data.websiteUrl) {
    recommendations.push('🌐 Add a personal website or portfolio link to your profile');
  }
  if (!data.twitterUsername) {
    recommendations.push('🐦 Link your Twitter account to expand your developer network');
  }

  // Add positive reinforcements
  if (data.followers > 500) {
    recommendations.push('🌟 Great follower count! Consider mentoring or creating educational content');
  }
  if (data.totalStars > 1000) {
    recommendations.push('🏆 Excellent repository engagement! Your work is making an impact');
  }

  return recommendations.slice(0, 5); // Return top 5 recommendations
}