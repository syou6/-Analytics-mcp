# GitHub Analytics MCP - Developer Portfolio & Branding Tool

Transform your GitHub activity into a professional portfolio. Build your personal brand with AI-powered analytics, visualizations, and insights.

## 🎉 Launch Campaign: All Pro Features FREE!

**Limited Time Offer** - Get $80/year value absolutely free during our launch campaign!

### What You Get (FREE During Campaign):
- **Unlimited Repository Analysis** - Normally $9.8/mo
- **AI-Powered Insights** - Advanced Gemini AI analysis
- **Beautiful Visualizations** - Commit heatmaps, time distributions
- **Portfolio Generation** - Auto-generate professional portfolios
- **Public Dashboard Sharing** - Share your achievements
- **Personal Branding Tools** - Build your developer identity
- **Priority Support** - Get help when you need it

### Regular Pricing (After Campaign):
- **Free Plan**: Basic features, 10 repos/month
- **Professional**: $9.8/mo (¥1,470/mo) - All features above
- **Enterprise**: $50/mo (¥7,500/mo) - Team features + API access

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Supabase account
- GitHub account
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/github-analytics-mcp.git
cd github-analytics-mcp
npm install
```

2. **Set up Supabase**
- Create a new Supabase project at [supabase.com](https://supabase.com)
- Run the migration in `supabase/migrations/001_initial_schema.sql`
- Enable GitHub OAuth in Authentication settings
- Copy your project URL and anon key

3. **Configure environment variables**

For MCP Server (`mcp-server/.env`):
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GITHUB_TOKEN=your_github_personal_access_token
```

For Web App (`web/.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Start development servers**
```bash
# Start both MCP server and web app
npm run dev

# Or start individually
npm run dev --workspace=mcp-server
npm run dev --workspace=web
```

## 🔧 MCP Configuration

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "github-analytics": {
      "command": "node",
      "args": ["/path/to/github-analytics-mcp/mcp-server/dist/index.js"],
      "env": {
        "SUPABASE_URL": "your_supabase_url",
        "SUPABASE_ANON_KEY": "your_supabase_anon_key",
        "GITHUB_TOKEN": "your_github_token"
      }
    }
  }
}
```

## 📊 Available MCP Tools

- **analyze_repo** - Get repository statistics (stars, forks, issues, etc.)
- **analyze_contributors** - List top contributors and their contributions
- **analyze_languages** - Get language composition statistics
- **analyze_activity** - Track recent PRs, issues, and commits

## 🎯 Example Usage in Claude

```
User: Analyze the repository facebook/react