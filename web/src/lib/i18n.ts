export type Language = 'en' | 'ja';

export const translations = {
  en: {
    // Header
    appName: 'GitHub Analytics MCP',
    signOut: 'Sign out',
    signInWithGitHub: 'Sign in with GitHub',
    
    // Landing page
    heroTitle: 'GitHub Repository Analytics with AI',
    heroDescription: 'Analyze your GitHub repositories with AI-powered insights, visualizations, and growth recommendations',
    features: 'Key Features',
    feature1Title: 'Repository Analytics',
    feature1Description: 'Real-time statistics and comprehensive metrics for any GitHub repository',
    feature2Title: 'Contributor Analysis',
    feature2Description: 'Identify top contributors and track community engagement',
    feature3Title: 'Language Breakdown',
    feature3Description: 'Visualize technology stack and language distribution',
    feature4Title: 'Activity Trends',
    feature4Description: 'Monitor commits, PRs, and issues over time',
    feature5Title: 'AI Insights',
    feature5Description: 'Get actionable recommendations powered by Gemini AI',
    feature6Title: 'Secure & Private',
    feature6Description: 'Your data is protected with enterprise-grade security',
    
    // Tabs
    myRepositories: 'My Repositories',
    searchRepository: 'Search Any Repository',
    
    // Repository List
    yourRepositories: 'Your Repositories',
    loadingRepositories: 'Loading repositories...',
    noRepositories: 'No repositories found',
    noDescription: 'No description',
    createFirst: 'Create your first repository on GitHub to see it here',
    private: 'Private',
    analyze: 'Analyze',
    
    // Search
    analyzeAnyRepository: 'Analyze Any Repository',
    searchPlaceholder: 'e.g. facebook/react or https://github.com/owner/repo',
    analyzing: 'Analyzing...',
    analyzeButton: 'Analyze',
    
    // Repository Overview
    stars: 'Stars',
    forks: 'Forks',
    openIssues: 'Open Issues',
    watchers: 'Watchers',
    primaryLanguage: 'Primary Language',
    license: 'License',
    created: 'Created',
    lastUpdated: 'Last Updated',
    topics: 'Topics',
    unknown: 'Unknown',
    noLicense: 'No license',
    
    // Language Composition
    languageComposition: 'Language Composition',
    
    // Contributors
    topContributors: 'Top Contributors',
    commits: 'commits',
    
    // AI Analysis
    aiAnalysisTitle: 'AI Deep Analysis (Pro Feature)',
    aiAnalysisDescription: 'Gemini AI analyzes this repository in detail and evaluates growth strategies and investment value',
    startAiAnalysis: 'Start AI Analysis',
    aiAnalyzing: 'AI Analyzing...',
    aiAnalysisReport: 'AI Analysis Report',
    
    // Health Score
    healthScore: 'Health Score',
    activity: 'Activity',
    community: 'Community',
    popularity: 'Popularity',
    maintenance: 'Maintenance',
    basedOnRecentCommits: 'Based on recent commits and PRs',
    basedOnContributorDiversity: 'Based on contributor diversity',
    basedOnStars: 'Based on stars and watchers',
    basedOnIssueResolution: 'Based on issue resolution rate',
    
    // AI Insights
    aiInsights: 'AI Insights',
    projectStrengths: 'Project Strengths',
    improvementNeeded: 'Areas for Improvement',
    aiOverallRating: 'AI Overall Rating',
    suggestion: 'Suggestion',
    futureGrowth: 'Future Growth',
    
    // Recommendations
    recommendedActions: 'Recommended Actions',
    highPriority: 'High',
    mediumPriority: 'Medium',
    lowPriority: 'Low',
    
    // Competitor Analysis
    competitorAnalysis: 'Competitor Analysis',
    marketPosition: 'Market Position',
    averageCompetitorStars: 'Competitor Average Stars',
    totalCompetitors: 'Total Competitors',
    position: 'Position',
    leader: 'Leader',
    challenger: 'Challenger',
    comparison: 'Comparison',
    mainLanguage: 'Main Language',
    growth: 'Growth',
    commitsPerMonth: 'commits/month',
    noSimilarRepos: 'No similar repositories found',
    
    // Activity
    recentActivity: 'Recent Activity',
    by: 'by',
    authors: 'authors',
    issues: 'Issues',
    pullRequests: 'Pull Requests',
    open: 'Open',
    closed: 'Closed',
    merged: 'Merged',
    
    // Usage Status
    usageStatus: 'Usage Status',
    analysesThisMonth: 'Analyses This Month',
    aiAnalysisUsage: 'AI Analysis Usage',
    proFeature: 'Pro Feature',
    cachePeriod: 'Cache Period',
    dataUpdateFrequency: 'Data Update Frequency',
    hours: 'hours',
    
    // Pricing
    pricing: 'Pricing Plans',
    freePlan: 'Free Plan',
    proPlan: 'Pro Plan',
    businessPlan: 'Business Plan',
    perMonth: '/month',
    free: 'Free',
    currentPlan: 'Current Plan',
    selectPlan: 'Select Plan',
    upgradeToPro: 'Upgrade to Pro Plan',
    aiDeepAnalysis: 'AI Deep Analysis (Gemini Powered)',
    monthlyRepoLimit: 'Up to 100 repositories per month',
    csvJsonExport: 'CSV/JSON Export',
    shorterCache: '6-hour cache (fresher data)',
    startMonthly: 'Start for $15/month',
    
    // Errors
    invalidGitHubUrl: 'Invalid GitHub URL',
    pleaseEnterValid: 'Please enter a valid GitHub URL or owner/repo format',
    failedToAnalyze: 'Failed to analyze repository',
    failedToGetAi: 'Failed to get AI analysis',
    
    // Comparison descriptions
    moreStars: '% more stars',
    fewerStars: '% fewer stars',
    veryActive: 'Very active',
    activeDevelopment: 'Active development',
    slowDevelopment: 'Slow development pace',
    excellentIssueManagement: 'Excellent issue management',
  },
  
  ja: {
    // Header
    appName: 'GitHub Analytics MCP',
    signOut: 'サインアウト',
    signInWithGitHub: 'GitHubでサインイン',
    
    // Landing page
    heroTitle: 'AIを活用したGitHubリポジトリ分析',
    heroDescription: 'GitHubリポジトリをAIが解析し、洞察、可視化、成長戦略を提供します',
    features: '主な機能',
    feature1Title: 'リポジトリ分析',
    feature1Description: 'GitHubリポジトリのリアルタイム統計と包括的なメトリクス',
    feature2Title: '貢献者分析',
    feature2Description: 'トップ貢献者の特定とコミュニティ参加度の追跡',
    feature3Title: '言語分析',
    feature3Description: '技術スタックと言語構成の可視化',
    feature4Title: 'アクティビティ傾向',
    feature4Description: 'コミット、PR、イシューの経時的な監視',
    feature5Title: 'AI洞察',
    feature5Description: 'Gemini AIによる実用的な推奨事項',
    feature6Title: 'セキュアで安全',
    feature6Description: 'エンタープライズレベルのセキュリティでデータを保護',
    
    // Tabs
    myRepositories: '自分のリポジトリ',
    searchRepository: '任意のリポジトリを検索',
    
    // Repository List
    yourRepositories: 'あなたのリポジトリ',
    loadingRepositories: 'リポジトリを読み込み中...',
    noRepositories: 'リポジトリが見つかりません',
    noDescription: '説明なし',
    createFirst: 'GitHubで最初のリポジトリを作成すると、ここに表示されます',
    private: 'プライベート',
    analyze: '分析',
    
    // Search
    analyzeAnyRepository: '任意のリポジトリを分析',
    searchPlaceholder: '例: facebook/react または https://github.com/owner/repo',
    analyzing: '分析中...',
    analyzeButton: '分析',
    
    // Repository Overview
    stars: 'スター',
    forks: 'フォーク',
    openIssues: 'オープンイシュー',
    watchers: 'ウォッチャー',
    primaryLanguage: '主要言語',
    license: 'ライセンス',
    created: '作成日',
    lastUpdated: '最終更新',
    topics: 'トピック',
    unknown: '不明',
    noLicense: 'ライセンスなし',
    
    // Language Composition
    languageComposition: '言語構成',
    
    // Contributors
    topContributors: 'トップ貢献者',
    commits: 'コミット',
    
    // AI Analysis
    aiAnalysisTitle: 'AI深層分析（Pro機能）',
    aiAnalysisDescription: 'Gemini AIがこのリポジトリを詳細に分析し、成長戦略や投資価値を評価します',
    startAiAnalysis: 'AI分析を開始',
    aiAnalyzing: 'AI分析中...',
    aiAnalysisReport: 'AI分析レポート',
    
    // Health Score
    healthScore: '健全性スコア',
    activity: 'アクティビティ',
    community: 'コミュニティ',
    popularity: '人気度',
    maintenance: 'メンテナンス',
    basedOnRecentCommits: '最近のコミットとPRに基づく',
    basedOnContributorDiversity: '貢献者の多様性に基づく',
    basedOnStars: 'スターとウォッチャーに基づく',
    basedOnIssueResolution: 'イシュー解決率に基づく',
    
    // AI Insights
    aiInsights: 'AIによる洞察',
    projectStrengths: 'プロジェクトの強み',
    improvementNeeded: '改善が必要な点',
    aiOverallRating: 'AI総合評価',
    suggestion: '提案',
    futureGrowth: '成長予測',
    
    // Recommendations
    recommendedActions: '推奨アクション',
    highPriority: '高',
    mediumPriority: '中',
    lowPriority: '低',
    
    // Competitor Analysis
    competitorAnalysis: '競合分析',
    marketPosition: '市場ポジション',
    averageCompetitorStars: '競合平均スター',
    totalCompetitors: '総競合数',
    position: 'ポジション',
    leader: 'リーダー',
    challenger: 'チャレンジャー',
    comparison: '比較',
    mainLanguage: '主要言語',
    growth: '成長率',
    commitsPerMonth: 'コミット/月',
    noSimilarRepos: '類似リポジトリが見つかりませんでした',
    
    // Activity
    recentActivity: '最近のアクティビティ',
    by: 'by',
    authors: '名の作者',
    issues: 'イシュー',
    pullRequests: 'プルリクエスト',
    open: 'オープン',
    closed: 'クローズ',
    merged: 'マージ済み',
    
    // Usage Status
    usageStatus: '使用状況',
    analysesThisMonth: '今月の分析回数',
    aiAnalysisUsage: 'AI分析使用回数',
    proFeature: 'Pro機能',
    cachePeriod: 'キャッシュ期間',
    dataUpdateFrequency: 'データ更新頻度',
    hours: '時間',
    
    // Pricing
    pricing: '料金プラン',
    freePlan: '無料プラン',
    proPlan: 'プロプラン',
    businessPlan: 'ビジネスプラン',
    perMonth: '/月',
    free: '無料',
    currentPlan: '現在のプラン',
    selectPlan: 'プランを選択',
    upgradeToPro: 'Proプランにアップグレード',
    aiDeepAnalysis: 'AI深層分析（Gemini搭載）',
    monthlyRepoLimit: '月100リポジトリまで分析可能',
    csvJsonExport: 'CSV/JSONエクスポート',
    shorterCache: '6時間キャッシュ（より新鮮なデータ）',
    startMonthly: '月額1,500円で始める',
    
    // Errors
    invalidGitHubUrl: '無効なGitHub URL',
    pleaseEnterValid: '有効なGitHub URLまたはowner/repo形式を入力してください',
    failedToAnalyze: 'リポジトリの分析に失敗しました',
    failedToGetAi: 'AI分析の取得に失敗しました',
    
    // Comparison descriptions
    moreStars: '%多い',
    fewerStars: '%少ない',
    veryActive: '非常に活発',
    activeDevelopment: '活発な開発',
    slowDevelopment: '開発ペースが遅い',
    excellentIssueManagement: 'イシュー管理が優秀',
  },
};

export function t(key: string, lang: Language): string {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
}