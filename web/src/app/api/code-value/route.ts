import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Industry standard costs for code development
const COST_FACTORS = {
  // Average cost per line of code by language (in USD)
  languages: {
    // High-value languages
    Rust: 2.5,
    Go: 2.3,
    TypeScript: 2.0,
    Swift: 2.2,
    Kotlin: 2.1,
    Scala: 2.4,
    
    // Medium-value languages
    JavaScript: 1.8,
    Python: 1.9,
    Java: 1.7,
    'C++': 2.0,
    C: 1.9,
    'C#': 1.8,
    Ruby: 1.7,
    PHP: 1.5,
    
    // Standard languages
    HTML: 1.0,
    CSS: 1.1,
    Shell: 1.3,
    SQL: 1.4,
    
    // Default for unknown languages
    default: 1.5
  },
  
  // Multipliers based on repository characteristics
  multipliers: {
    hasTests: 1.3,        // Code with tests is more valuable
    hasDocs: 1.2,         // Well-documented code
    hasCI: 1.15,          // CI/CD setup adds value
    isPopular: 1.5,       // Popular repos (100+ stars)
    isVeryPopular: 2.0,   // Very popular repos (1000+ stars)
    isMaintained: 1.1,    // Recently updated repos
    hasContributors: 1.2, // Multiple contributors
  },
  
  // Time-based depreciation (per year)
  depreciation: 0.15,
  
  // Complexity factors
  complexity: {
    small: 1.0,    // < 1000 lines
    medium: 1.2,   // 1000-10000 lines
    large: 1.4,    // 10000-50000 lines
    xlarge: 1.6,   // > 50000 lines
  }
};

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Fetch user's repositories
    const repos = await fetchAllUserRepos(username);
    
    // Calculate value for each repository
    const repoValues = await Promise.all(
      repos.map(repo => calculateRepoValue(repo, username))
    );
    
    // Calculate totals and insights
    const totalValue = repoValues.reduce((sum, rv) => sum + rv.value, 0);
    const totalLines = repoValues.reduce((sum, rv) => sum + rv.estimatedLines, 0);
    
    // Generate insights
    const insights = generateInsights(repoValues, totalValue, totalLines);
    
    // Calculate OSS contribution value
    const ossValue = calculateOSSValue(repoValues);
    
    // Calculate potential earnings
    const potentialEarnings = calculatePotentialEarnings(totalValue, totalLines);

    return NextResponse.json({
      totalValue: Math.round(totalValue),
      totalValueFormatted: formatCurrency(totalValue),
      totalLines,
      repositories: repoValues
        .sort((a, b) => b.value - a.value)
        .slice(0, 20), // Top 20 repos
      insights,
      ossValue: {
        total: Math.round(ossValue),
        formatted: formatCurrency(ossValue),
        message: `Your open source contributions would cost ${formatCurrency(ossValue)} if outsourced`
      },
      potentialEarnings,
      breakdown: {
        byLanguage: calculateLanguageBreakdown(repoValues),
        byYear: calculateYearlyBreakdown(repoValues),
        byType: calculateTypeBreakdown(repoValues)
      }
    });
  } catch (error: any) {
    console.error('Code value calculation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate code value' },
      { status: 500 }
    );
  }
}

