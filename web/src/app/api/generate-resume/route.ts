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
  const yearsActive = Math.floor((Date.now() - new Date(userData.created_at).getTime()) / (365 * 24 * 60 * 60 * 1000));
  
  // 言語の専門性を分析
  const languageStats = calculateLanguageStats(repoData);
  const primaryLanguages = languageStats.slice(0, 3).map(l => l.name).join(', ');
  
  // 貢献パターンを分析
  const avgCommitsPerMonth = Math.round(totalContributions / (yearsActive * 12 || 1));
  const totalStars = repoData.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0);
  
  // コミットの一貫性を評価
  const consistency = avgCommitsPerMonth > 50 ? 'highly consistent' : 
                     avgCommitsPerMonth > 20 ? 'consistent' : 'growing';
  
  // 専門分野を特定
  const specialties = identifySpecialties(repoData);
  const specialtyText = specialties.length > 0 ? ` with expertise in ${specialties.join(', ')}` : '';
  
  // OSSへの貢献度を評価
  const ossContribution = repoData.filter(r => !r.private && r.fork).length;
  const ossText = ossContribution > 10 ? 'Active open-source contributor' :
                  ossContribution > 5 ? 'Open-source enthusiast' : 
                  'Emerging open-source contributor';
  
  // 影響力を評価
  const impactLevel = totalStars > 1000 ? 'high-impact' :
                      totalStars > 100 ? 'impactful' :
                      'emerging';
  
  return `${consistency.charAt(0).toUpperCase() + consistency.slice(1)} software developer with ${yearsActive}+ years of GitHub activity, ` +
    `specializing in ${primaryLanguages}${specialtyText}. ` +
    `Demonstrated ${impactLevel} contributions through ${totalContributions.toLocaleString()} commits across ${repoData.length} repositories` +
    `${totalStars > 50 ? `, earning ${totalStars} stars from the community` : ''}. ` +
    `${ossText} with a focus on ${identifyFocus(repoData)}.`;
}

function identifySpecialties(repos: any[]): string[] {
  const specialties = new Set<string>();
  
  repos.forEach(repo => {
    const name = (repo.name + ' ' + (repo.description || '')).toLowerCase();
    
    // Web開発
    if (name.includes('react') || name.includes('vue') || name.includes('angular')) {
      specialties.add('Frontend Development');
    }
    if (name.includes('node') || name.includes('express') || name.includes('fastapi')) {
      specialties.add('Backend Development');
    }
    
    // モバイル
    if (name.includes('ios') || name.includes('swift')) specialties.add('iOS Development');
    if (name.includes('android') || name.includes('kotlin')) specialties.add('Android Development');
    if (name.includes('flutter') || name.includes('react-native')) specialties.add('Cross-Platform Mobile');
    
    // データサイエンス/AI
    if (name.includes('machine') || name.includes('ml') || name.includes('ai')) {
      specialties.add('Machine Learning');
    }
    if (name.includes('data') || name.includes('analysis') || name.includes('pandas')) {
      specialties.add('Data Analysis');
    }
    
    // DevOps
    if (name.includes('docker') || name.includes('kubernetes') || name.includes('k8s')) {
      specialties.add('DevOps');
    }
    if (name.includes('ci') || name.includes('cd') || name.includes('pipeline')) {
      specialties.add('CI/CD');
    }
    
    // その他
    if (name.includes('blockchain') || name.includes('crypto') || name.includes('web3')) {
      specialties.add('Blockchain');
    }
    if (name.includes('game')) specialties.add('Game Development');
    if (name.includes('security')) specialties.add('Security');
  });
  
  return Array.from(specialties).slice(0, 3);
}

function identifyFocus(repos: any[]): string {
  const hasTests = repos.some(r => r.name.includes('test') || (r.description || '').includes('test'));
  const hasDocs = repos.filter(r => r.description && r.description.length > 50).length > repos.length * 0.5;
  const hasCI = repos.some(r => r.has_actions);
  
  if (hasTests && hasDocs && hasCI) return 'quality-driven development and best practices';
  if (hasTests && hasCI) return 'test-driven development and automation';
  if (hasDocs) return 'well-documented and maintainable code';
  if (hasTests) return 'reliable and tested solutions';
  return 'practical problem-solving and continuous learning';
}

