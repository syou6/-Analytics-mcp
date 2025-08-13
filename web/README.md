# GitHub Analytics MCP

AI-powered GitHub repository analytics tool with multi-language support.

## Features

- 📊 Real-time GitHub repository analysis
- 🤖 AI-powered insights using Google Gemini
- 🌐 Multi-language support (10+ languages)
- 📈 Contributor analysis and activity tracking
- 🎨 Beautiful, responsive UI
- 🔐 Secure authentication with GitHub OAuth

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini API
- **Authentication**: Supabase Auth with GitHub OAuth
- **Deployment**: Vercel

## Getting Started

### Prerequisites

1. Node.js 18+ and npm
2. Supabase account
3. GitHub personal access token
4. Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/github-analytics-mcp.git
cd github-analytics-mcp/web
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual keys:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `GITHUB_TOKEN`: Your GitHub personal access token
- `GEMINI_API_KEY`: Your Google Gemini API key

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Deployment to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/github-analytics-mcp)

### Manual Deployment

1. Push your code to GitHub

2. Install Vercel CLI:
```bash
npm i -g vercel
```

3. Deploy:
```bash
vercel
```

4. Set environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add all variables from `.env.example`

## Supabase Setup

1. Create a new Supabase project

2. Enable GitHub OAuth:
   - Go to Authentication > Providers
   - Enable GitHub
   - Add your GitHub OAuth App credentials

3. Run database migrations:
   - Go to SQL Editor
   - Run the migrations in `supabase/migrations/` folder

4. Configure RLS policies (already included in migrations)

## Usage Limits (Free Plan)

- 10 repository analyses per month
- 24-hour cache duration
- No AI analysis (Pro feature)
- No data export (Pro feature)

## Future Features (Pro Plan)

- ✨ AI deep analysis with Gemini
- 📈 100 repositories per month
- 💾 CSV/JSON export
- ⚡ 6-hour cache (fresher data)
- 🎯 Priority support

## Contributing

Pull requests are welcome! For major changes, please open an issue first.

## License

MIT

## Support

For issues and feature requests, please use the GitHub issues page.

---

Built with ❤️ using Next.js and Supabase