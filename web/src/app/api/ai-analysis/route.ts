import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini API設定
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }) : null;

export async function POST(request: NextRequest) {
  try {
    const { repoData, languages, activity, contributors, lang = 'ja' } = await request.json();

    // Generate AI insights with Gemini
    const insights = await generateAIInsightsWithGemini(repoData, languages, activity, contributors, lang);
    const recommendations = generateRecommendations(repoData, activity, lang);
    const healthScore = calculateHealthScore(repoData, activity, contributors);

    return NextResponse.json({
      insights,
      recommendations,
      healthScore,
      competitorAnalysis: await getCompetitorAnalysis(repoData),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to generate AI analysis' },
      { status: 500 }
    );
  }
}

async function generateAIInsightsWithGemini(repo: any, languages: any, activity: any, contributors: any, lang: string = 'ja') {
  try {
    // Check if Gemini API is configured
    if (!model) {
      return generateBasicInsights(repo, languages, activity, contributors, lang);
    }
    
    // Use Gemini API for advanced analysis
    const prompt = `
    Analyze this GitHub repository in detail.
    
    Repository Info:
    - Name: ${repo.name}
    - Description: ${repo.description || 'None'}
    - Stars: ${repo.stars}
    - Forks: ${repo.forks}
    - Open Issues: ${repo.openIssues}
    
    Recent Activity (30 days):
    - Commits: ${activity.commits.total}
    - Authors: ${activity.commits.authors}
    - Issues: ${activity.issues.total} (Open: ${activity.issues.open}, Closed: ${activity.issues.closed})
    - PRs: ${activity.pullRequests.total} (Open: ${activity.pullRequests.open}, Merged: ${activity.pullRequests.merged})
    
    Top Languages: ${languages.slice(0, 3).map((l: any) => `${l.language}(${l.percentage}%)`).join(', ')}
    Contributors: ${contributors.length}
    
    Analyze from these perspectives:
    1. Project health and sustainability
    2. Community activity level
    3. Technical strengths and challenges
    4. Growth potential
    5. Improvement suggestions
    
    Respond in JSON format with this structure:
    {
      "summary": "Overall project assessment (about 100 chars)",
      "strengths": ["strength1", "strength2", "strength3"],
      "weaknesses": ["weakness1", "weakness2"],
      "opportunities": ["opportunity1", "opportunity2"],
      "threats": ["threat1", "threat2"],
      "futureGrowth": "Future growth prediction (about 50 chars)",
      "investmentValue": "Investment value rating (A+ to F scale)"
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // JSONパース（エラーハンドリング付き）
    let aiAnalysis;
    try {
      // Geminiの応答からJSONを抽出
      const jsonMatch = text.match(/\{[\s\S]*\}/); 
      if (jsonMatch) {
        aiAnalysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      // フォールバック
      return generateBasicInsights(repo, languages, activity, contributors);
    }

    // AI分析結果を整形して返す
    const insights = [];
    
    if (aiAnalysis.strengths && aiAnalysis.strengths.length > 0) {
      insights.push({
        type: 'positive',
        title: 'Project Strengths',
        description: aiAnalysis.strengths.join(', '),
        aiGenerated: true,
      });
    }
    
    if (aiAnalysis.weaknesses && aiAnalysis.weaknesses.length > 0) {
      insights.push({
        type: 'warning',
        title: 'Areas for Improvement',
        description: aiAnalysis.weaknesses.join(', '),
        suggestion: aiAnalysis.opportunities ? aiAnalysis.opportunities[0] : null,
        aiGenerated: true,
      });
    }
    
    insights.push({
      type: 'info',
      title: 'AI Overall Assessment',
      description: aiAnalysis.summary || 'The project shows stable growth',
      metric: aiAnalysis.investmentValue || 'B',
      futureGrowth: aiAnalysis.futureGrowth,
      aiGenerated: true,
    });
    
    // 基本的な分析も追加
    const basicInsights = generateBasicInsights(repo, languages, activity, contributors, lang);
    return [...insights, ...basicInsights];
    
  } catch (error) {
    console.error('Gemini API error:', error);
    // エラー時は基本的な分析に フォールバック
    return generateBasicInsights(repo, languages, activity, contributors, lang);
  }
}

function generateBasicInsights(repo: any, languages: any, activity: any, contributors: any, lang: string = 'ja') {
  const insights = [];

  // Activity insights
  if (activity.commits.total > 100) {
    insights.push({
      type: 'positive',
      title: 'High Development Activity',
      description: `This repository shows strong development momentum with ${activity.commits.total} commits in the last 30 days.`,
      metric: activity.commits.total,
    });
  } else if (activity.commits.total < 10) {
    insights.push({
      type: 'warning',
      title: 'Low Recent Activity',
      description: 'Consider increasing development activity to maintain project momentum.',
      suggestion: 'Set up regular sprint cycles or contribution guidelines.',
    });
  }

  // Contributor insights
  const contributorDiversity = contributors.length;
  if (contributorDiversity > 20) {
    insights.push({
      type: 'positive',
      title: 'Strong Community',
      description: `With ${contributorDiversity} contributors, this project has a healthy and diverse community.`,
    });
  }

  // Issue management
  const issueRatio = repo.openIssues / (repo.openIssues + activity.issues.closed || 1);
  if (issueRatio > 0.7) {
    insights.push({
      type: 'warning',
      title: 'Issue Backlog Growing',
      description: 'The ratio of open to closed issues suggests the backlog is growing.',
      suggestion: 'Consider organizing issue triage sessions or expanding the maintainer team.',
    });
  }

  // Language diversity
  if (languages && languages.length > 5) {
    insights.push({
      type: 'info',
      title: 'Diverse Tech Stack',
      description: `This project uses ${languages.length} different languages, indicating a complex architecture.`,
      suggestion: 'Ensure documentation covers all technology areas.',
    });
  }

  return insights;
}

function generateRecommendations(repo: any, activity: any, lang: string = 'ja') {
  const recommendations = [];

  // Growth recommendations
  if (repo.stars < 100) {
    recommendations.push({
      priority: 'high',
      category: 'growth',
      title: 'Increase Visibility',
      actions: [
        'Add comprehensive README with examples',
        'Create detailed documentation',
        'Share on Reddit, HackerNews, and dev.to',
        'Add badges for build status and coverage',
      ],
    });
  }

  // Maintenance recommendations
  if (repo.openIssues > 50) {
    recommendations.push({
      priority: 'medium',
      category: 'maintenance',
      title: 'Improve Issue Management',
      actions: [
        'Label and categorize all issues',
        'Set up issue templates',
        'Create a contributing guide',
        'Schedule regular triage meetings',
      ],
    });
  }

  // Security recommendations
  recommendations.push({
    priority: 'high',
    category: 'security',
    title: 'Security Best Practices',
    actions: [
      'Enable Dependabot alerts',
      'Set up CodeQL analysis',
      'Add security policy (SECURITY.md)',
      'Regular dependency updates',
    ],
  });

  return recommendations;
}

function calculateHealthScore(repo: any, activity: any, contributors: any) {
  let score = 0;
  let factors = [];

  // Activity score (25 points)
  const activityScore = Math.min(25, (activity.commits.total / 4));
  score += activityScore;
  factors.push({
    name: 'Activity',
    score: activityScore,
    max: 25,
    description: 'Based on recent commits and PRs',
  });

  // Community score (25 points)
  const communityScore = Math.min(25, contributors.length * 2.5);
  score += communityScore;
  factors.push({
    name: 'Community',
    score: communityScore,
    max: 25,
    description: 'Based on contributor diversity',
  });

  // Popularity score (25 points)
  const popularityScore = Math.min(25, (repo.stars / 400));
  score += popularityScore;
  factors.push({
    name: 'Popularity',
    score: popularityScore,
    max: 25,
    description: 'Based on stars and watchers',
  });

  // Maintenance score (25 points)
  const closedIssueRatio = activity.issues.closed / (activity.issues.total || 1);
  const maintenanceScore = closedIssueRatio * 25;
  score += maintenanceScore;
  factors.push({
    name: 'Maintenance',
    score: maintenanceScore,
    max: 25,
    description: 'Based on issue resolution rate',
  });

  return {
    total: Math.round(score),
    grade: getGrade(score),
    factors,
  };
}

function getGrade(score: number): string {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

async function getCompetitorAnalysis(repo: any) {
  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    
    // リポジトリのトピックと言語から類似リポジトリを検索
    const searchQuery = [
      repo.language ? `language:${repo.language}` : '',
      repo.topics && repo.topics.length > 0 ? repo.topics[0] : '',
      'stars:>100', // 最低100スター以上
    ].filter(Boolean).join(' ');
    
    const searchResponse = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=stars&order=desc&per_page=20`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );
    
    if (!searchResponse.ok) {
      throw new Error('Failed to search similar repos');
    }
    
    const searchData = await searchResponse.json();
    const similarRepos = searchData.items || [];
    
    // 現在のリポジトリを除外し、上位5件を取得
    const competitors = similarRepos
      .filter((r: any) => r.full_name !== `${repo.owner}/${repo.repo}`)
      .slice(0, 5);
    
    // 各競合リポジトリの詳細情報を取得
    const competitorDetails = await Promise.all(
      competitors.map(async (competitor: any) => {
        try {
          // 過去30日間のコミット数を取得
          const since = new Date();
          since.setDate(since.getDate() - 30);
          
          const commitsResponse = await fetch(
            `https://api.github.com/repos/${competitor.full_name}/commits?since=${since.toISOString()}&per_page=1`,
            {
              headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json',
              },
            }
          );
          
          // コミット数はヘッダーから取得
          const linkHeader = commitsResponse.headers.get('link');
          let recentCommits = 0;
          if (linkHeader) {
            const match = linkHeader.match(/page=(\d+)>; rel="last"/);
            recentCommits = match ? parseInt(match[1]) : 0;
          }
          
          // 成長率を計算（簡易版：最近のアクティビティとスター数の変化から推定）
          const growthScore = recentCommits > 0 ? Math.min(50, recentCommits) : 0;
          const growthPercentage = Math.round(growthScore * 0.3);
          
          return {
            name: competitor.full_name,
            stars: competitor.stargazers_count,
            forks: competitor.forks_count,
            issues: competitor.open_issues_count,
            language: competitor.language,
            description: competitor.description,
            url: competitor.html_url,
            updatedAt: competitor.updated_at,
            growth: `+${growthPercentage}%`,
            recentActivity: recentCommits,
            comparison: generateComparison(repo, competitor, recentCommits),
          };
        } catch (error) {
          console.error(`Error fetching details for ${competitor.full_name}:`, error);
          return {
            name: competitor.full_name,
            stars: competitor.stargazers_count,
            growth: 'N/A',
            comparison: 'データ取得エラー',
          };
        }
      })
    );
    
    // 市場ポジションを計算
    const marketPosition = calculateMarketPosition(repo, similarRepos);
    
    return {
      similarRepos: competitorDetails,
      marketPosition,
      analysis: {
        totalCompetitors: searchData.total_count || 0,
        averageStars: Math.round(
          competitorDetails.reduce((sum, c) => sum + c.stars, 0) / Math.max(1, competitorDetails.length)
        ),
        yourPosition: repo.stars > competitorDetails[0]?.stars ? 'Leader' : 'Challenger',
      },
    };
  } catch (error) {
    console.error('Competitor analysis error:', error);
    // エラー時はフォールバック
    return {
      similarRepos: [],
      marketPosition: {
        rank: 0,
        total: 0,
        percentile: 0,
      },
      analysis: {
        totalCompetitors: 0,
        averageStars: 0,
        yourPosition: 'Unknown',
      },
    };
  }
}

