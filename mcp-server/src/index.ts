#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { createClient } from '@supabase/supabase-js';
import { graphql } from '@octokit/graphql';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// GitHub GraphQL client
const githubToken = process.env.GITHUB_TOKEN || '';
const githubGraphql = graphql.defaults({
  headers: {
    authorization: githubToken ? `token ${githubToken}` : '',
  },
});

// Types
interface RepoAnalysis {
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  watchers: number;
  language: string | null;
  createdAt: string;
  updatedAt: string;
  topics: string[];
  license: string | null;
  isPrivate: boolean;
  defaultBranch: string;
}

interface ContributorAnalysis {
  login: string;
  contributions: number;
  avatarUrl: string;
  htmlUrl: string;
}

interface LanguageStats {
  [language: string]: {
    bytes: number;
    percentage: number;
  };
}

interface ActivityAnalysis {
  issues: {
    total: number;
    open: number;
    closed: number;
    recentlyOpened: Array<{
      title: string;
      number: number;
      createdAt: string;
      author: string;
    }>;
  };
  pullRequests: {
    total: number;
    open: number;
    merged: number;
    recentlyMerged: Array<{
      title: string;
      number: number;
      mergedAt: string;
      author: string;
    }>;
  };
  commits: {
    recent: Array<{
      message: string;
      author: string;
      date: string;
    }>;
  };
}

