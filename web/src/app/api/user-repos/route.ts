import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function GET(request: NextRequest) {
  try {
    // GitHubユーザー名を取得（今回はSupabase認証から取得）
    const username = request.nextUrl.searchParams.get('username');
    
    let url = 'https://api.github.com/user/repos?per_page=100&sort=updated';
    
    if (username) {
      // 特定のユーザーのパブリックリポジトリ
      url = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;
    }
    
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const repos = await response.json();
    
    // 必要な情報だけを抽出
    const formattedRepos = repos.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      homepage: repo.homepage,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      openIssues: repo.open_issues_count,
      language: repo.language,
      topics: repo.topics || [],
      isPrivate: repo.private,
      isFork: repo.fork,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      pushedAt: repo.pushed_at,
      size: repo.size,
      defaultBranch: repo.default_branch,
      owner: {
        login: repo.owner.login,
        avatarUrl: repo.owner.avatar_url,
        type: repo.owner.type,
      },
    }));

    // スター数でソート
    formattedRepos.sort((a: any, b: any) => b.stars - a.stars);

    return NextResponse.json({
      repos: formattedRepos,
      count: formattedRepos.length,
    });
  } catch (error: any) {
    console.error('Error fetching user repos:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}