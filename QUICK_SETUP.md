# Quick API Key Setup

## For Immediate Local Use

Open your browser console (F12) and run this (replace YOUR_API_KEY with your actual key):

```javascript
localStorage.setItem('groqApiKey', 'YOUR_API_KEY_HERE');
location.reload();
```

This will set the API key and refresh the page. The chatbot will work immediately!

## For Production (Vercel)

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `VITE_GROQ_API_KEY` = (your API key)
3. Redeploy

## For Local Development (Permanent)

Create a `.env` file in the project root:

```
VITE_GROQ_API_KEY=your-api-key-here
```

Then restart your dev server.

## Note

Your API key should be set in Vercel environment variables for production deployment. The key is automatically saved to localStorage once set, so you won't be prompted again.