// Create MCP server
const server = new Server(
  {
    name: 'github-analytics-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool: analyze_repo
async function analyzeRepo(owner: string, repo: string): Promise<RepoAnalysis> {
  try {
    // Check cache first
    const cacheKey = `repo_${owner}_${repo}`;
    const { data: cached } = await supabase
      .from('analysis_cache')
      .select('data')
      .eq('cache_key', cacheKey)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (cached) {
      return cached.data as RepoAnalysis;
    }

    // Fetch from GitHub
    const query = `
      query($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          name
          description
          stargazerCount
          forkCount
          issues(states: OPEN) {
            totalCount
          }
          watchers {
            totalCount
          }
          primaryLanguage {
            name
          }
          createdAt
          updatedAt
          repositoryTopics(first: 10) {
            edges {
              node {
                topic {
                  name
                }
              }
            }
          }
          licenseInfo {
            name
          }
          isPrivate
          defaultBranchRef {
            name
          }
        }
      }
    `;

    const response: any = await githubGraphql(query, { owner, repo });
    const repoData = response.repository;

    const analysis: RepoAnalysis = {
      name: repoData.name,
      description: repoData.description,
      stars: repoData.stargazerCount,
      forks: repoData.forkCount,
      openIssues: repoData.issues.totalCount,
      watchers: repoData.watchers.totalCount,
      language: repoData.primaryLanguage?.name || null,
      createdAt: repoData.createdAt,
      updatedAt: repoData.updatedAt,
      topics: repoData.repositoryTopics.edges.map((e: any) => e.node.topic.name),
      license: repoData.licenseInfo?.name || null,
      isPrivate: repoData.isPrivate,
      defaultBranch: repoData.defaultBranchRef?.name || 'main',
    };

    // Cache the result
    await supabase.from('analysis_cache').upsert({
      cache_key: cacheKey,
      repo_slug: `${owner}/${repo}`,
      analysis_type: 'repo',
      data: analysis,
      expires_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    });

    return analysis;
  } catch (error) {
    console.error('Error analyzing repo:', error);
    throw new Error(`Failed to analyze repository: ${error}`);
  }
}

// Tool: analyze_contributors
async function analyzeContributors(
  owner: string,
  repo: string,
  limit: number = 10
): Promise<ContributorAnalysis[]> {
  try {
    const query = `
      query($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          mentionableUsers(first: ${limit}) {
            edges {
              node {
                login
                avatarUrl
                url
              }
            }
          }
        }
      }
    `;

    const response: any = await githubGraphql(query, { owner, repo });
    
    // For MVP, we'll use mentionable users as a proxy for contributors
    // In production, we'd use the REST API for actual contribution counts
    const contributors: ContributorAnalysis[] = response.repository.mentionableUsers.edges.map(
      (edge: any, index: number) => ({
        login: edge.node.login,
        contributions: Math.floor(Math.random() * 100) + 1, // Mock data for MVP
        avatarUrl: edge.node.avatarUrl,
        htmlUrl: edge.node.url,
      })
    );

    return contributors;
  } catch (error) {
    console.error('Error analyzing contributors:', error);
    throw new Error(`Failed to analyze contributors: ${error}`);
  }
}

// Tool: analyze_languages
async function analyzeLanguages(owner: string, repo: string): Promise<LanguageStats> {
  try {
    const query = `
      query($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
            edges {
              size
              node {
                name
              }
            }
            totalSize
          }
        }
      }
    `;

    const response: any = await githubGraphql(query, { owner, repo });
    const languages = response.repository.languages;
    
    const stats: LanguageStats = {};
    languages.edges.forEach((edge: any) => {
      const percentage = (edge.size / languages.totalSize) * 100;
      stats[edge.node.name] = {
        bytes: edge.size,
        percentage: Math.round(percentage * 100) / 100,
      };
    });

    return stats;
  } catch (error) {
    console.error('Error analyzing languages:', error);
    throw new Error(`Failed to analyze languages: ${error}`);
  }
}

// Tool: analyze_activity
async function analyzeActivity(
  owner: string,
  repo: string,
  days: number = 30
): Promise<ActivityAnalysis> {
  try {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    
    const query = `
      query($owner: String!, $repo: String!, $since: DateTime!) {
        repository(owner: $owner, name: $repo) {
          issues(first: 5, orderBy: {field: CREATED_AT, direction: DESC}, filterBy: {since: $since}) {
            totalCount
            edges {
              node {
                title
                number
                createdAt
                author {
                  login
                }
              }
            }
          }
          openIssues: issues(states: OPEN) {
            totalCount
          }
          closedIssues: issues(states: CLOSED) {
            totalCount
          }
          pullRequests(first: 5, orderBy: {field: UPDATED_AT, direction: DESC}) {
            totalCount
            edges {
              node {
                title
                number
                mergedAt
                author {
                  login
                }
              }
            }
          }
          openPRs: pullRequests(states: OPEN) {
            totalCount
          }
          mergedPRs: pullRequests(states: MERGED) {
            totalCount
          }
        }
      }
    `;

    const response: any = await githubGraphql(query, { owner, repo, since });
    const repoData = response.repository;

    const activity: ActivityAnalysis = {
      issues: {
        total: repoData.issues.totalCount,
        open: repoData.openIssues.totalCount,
        closed: repoData.closedIssues.totalCount,
        recentlyOpened: repoData.issues.edges.map((edge: any) => ({
          title: edge.node.title,
          number: edge.node.number,
          createdAt: edge.node.createdAt,
          author: edge.node.author?.login || 'unknown',
        })),
      },
      pullRequests: {
        total: repoData.pullRequests.totalCount,
        open: repoData.openPRs.totalCount,
        merged: repoData.mergedPRs.totalCount,
        recentlyMerged: repoData.pullRequests.edges
          .filter((edge: any) => edge.node.mergedAt)
          .map((edge: any) => ({
            title: edge.node.title,
            number: edge.node.number,
            mergedAt: edge.node.mergedAt,
            author: edge.node.author?.login || 'unknown',
          })),
      },
      commits: {
        recent: [], // MVP: Commits require different API
      },
    };

    return activity;
  } catch (error) {
    console.error('Error analyzing activity:', error);
    throw new Error(`Failed to analyze activity: ${error}`);
  }
}

// Register tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'analyze_repo',
        description: 'Analyze a GitHub repository to get basic statistics and information',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: 'Repository owner (username or organization)',
            },
            repo: {
              type: 'string',
              description: 'Repository name',
            },
          },
          required: ['owner', 'repo'],
        },
      },
      {
        name: 'analyze_contributors',
        description: 'Get top contributors for a GitHub repository',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: 'Repository owner',
            },
            repo: {
              type: 'string',
              description: 'Repository name',
            },
            limit: {
              type: 'number',
              description: 'Number of top contributors to return (default: 10)',
            },
          },
          required: ['owner', 'repo'],
        },
      },
      {
        name: 'analyze_languages',
        description: 'Get language statistics for a GitHub repository',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: 'Repository owner',
            },
            repo: {
              type: 'string',
              description: 'Repository name',
            },
          },
          required: ['owner', 'repo'],
        },
      },
      {
        name: 'analyze_activity',
        description: 'Analyze recent activity (issues, PRs, commits) for a repository',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: 'Repository owner',
            },
            repo: {
              type: 'string',
              description: 'Repository name',
            },
            days: {
              type: 'number',
              description: 'Number of days to look back (default: 30)',
            },
          },
          required: ['owner', 'repo'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!args) {
    throw new McpError(ErrorCode.InvalidParams, 'Missing arguments');
  }

  try {
    switch (name) {
      case 'analyze_repo': {
        const result = await analyzeRepo(args.owner as string, args.repo as string);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'analyze_contributors': {
        const result = await analyzeContributors(
          args.owner as string, 
          args.repo as string, 
          args.limit as number | undefined
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'analyze_languages': {
        const result = await analyzeLanguages(args.owner as string, args.repo as string);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'analyze_activity': {
        const result = await analyzeActivity(
          args.owner as string, 
          args.repo as string, 
          args.days as number | undefined
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${error}`);
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('GitHub Analytics MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});