async function fetchAllUserRepos(username: string): Promise<any[]> {
  const allRepos = [];
  let page = 1;
  let hasMore = true;

  while (hasMore && page <= 10) {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&page=${page}&type=all`,
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
      page++;
    }
  }

  return allRepos;
}

async function calculateRepoValue(repo: any, username: string): Promise<any> {
  // Estimate lines of code based on repository size (rough approximation)
  // GitHub's size is in KB, we estimate ~25 lines per KB for code files
  const estimatedLines = Math.round(repo.size * 25);
  
  // Get base cost per line for the primary language
  const languageCost = COST_FACTORS.languages[repo.language] || COST_FACTORS.languages.default;
  
  // Calculate base value
  let value = estimatedLines * languageCost;
  
  // Apply multipliers
  let multiplier = 1.0;
  
  // Check for tests (common test indicators in repo name or description)
  if (repo.name.includes('test') || (repo.description?.toLowerCase() || '').includes('test')) {
    multiplier *= COST_FACTORS.multipliers.hasTests;
  }
  
  // Check for documentation
  if (repo.has_pages || (repo.description && repo.description.length > 50)) {
    multiplier *= COST_FACTORS.multipliers.hasDocs;
  }
  
  // Check for CI/CD
  if (repo.has_actions) {
    multiplier *= COST_FACTORS.multipliers.hasCI;
  }
  
  // Popularity multiplier
  if (repo.stargazers_count >= 1000) {
    multiplier *= COST_FACTORS.multipliers.isVeryPopular;
  } else if (repo.stargazers_count >= 100) {
    multiplier *= COST_FACTORS.multipliers.isPopular;
  }
  
  // Maintenance status
  const lastUpdate = new Date(repo.updated_at);
  const monthsSinceUpdate = (Date.now() - lastUpdate.getTime()) / (30 * 24 * 60 * 60 * 1000);
  if (monthsSinceUpdate < 6) {
    multiplier *= COST_FACTORS.multipliers.isMaintained;
  }
  
  // Apply depreciation for older code
  const createdDate = new Date(repo.created_at);
  const yearsOld = (Date.now() - createdDate.getTime()) / (365 * 24 * 60 * 60 * 1000);
  const depreciationFactor = Math.max(0.3, 1 - (yearsOld * COST_FACTORS.depreciation));
  
  // Complexity factor
  let complexityMultiplier = COST_FACTORS.complexity.small;
  if (estimatedLines > 50000) {
    complexityMultiplier = COST_FACTORS.complexity.xlarge;
  } else if (estimatedLines > 10000) {
    complexityMultiplier = COST_FACTORS.complexity.large;
  } else if (estimatedLines > 1000) {
    complexityMultiplier = COST_FACTORS.complexity.medium;
  }
  
  value = value * multiplier * depreciationFactor * complexityMultiplier;
  
  return {
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    language: repo.language,
    estimatedLines,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    value: Math.round(value),
    valueFormatted: formatCurrency(value),
    factors: {
      baseValue: estimatedLines * languageCost,
      multiplier: Math.round(multiplier * 100) / 100,
      depreciation: Math.round(depreciationFactor * 100) / 100,
      complexity: complexityMultiplier
    },
    isPrivate: repo.private,
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    url: repo.html_url
  };
}

function calculateOSSValue(repoValues: any[]): number {
  // Calculate value of only public (OSS) repositories
  return repoValues
    .filter(rv => !rv.isPrivate)
    .reduce((sum, rv) => sum + rv.value, 0);
}

function calculatePotentialEarnings(totalValue: number, totalLines: number): any {
  // Calculate various earning scenarios
  const hourlyRate = totalValue / (totalLines / 50); // Assuming 50 lines per hour
  const monthlyRate = totalValue / 12; // If developed over a year
  const projectRate = totalValue * 0.7; // Typical project discount
  
  return {
    hourly: {
      rate: Math.round(hourlyRate),
      formatted: formatCurrency(hourlyRate) + '/hour',
      description: 'Based on 50 lines of code per hour'
    },
    monthly: {
      rate: Math.round(monthlyRate),
      formatted: formatCurrency(monthlyRate) + '/month',
      description: 'If developed over 12 months'
    },
    project: {
      rate: Math.round(projectRate),
      formatted: formatCurrency(projectRate),
      description: 'Typical project-based pricing (30% discount)'
    },
    freelance: {
      rate: Math.round(totalValue * 1.5),
      formatted: formatCurrency(totalValue * 1.5),
      description: 'Freelance market rate (50% premium)'
    }
  };
}

function generateInsights(repoValues: any[], totalValue: number, totalLines: number): string[] {
  const insights = [];
  
  // Total value insight
  insights.push(`Your code portfolio is worth ${formatCurrency(totalValue)} in development costs`);
  
  // Lines of code insight
  if (totalLines > 1000000) {
    insights.push(`You've written over ${Math.round(totalLines / 1000000)}M lines of code - that's enterprise scale!`);
  } else if (totalLines > 100000) {
    insights.push(`${Math.round(totalLines / 1000)}K lines of code - equivalent to several large applications`);
  } else if (totalLines > 10000) {
    insights.push(`${Math.round(totalLines / 1000)}K lines of code - a substantial codebase`);
  }
  
  // Most valuable language
  const languageValues: { [key: string]: number } = {};
  repoValues.forEach(rv => {
    if (rv.language) {
      languageValues[rv.language] = (languageValues[rv.language] || 0) + rv.value;
    }
  });
  const topLanguage = Object.entries(languageValues)
    .sort(([, a], [, b]) => b - a)[0];
  if (topLanguage) {
    insights.push(`${topLanguage[0]} is your most valuable skill, worth ${formatCurrency(topLanguage[1])}`);
  }
  
  // Popular repos
  const popularRepos = repoValues.filter(rv => rv.stars >= 100);
  if (popularRepos.length > 0) {
    const popularValue = popularRepos.reduce((sum, rv) => sum + rv.value, 0);
    insights.push(`Your ${popularRepos.length} popular projects add ${formatCurrency(popularValue)} in community value`);
  }
  
  // OSS contribution
  const ossRepos = repoValues.filter(rv => !rv.isPrivate);
  if (ossRepos.length > 0) {
    const ossValue = ossRepos.reduce((sum, rv) => sum + rv.value, 0);
    insights.push(`You've contributed ${formatCurrency(ossValue)} worth of code to open source`);
  }
  
  return insights;
}

