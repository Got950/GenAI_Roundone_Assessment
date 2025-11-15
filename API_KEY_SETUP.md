# API Key Setup Instructions

## Setting Up in Vercel

1. Go to your Vercel project dashboard: https://vercel.com/dashboard
2. Select your project: `GenAI_Roundone_Assessment`
3. Navigate to **Settings** → **Environment Variables**
4. Add a new environment variable:
   - **Name**: `VITE_GROQ_API_KEY`
   - **Value**: (Enter your Groq API key here)
   - **Environment**: Select all (Production, Preview, Development)
5. Click **Save**
6. Go to **Deployments** tab and click **Redeploy** on the latest deployment

## Local Development

Create a `.env` file in the project root:

```
VITE_GROQ_API_KEY=your-api-key-here
```

The `.env` file is already in `.gitignore`, so it won't be committed to GitHub.

## How It Works

- The API key is automatically loaded from environment variables
- Once set, it's saved to localStorage and always used
- No prompts or requests for the API key
- Works seamlessly in both local development and Vercel deployment

## Important Notes

- The API key should be set in Vercel environment variables for production
- For local development, use the `.env` file
- Never commit the API key to GitHub (it's blocked by secret scanning)