function determineCareerLevel(contributionData: any, repoData: any[]): string {
  const totalContributions = contributionData.totalCommitContributions;
  const totalStars = repoData.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0);
  const totalPRs = contributionData.totalPullRequestContributions;
  const totalReviews = contributionData.totalPullRequestReviewContributions || 0;
  
  // 複数の要因を考慮したスコアリング
  let score = 0;
  
  // コミット数によるスコア
  if (totalContributions > 10000) score += 40;
  else if (totalContributions > 5000) score += 30;
  else if (totalContributions > 2000) score += 20;
  else if (totalContributions > 500) score += 10;
  else score += 5;
  
  // スター数によるスコア
  if (totalStars > 5000) score += 30;
  else if (totalStars > 1000) score += 25;
  else if (totalStars > 500) score += 20;
  else if (totalStars > 100) score += 15;
  else if (totalStars > 50) score += 10;
  else score += 5;
  
  // PR貢献によるスコア
  if (totalPRs > 500) score += 15;
  else if (totalPRs > 200) score += 12;
  else if (totalPRs > 100) score += 10;
  else if (totalPRs > 50) score += 7;
  else score += 3;
  
  // レビュー活動によるスコア（シニアの指標）
  if (totalReviews > 100) score += 15;
  else if (totalReviews > 50) score += 10;
  else if (totalReviews > 20) score += 5;
  
  // リポジトリの多様性
  const languages = [...new Set(repoData.map(r => r.language).filter(Boolean))];
  if (languages.length > 10) score += 10;
  else if (languages.length > 5) score += 7;
  else if (languages.length > 3) score += 5;
  
  // 最終的なレベル判定
  if (score >= 80) return 'Principal/Staff';
  if (score >= 60) return 'Senior';
  if (score >= 40) return 'Mid-Level';
  if (score >= 20) return 'Junior';
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
  const totalCommits = contributionData.totalCommitContributions;
  const totalPRs = contributionData.totalPullRequestContributions;
  const totalStars = repos.reduce((sum: number, r: any) => sum + r.stargazers_count, 0);
  const languages = [...new Set(repos.map((r: any) => r.language).filter(Boolean))];
  
  // コミットパターン分析
  if (totalCommits > 5000) {
    strengths.push('Exceptional productivity (Top 5% contributor)');
  } else if (totalCommits > 2000) {
    strengths.push('Highly productive developer');
  } else if (totalCommits > 1000) {
    strengths.push('Consistent and reliable contributor');
  }
  
  // 技術的多様性
  if (languages.length > 7) {
    strengths.push('Full-stack polyglot (7+ languages)');
  } else if (languages.length > 4) {
    strengths.push('Versatile multi-language developer');
  } else if (languages.length > 2) {
    strengths.push('Cross-functional technical skills');
  }
  
  // コミュニティ影響力
  if (totalStars > 1000) {
    strengths.push('High-impact open source maintainer');
  } else if (totalStars > 500) {
    strengths.push('Recognized community contributor');
  } else if (totalStars > 100) {
    strengths.push('Growing influence in developer community');
  }
  
  // コラボレーション能力
  if (totalPRs > 200) {
    strengths.push('Expert collaborator and code reviewer');
  } else if (totalPRs > 100) {
    strengths.push('Strong team collaboration skills');
  } else if (totalPRs > 50) {
    strengths.push('Active in peer code reviews');
  }
  
  // 特殊なスキル指標
  const hasCI = repos.some((r: any) => r.has_actions);
  if (hasCI) strengths.push('CI/CD and automation expertise');
  
  const avgDescription = repos.filter((r: any) => r.description).length / repos.length;
  if (avgDescription > 0.8) strengths.push('Excellence in documentation');
  
  const forkedRepos = repos.filter((r: any) => r.fork).length;
  if (forkedRepos > 10) strengths.push('Active open source contributor');
  
  // プロジェクト管理能力
  const issuesResolved = contributionData.totalIssueContributions;
  if (issuesResolved > 100) strengths.push('Proactive problem solver');
  
  // 最新技術への適応
  const recentRepos = repos.filter((r: any) => {
    const updatedDate = new Date(r.updated_at);
    const monthsAgo = (Date.now() - updatedDate.getTime()) / (30 * 24 * 60 * 60 * 1000);
    return monthsAgo < 3;
  });
  if (recentRepos.length > 5) strengths.push('Actively learning and adapting');
  
  return strengths.slice(0, 5); // Top 5 strengths
}

