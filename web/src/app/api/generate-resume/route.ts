import { NextRequest, NextResponse } from 'next/server';

// Types for resume data
interface ResumeData {
  personalInfo: {
    name: string;
    username: string;
    bio: string;
    location: string;
    email: string;
    profileUrl: string;
  };
  professionalSummary: string;
  skills: {
    languages: { name: string; proficiency: string; linesOfCode: number }[];
    topTechnologies: string[];
  };
  achievements: string[];
  statistics: {
    totalCommits: number;
    totalPRs: number;
    totalIssues: number;
    totalStars: number;
    totalRepos: number;
    contributionStreak: number;
  };
  experience: {
    title: string;
    organization: string;
    duration: string;
    description: string;
    metrics: string[];
  }[];
  openSourceContributions: {
    repo: string;
    stars: number;
    contributions: number;
    role: string;
  }[];
  careerInsights: {
    level: string; // Junior, Mid, Senior, Lead
    estimatedSalaryRange: string;
    strengths: string[];
    improvementAreas: string[];
  };
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    // Get user data from GitHub
    const userData = await fetchGitHubUserData(userId);
    const repoData = await fetchUserRepositories(userId);
    const contributionData = await fetchContributionStats(userId);

    // Generate AI-powered insights
    const resume = generateResume(userData, repoData, contributionData);

    return NextResponse.json(resume);
  } catch (error) {
    console.error('Resume generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate resume' },
      { status: 500 }
    );
  }
}

async function fetchGitHubUserData(username: string) {
  const response = await fetch(`https://api.github.com/users/${username}`, {
    headers: {
      'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
    },
  });
  return response.json();
}

async function fetchUserRepositories(username: string) {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    }
  );
  return response.json();
}

async function fetchContributionStats(username: string) {
  // Fetch contribution graph data
  const query = `
    query($username: String!) {
      user(login: $username) {
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
        }
      }
    }
  `;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables: { username } }),
  });

  const data = await response.json();
  return data.data.user.contributionsCollection;
}

function generateResume(userData: any, repoData: any[], contributionData: any): ResumeData {
  // Calculate language statistics
  const languageStats = calculateLanguageStats(repoData);
  
  // Calculate contribution streak
  const streak = calculateContributionStreak(contributionData);
  
  // Generate professional summary using AI-like logic
  const professionalSummary = generateProfessionalSummary(userData, repoData, contributionData);
  
  // Determine career level
  const careerLevel = determineCareerLevel(contributionData, repoData);
  
  // Generate achievements
  const achievements = generateAchievements(userData, repoData, contributionData);
  
  // Find top open source contributions
  const ossContributions = findTopOSSContributions(repoData);

  return {
    personalInfo: {
      name: userData.name || userData.login,
      username: userData.login,
      bio: userData.bio || '',
      location: userData.location || '',
      email: userData.email || '',
      profileUrl: userData.html_url,
    },
    professionalSummary,
    skills: {
      languages: languageStats,
      topTechnologies: extractTopTechnologies(repoData),
    },
    achievements,
    statistics: {
      totalCommits: contributionData.totalCommitContributions,
      totalPRs: contributionData.totalPullRequestContributions,
      totalIssues: contributionData.totalIssueContributions,
      totalStars: repoData.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0),
      totalRepos: repoData.length,
      contributionStreak: streak,
    },
    experience: generateExperienceSection(repoData, contributionData),
    openSourceContributions: ossContributions,
    careerInsights: {
      level: careerLevel,
      estimatedSalaryRange: estimateSalaryRange(careerLevel, userData.location),
      strengths: identifyStrengths(repoData, contributionData),
      improvementAreas: identifyImprovementAreas(repoData, contributionData),
    },
  };
}

function calculateLanguageStats(repos: any[]) {
  const languages: { [key: string]: number } = {};
  
  repos.forEach((repo: any) => {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + repo.size;
    }
  });

  return Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, size]) => ({
      name,
      proficiency: getProficiencyLevel(size),
      linesOfCode: Math.round(size * 10), // Rough estimate
    }));
}