function calculateLanguageBreakdown(repoValues: any[]): any {
  const breakdown: { [key: string]: { value: number; lines: number; repos: number } } = {};
  
  repoValues.forEach(rv => {
    const lang = rv.language || 'Other';
    if (!breakdown[lang]) {
      breakdown[lang] = { value: 0, lines: 0, repos: 0 };
    }
    breakdown[lang].value += rv.value;
    breakdown[lang].lines += rv.estimatedLines;
    breakdown[lang].repos++;
  });
  
  return Object.entries(breakdown)
    .map(([language, data]) => ({
      language,
      value: Math.round(data.value),
      valueFormatted: formatCurrency(data.value),
      lines: data.lines,
      repos: data.repos,
      percentage: Math.round((data.value / repoValues.reduce((sum, rv) => sum + rv.value, 0)) * 100)
    }))
    .sort((a, b) => b.value - a.value);
}

function calculateYearlyBreakdown(repoValues: any[]): any {
  const breakdown: { [key: string]: { value: number; repos: number } } = {};
  
  repoValues.forEach(rv => {
    const year = new Date(rv.createdAt).getFullYear();
    if (!breakdown[year]) {
      breakdown[year] = { value: 0, repos: 0 };
    }
    breakdown[year].value += rv.value;
    breakdown[year].repos++;
  });
  
  return Object.entries(breakdown)
    .map(([year, data]) => ({
      year: parseInt(year),
      value: Math.round(data.value),
      valueFormatted: formatCurrency(data.value),
      repos: data.repos
    }))
    .sort((a, b) => b.year - a.year);
}

function calculateTypeBreakdown(repoValues: any[]): any {
  const publicValue = repoValues
    .filter(rv => !rv.isPrivate)
    .reduce((sum, rv) => sum + rv.value, 0);
  
  const privateValue = repoValues
    .filter(rv => rv.isPrivate)
    .reduce((sum, rv) => sum + rv.value, 0);
  
  return {
    public: {
      value: Math.round(publicValue),
      formatted: formatCurrency(publicValue),
      count: repoValues.filter(rv => !rv.isPrivate).length
    },
    private: {
      value: Math.round(privateValue),
      formatted: formatCurrency(privateValue),
      count: repoValues.filter(rv => rv.isPrivate).length
    }
  };
}

function formatCurrency(value: number): string {
  // Format in both USD and JPY
  const usd = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
  
  const jpy = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value * 150); // Rough USD to JPY conversion
  
  return `${usd} (${jpy})`;
}