function identifyImprovementAreas(repos: any[], contributionData: any): string[] {
  const improvements = [];
  const suggestions = [];
  
  const totalStars = repos.reduce((sum: number, r: any) => sum + r.stargazers_count, 0);
  const avgStarsPerRepo = repos.length > 0 ? totalStars / repos.length : 0;
  const totalPRs = contributionData.totalPullRequestContributions;
  const totalCommits = contributionData.totalCommitContributions;
  
  // プロジェクトの可視性
  if (avgStarsPerRepo < 10 && repos.length > 5) {
    suggestions.push({
      area: 'Increase project visibility and community engagement',
      priority: totalStars < 50 ? 'high' : 'medium',
      action: 'Add comprehensive READMEs, demos, and promote on social media'
    });
  }
  
  // テストカバレッジ
  const hasTests = repos.some((r: any) => 
    r.name.toLowerCase().includes('test') || 
    (r.description || '').toLowerCase().includes('test')
  );
  if (!hasTests && repos.length > 3) {
    suggestions.push({
      area: 'Implement comprehensive testing strategies',
      priority: 'high',
      action: 'Add unit tests, integration tests, and CI/CD test automation'
    });
  }
  
  // CI/CD実践
  const hasCI = repos.some((r: any) => r.has_actions);
  if (!hasCI && repos.length > 3) {
    suggestions.push({
      area: 'Adopt modern DevOps practices',
      priority: 'high',
      action: 'Set up GitHub Actions for automated testing and deployment'
    });
  }
  
  // ドキュメント品質
  const docsRatio = repos.filter((r: any) => r.description && r.description.length > 30).length / repos.length;
  if (docsRatio < 0.7) {
    suggestions.push({
      area: 'Enhance documentation and project descriptions',
      priority: 'medium',
      action: 'Add detailed READMEs, API docs, and contribution guidelines'
    });
  }
  
  // コラボレーション
  if (totalPRs < 50 && totalCommits > 1000) {
    suggestions.push({
      area: 'Increase collaborative development',
      priority: 'medium',
      action: 'Contribute to popular open source projects and engage in code reviews'
    });
  }
  
  // 技術的多様性
  const languages = [...new Set(repos.map((r: any) => r.language).filter(Boolean))];
  if (languages.length < 3) {
    suggestions.push({
      area: 'Expand technical skill set',
      priority: 'low',
      action: 'Explore new programming languages and frameworks'
    });
  }
  
  // アクティビティの一貫性
  const recentActivity = repos.filter((r: any) => {
    const daysSinceUpdate = (Date.now() - new Date(r.updated_at).getTime()) / (24 * 60 * 60 * 1000);
    return daysSinceUpdate < 30;
  }).length;
  
  if (recentActivity < 2) {
    suggestions.push({
      area: 'Maintain consistent development activity',
      priority: 'medium',
      action: 'Set regular coding goals and maintain active projects'
    });
  }
  
  // セキュリティプラクティス
  const hasSecurityMentions = repos.some((r: any) => 
    (r.description || '').toLowerCase().includes('secure') ||
    r.name.toLowerCase().includes('security')
  );
  if (!hasSecurityMentions && repos.length > 10) {
    suggestions.push({
      area: 'Incorporate security best practices',
      priority: 'medium',
      action: 'Add security scanning, dependency updates, and secure coding practices'
    });
  }
  
  // 高優先度の改善点を返す
  return suggestions
    .sort((a, b) => {
      const priority = { high: 3, medium: 2, low: 1 };
      return priority[b.priority] - priority[a.priority];
    })
    .slice(0, 4)
    .map(s => s.area);
}