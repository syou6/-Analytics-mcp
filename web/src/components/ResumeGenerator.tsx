'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, Loader2, Sparkles, Copy, CheckCircle, Linkedin, FileCode, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAnalysis } from '@/contexts/AnalysisContext';

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
    level: string;
    estimatedSalaryRange: string;
    strengths: string[];
    improvementAreas: string[];
  };
}

export default function ResumeGenerator({ username }: { username: string }) {
  const { language } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'markdown' | 'insights'>('preview');
  const { resumeData: cachedResume, setResumeData: setCachedResume, isDataStale } = useAnalysis();

  // キャッシュされたデータがあれば復元
  useEffect(() => {
    if (cachedResume && cachedResume.username === username && !isDataStale(cachedResume.timestamp)) {
      const parsedData = typeof cachedResume.content === 'string' 
        ? JSON.parse(cachedResume.content) 
        : cachedResume.content;
      setResumeData(parsedData);
    }
  }, [username]);

  const generateResume = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: username }),
      });
      
      if (!response.ok) throw new Error('Failed to generate resume');
      
      const data = await response.json();
      setResumeData(data);
      
      // キャッシュに保存
      setCachedResume({
        username,
        content: JSON.stringify(data),
        skills: data.skills.topTechnologies || [],
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error generating resume:', error);
      alert('Failed to generate resume. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!resumeData) return;
    
    const markdown = generateMarkdown(resumeData);
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateMarkdown = (data: ResumeData): string => {
    return `# ${data.personalInfo.name}

${data.personalInfo.bio}

📍 ${data.personalInfo.location} | 💼 [GitHub](${data.personalInfo.profileUrl}) | ✉️ ${data.personalInfo.email}

## Professional Summary
${data.professionalSummary}

## Skills
### Programming Languages
${data.skills.languages.map(lang => `- **${lang.name}** (${lang.proficiency}): ~${lang.linesOfCode.toLocaleString()} lines`).join('\n')}

### Technologies
${data.skills.topTechnologies.join(', ')}

## Key Achievements
${data.achievements.map(achievement => `- ${achievement}`).join('\n')}

## GitHub Statistics
- 🔥 **${data.statistics.totalCommits.toLocaleString()}** Total Commits
- 🔀 **${data.statistics.totalPRs}** Pull Requests
- 🎯 **${data.statistics.totalIssues}** Issues Resolved
- ⭐ **${data.statistics.totalStars}** Stars Earned
- 📚 **${data.statistics.totalRepos}** Repositories
- 🔥 **${data.statistics.contributionStreak}** Day Contribution Streak

## Experience
${data.experience.map(exp => `
### ${exp.title} at ${exp.organization}
*${exp.duration}*

${exp.description}

${exp.metrics.map(metric => `- ${metric}`).join('\n')}
`).join('\n')}

## Open Source Contributions
${data.openSourceContributions.map(contrib => 
  `- **${contrib.repo}** (⭐ ${contrib.stars}): ${contrib.role}`
).join('\n')}

## Career Insights
- **Level**: ${data.careerInsights.level}
- **Estimated Salary Range**: ${data.careerInsights.estimatedSalaryRange}
- **Strengths**: ${data.careerInsights.strengths.join(', ')}
- **Areas for Growth**: ${data.careerInsights.improvementAreas.join(', ')}
`;
  };

  const downloadPDF = async () => {
    // For now, we'll create a simple HTML version and let browser print to PDF
    if (!resumeData) return;
    
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${resumeData.personalInfo.name} - Resume</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
    h2 { color: #555; margin-top: 30px; }
    h3 { color: #666; }
    .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 20px 0; }
    .stat { background: #f0f9ff; padding: 10px; border-radius: 5px; }
    .skill { display: inline-block; background: #e0e7ff; padding: 5px 10px; margin: 5px; border-radius: 15px; }
  </style>
</head>
<body>
  <h1>${resumeData.personalInfo.name}</h1>
  <p>${resumeData.professionalSummary}</p>
  <h2>Skills</h2>
  ${resumeData.skills.topTechnologies.map(tech => `<span class="skill">${tech}</span>`).join('')}
  <h2>Achievements</h2>
  <ul>${resumeData.achievements.map(a => `<li>${a}</li>`).join('')}</ul>
  <h2>GitHub Statistics</h2>
  <div class="stats">
    <div class="stat">🔥 ${resumeData.statistics.totalCommits.toLocaleString()} Commits</div>
    <div class="stat">⭐ ${resumeData.statistics.totalStars} Stars</div>
    <div class="stat">📚 ${resumeData.statistics.totalRepos} Repos</div>
  </div>
</body>
</html>`;
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.personalInfo.username}-resume.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-black flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-500" />
            {language === 'ja' ? 'AI履歴書ジェネレーター' : 'AI Resume Generator'}
          </h2>
          <p className="text-gray-600 mt-1">
            {language === 'ja' 
              ? 'GitHubデータから職務経歴書を自動生成'
              : 'Generate professional resume from your GitHub data'}
          </p>
        </div>
        
        {!resumeData && (
          <button
            onClick={generateResume}
            disabled={isGenerating}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all flex items-center gap-2 font-semibold"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {language === 'ja' ? '生成中...' : 'Generating...'}
              </>
            ) : (
              <>
                <FileText className="h-5 w-5" />
                {language === 'ja' ? '履歴書を生成' : 'Generate Resume'}
              </>
            )}
          </button>
        )}
      </div>

      {resumeData && (
        <>
          {/* Tab Navigation */}
          <div className="flex gap-4 mb-6 border-b">
            <button
              onClick={() => setActiveTab('preview')}
              className={`pb-3 px-1 ${activeTab === 'preview' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-900'}`}
            >
              {language === 'ja' ? 'プレビュー' : 'Preview'}
            </button>
            <button
              onClick={() => setActiveTab('markdown')}
              className={`pb-3 px-1 ${activeTab === 'markdown' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-900'}`}
            >
              Markdown
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`pb-3 px-1 ${activeTab === 'insights' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-900'}`}
            >
              {language === 'ja' ? 'キャリア分析' : 'Career Insights'}
            </button>
          </div>

          {/* Export Actions */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              {language === 'ja' ? 'HTMLダウンロード' : 'Download HTML'}
            </button>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  {language === 'ja' ? 'コピー済み!' : 'Copied!'}
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  {language === 'ja' ? 'Markdownコピー' : 'Copy Markdown'}
                </>
              )}
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </button>
          </div>

          {/* Content Area */}
          <div className="bg-gray-50 rounded-lg p-6 max-h-[600px] overflow-y-auto">
            {activeTab === 'preview' && (
              <div className="space-y-6">
                {/* Header */}
                <div className="border-b pb-4">
                  <h1 className="text-3xl font-bold text-black">{resumeData.personalInfo.name}</h1>
                  <p className="text-gray-600 mt-2">{resumeData.personalInfo.bio}</p>
                  <div className="flex gap-4 mt-3 text-sm text-gray-600">
                    <span>📍 {resumeData.personalInfo.location}</span>
                    <a href={resumeData.personalInfo.profileUrl} className="text-blue-600 hover:underline">
                      💼 GitHub Profile
                    </a>
                  </div>
                </div>

                {/* Professional Summary */}
                <div>
                  <h2 className="text-xl font-bold text-black mb-2">Professional Summary</h2>
                  <p className="text-gray-700">{resumeData.professionalSummary}</p>
                </div>

                {/* Skills */}
                <div>
                  <h2 className="text-xl font-bold text-black mb-3">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.topTechnologies.map((tech, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Statistics */}
                <div>
                  <h2 className="text-xl font-bold text-black mb-3">GitHub Statistics</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-2xl font-bold text-black">
                        {resumeData.statistics.totalCommits.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Total Commits</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-2xl font-bold text-black">
                        {resumeData.statistics.totalStars}
                      </div>
                      <div className="text-sm text-gray-600">Stars Earned</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-2xl font-bold text-black">
                        {resumeData.statistics.totalRepos}
                      </div>
                      <div className="text-sm text-gray-600">Repositories</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-2xl font-bold text-black">
                        {resumeData.statistics.totalPRs}
                      </div>
                      <div className="text-sm text-gray-600">Pull Requests</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-2xl font-bold text-black">
                        {resumeData.statistics.contributionStreak}
                      </div>
                      <div className="text-sm text-gray-600">Day Streak</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-2xl font-bold text-black">
                        {resumeData.statistics.totalIssues}
                      </div>
                      <div className="text-sm text-gray-600">Issues</div>
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h2 className="text-xl font-bold text-black mb-3">Key Achievements</h2>
                  <ul className="space-y-2">
                    {resumeData.achievements.map((achievement, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-700">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'markdown' && (
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{generateMarkdown(resumeData)}</code>
              </pre>
            )}

            {activeTab === 'insights' && (
              <div className="space-y-6">
                {/* Career Level */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Career Level</h3>
                  <div className="text-3xl font-bold">{resumeData.careerInsights.level}</div>
                  <div className="text-lg mt-2">
                    Estimated Salary: {resumeData.careerInsights.estimatedSalaryRange}
                  </div>
                </div>

                {/* Strengths */}
                <div>
                  <h3 className="text-lg font-bold text-black mb-3">Your Strengths</h3>
                  <div className="space-y-2">
                    {resumeData.careerInsights.strengths.map((strength, idx) => (
                      <div key={idx} className="flex items-center">
                        <span className="text-green-500 mr-2">💪</span>
                        <span className="text-gray-700">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Areas for Improvement */}
                <div>
                  <h3 className="text-lg font-bold text-black mb-3">Growth Opportunities</h3>
                  <div className="space-y-2">
                    {resumeData.careerInsights.improvementAreas.map((area, idx) => (
                      <div key={idx} className="flex items-center">
                        <span className="text-yellow-500 mr-2">📈</span>
                        <span className="text-gray-700">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Languages */}
                <div>
                  <h3 className="text-lg font-bold text-black mb-3">Language Proficiency</h3>
                  <div className="space-y-3">
                    {resumeData.skills.languages.map((lang, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-700 font-medium">{lang.name}</span>
                          <span className="text-sm text-gray-600">{lang.proficiency}</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ 
                              width: `${lang.proficiency === 'Expert' ? 100 : 
                                       lang.proficiency === 'Advanced' ? 75 :
                                       lang.proficiency === 'Intermediate' ? 50 : 25}%` 
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}