function generateComparison(repo: any, competitor: any, recentActivity: number): string {
  const comparisons = [];
  
  // Compare stars
  if (competitor.stargazers_count > repo.stars) {
    comparisons.push(`${Math.round(competitor.stargazers_count / repo.stars * 100 - 100)}% more stars`);
  } else {
    comparisons.push(`${Math.round(100 - competitor.stargazers_count / repo.stars * 100)}% fewer stars`);
  }
  
  // Compare activity
  if (recentActivity > 50) {
    comparisons.push('Very active');
  } else if (recentActivity > 10) {
    comparisons.push('Active development');
  } else {
    comparisons.push('Slow development pace');
  }
  
  // Compare issue management
  if (competitor.open_issues_count < repo.openIssues * 0.5) {
    comparisons.push('Excellent issue management');
  }
  
  return comparisons.join(', ');
}

function calculateMarketPosition(repo: any, allRepos: any[]): any {
  // リポジトリのスター数でランキングを計算
  const sortedRepos = [...allRepos].sort((a, b) => b.stargazers_count - a.stargazers_count);
  const repoIndex = sortedRepos.findIndex(r => r.stargazers_count <= repo.stars);
  const rank = repoIndex === -1 ? sortedRepos.length + 1 : repoIndex + 1;
  const total = Math.min(100, sortedRepos.length); // 上位100件で計算
  const percentile = Math.round((1 - rank / total) * 100);
  
  return {
    rank,
    total,
    percentile: Math.max(0, percentile),
  };
}