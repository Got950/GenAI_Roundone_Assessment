# Quick Vercel Setup - API Key

## Option 1: Use Vercel Dashboard (Easiest)

1. Go to: https://vercel.com/dashboard
2. Click on your project: **GenAI_Roundone_Assessment**
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Enter:
   - **Key**: `VITE_GROQ_API_KEY`
   - **Value**: (Your API key - check your code or previous messages)
   - **Environment**: Select all three (Production, Preview, Development)
6. Click **Save**
7. Go to **Deployments** tab
8. Click the **⋯** menu on the latest deployment → **Redeploy**

## Option 2: Use Vercel CLI

Run this PowerShell script:
```powershell
.\set-vercel-env.ps1
```

Or manually:
```bash
vercel env add VITE_GROQ_API_KEY production
# Paste your API key when prompted

vercel env add VITE_GROQ_API_KEY preview
# Paste your API key when prompted

vercel env add VITE_GROQ_API_KEY development
# Paste your API key when prompted
```

Then redeploy.

## Option 3: Allow Secret in GitHub (For Hardcoded Key)

If you want to push the hardcoded key to GitHub:

1. Visit: https://github.com/Got950/GenAI_Roundone_Assessment/security/secret-scanning/unblock-secret/35VS24Qvuf0qLamAldZ6mMsue43
2. Click **Allow secret**
3. Then push: `git push origin main`

The code already has the API key hardcoded as a fallback, so it will work once pushed.

## Current Status

✅ Code is ready with API key fallback
✅ Will work once environment variable is set OR secret is allowed in GitHub
✅ No user prompts needed - key is automatically used