function getProficiencyLevel(size: number): string {
  if (size > 10000) return 'Expert';
  if (size > 5000) return 'Advanced';
  if (size > 1000) return 'Intermediate';
  return 'Beginner';
}

function calculateContributionStreak(contributionData: any): number {
  let currentStreak = 0;
  let maxStreak = 0;
  
  const weeks = contributionData.contributionCalendar.weeks;
  
  for (const week of weeks) {
    for (const day of week.contributionDays) {
      if (day.contributionCount > 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
  }
  
  return maxStreak;
}

function generateProfessionalSummary(userData: any, repoData: any[], contributionData: any): string {
  const totalContributions = contributionData.totalCommitContributions;
  const primaryLanguage = repoData[0]?.language || 'JavaScript';
  const yearsActive = Math.floor((Date.now() - new Date(userData.created_at).getTime()) / (365 * 24 * 60 * 60 * 1000));
  
  return `Experienced software developer with ${yearsActive}+ years on GitHub, specializing in ${primaryLanguage}. ` +
    `Demonstrated expertise through ${totalContributions.toLocaleString()} commits across ${repoData.length} repositories. ` +
    `Active open-source contributor with a focus on clean code and collaborative development.`;
}

function determineCareerLevel(contributionData: any, repoData: any[]): string {
  const totalContributions = contributionData.totalCommitContributions;
  const totalStars = repoData.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0);
  
  if (totalContributions > 5000 || totalStars > 1000) return 'Senior';
  if (totalContributions > 2000 || totalStars > 500) return 'Mid-Level';
  if (totalContributions > 500 || totalStars > 100) return 'Junior';
  return 'Entry-Level';
}

function generateAchievements(userData: any, repoData: any[], contributionData: any): string[] {
  const achievements = [];
  
  const totalStars = repoData.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0);
  const totalContributions = contributionData.totalCommitContributions;
  const mostStarredRepo = repoData.sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)[0];
  
  if (totalStars > 100) {
    achievements.push(`Earned ${totalStars.toLocaleString()} stars across all repositories`);
  }
  
  if (totalContributions > 1000) {
    achievements.push(`Made ${totalContributions.toLocaleString()} commits demonstrating consistent contribution`);
  }
  
  if (mostStarredRepo && mostStarredRepo.stargazers_count > 50) {
    achievements.push(`Created ${mostStarredRepo.name} with ${mostStarredRepo.stargazers_count} stars`);
  }
  
  if (contributionData.totalPullRequestContributions > 100) {
    achievements.push(`Submitted ${contributionData.totalPullRequestContributions} pull requests to various projects`);
  }
  
  const languages = [...new Set(repoData.map((r: any) => r.language).filter(Boolean))];
  if (languages.length > 5) {
    achievements.push(`Proficient in ${languages.length} programming languages`);
  }
  
  return achievements;
}

function extractTopTechnologies(repos: any[]): string[] {
  const techs = new Set<string>();
  
  repos.forEach((repo: any) => {
    if (repo.language) techs.add(repo.language);
    // Add common frameworks based on repo names and descriptions
    const repoText = `${repo.name} ${repo.description || ''}`.toLowerCase();
    if (repoText.includes('react')) techs.add('React');
    if (repoText.includes('vue')) techs.add('Vue.js');
    if (repoText.includes('angular')) techs.add('Angular');
    if (repoText.includes('node')) techs.add('Node.js');
    if (repoText.includes('python')) techs.add('Python');
    if (repoText.includes('docker')) techs.add('Docker');
    if (repoText.includes('kubernetes')) techs.add('Kubernetes');
  });
  
  return Array.from(techs).slice(0, 10);
}

