# GitHub Analytics MCP

AI-powered GitHub repository analytics through MCP (Model Context Protocol). Analyze repositories, track contributions, and get insights directly in your AI assistant.

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