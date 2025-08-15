# Deployment Guide for GitVue

## Required Environment Variables on Vercel

You need to set the following environment variables in your Vercel project settings:

### 1. GitHub Token (Required)
```
GITHUB_TOKEN=your_github_personal_access_token
```

To create a GitHub token:
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `read:user`, `read:org`, `repo` (read access)
4. Copy the token and add it to Vercel

### 2. Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=https://cvhiujltpzxhmknznmuq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Stripe Configuration (for payments)
```
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_PRICE_ID=your_stripe_price_id
```

### 4. Gemini API (for AI features)
```
GEMINI_API_KEY=your_gemini_api_key
```

### 5. Application URL
```
NEXT_PUBLIC_APP_URL=https://www.gitvue.dev
```

## Adding Environment Variables to Vercel

1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Navigate to "Environment Variables"
4. Add each variable with its value
5. Make sure to select the appropriate environments (Production/Preview/Development)
6. Save and redeploy

## Troubleshooting

### GitHub API Error
If you see "GitHub API error" in the Personal Branding Analysis:
- Check that GITHUB_TOKEN is set in Vercel
- Verify the token has the correct permissions
- Ensure the token hasn't expired

### Build Errors
If the build fails:
- Check the build logs in Vercel
- Ensure all required dependencies are in package.json
- Verify all imports are correct

## Local Development

For local development, create a `.env.local` file with all the environment variables.