function generateExperienceSection(repos: any[], contributionData: any): any[] {
  const experiences = [];
  
  // Group repos by potential organizations
  const orgRepos = repos.filter((r: any) => r.owner.type === 'Organization');
  const personalRepos = repos.filter((r: any) => r.owner.type === 'User');
  
  if (personalRepos.length > 0) {
    experiences.push({
      title: 'Independent Software Developer',
      organization: 'Open Source Projects',
      duration: 'Ongoing',
      description: `Maintaining ${personalRepos.length} personal projects with focus on ${personalRepos[0]?.language || 'various technologies'}`,
      metrics: [
        `${contributionData.totalCommitContributions} total commits`,
        `${personalRepos.reduce((sum: number, r: any) => sum + r.stargazers_count, 0)} stars earned`,
      ],
    });
  }
  
  // Add organization contributions
  const orgs = [...new Set(orgRepos.map((r: any) => r.owner.login))];
  orgs.slice(0, 3).forEach((org: string) => {
    const orgSpecificRepos = orgRepos.filter((r: any) => r.owner.login === org);
    experiences.push({
      title: 'Open Source Contributor',
      organization: org,
      duration: 'Contributing',
      description: `Active contributor to ${orgSpecificRepos.length} repositories`,
      metrics: [
        `Contributing to ${orgSpecificRepos.length} projects`,
      ],
    });
  });
  
  return experiences;
}

function findTopOSSContributions(repos: any[]): any[] {
  return repos
    .filter((repo: any) => !repo.private && repo.stargazers_count > 10)
    .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5)
    .map((repo: any) => ({
      repo: repo.full_name,
      stars: repo.stargazers_count,
      contributions: repo.size, // Rough estimate
      role: repo.owner.type === 'User' ? 'Owner' : 'Contributor',
    }));
}

function estimateSalaryRange(level: string, location: string): string {
  // Base salaries in USD
  const baseSalaries: { [key: string]: [number, number] } = {
    'Entry-Level': [50000, 70000],
    'Junior': [70000, 90000],
    'Mid-Level': [90000, 120000],
    'Senior': [120000, 180000],
  };
  
  // Location multipliers
  const locationMultiplier = location?.toLowerCase().includes('san francisco') ? 1.3 :
    location?.toLowerCase().includes('new york') ? 1.2 :
    location?.toLowerCase().includes('london') ? 1.1 :
    location?.toLowerCase().includes('tokyo') ? 0.9 :
    1.0;
  
  const [min, max] = baseSalaries[level] || [50000, 70000];
  const adjustedMin = Math.round(min * locationMultiplier / 1000) * 1000;
  const adjustedMax = Math.round(max * locationMultiplier / 1000) * 1000;
  
  return `$${adjustedMin.toLocaleString()} - $${adjustedMax.toLocaleString()}`;
}

function identifyStrengths(repos: any[], contributionData: any): string[] {
  const strengths = [];
  
  if (contributionData.totalCommitContributions > 1000) {
    strengths.push('Consistent contributor');
  }
  
  const languages = [...new Set(repos.map((r: any) => r.language).filter(Boolean))];
  if (languages.length > 3) {
    strengths.push('Polyglot programmer');
  }
  
  const totalStars = repos.reduce((sum: number, r: any) => sum + r.stargazers_count, 0);
  if (totalStars > 100) {
    strengths.push('Community recognized projects');
  }
  
  if (contributionData.totalPullRequestContributions > 50) {
    strengths.push('Active collaborator');
  }
  
  const hasDocumentation = repos.some((r: any) => r.has_wiki || (r.description && r.description.length > 50));
  if (hasDocumentation) {
    strengths.push('Strong documentation skills');
  }
  
  return strengths;
}

function identifyImprovementAreas(repos: any[], contributionData: any): string[] {
  const improvements = [];
  
  const avgStarsPerRepo = repos.length > 0 ? 
    repos.reduce((sum: number, r: any) => sum + r.stargazers_count, 0) / repos.length : 0;
  
  if (avgStarsPerRepo < 5) {
    improvements.push('Increase project visibility');
  }
  
  const hasTests = repos.some((r: any) => 
    r.name.includes('test') || r.description?.includes('test')
  );
  if (!hasTests) {
    improvements.push('Add test coverage to projects');
  }
  
  const hasCI = repos.some((r: any) => r.has_pages || r.has_actions);
  if (!hasCI) {
    improvements.push('Implement CI/CD pipelines');
  }
  
  if (repos.filter((r: any) => r.description).length < repos.length * 0.5) {
    improvements.push('Add descriptions to repositories');
  }
  
  return improvements;
}