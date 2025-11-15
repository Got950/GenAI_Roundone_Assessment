# PowerShell script to set Vercel environment variable
# Requires Vercel CLI: npm install -g vercel

Write-Host "Setting Vercel Environment Variable..." -ForegroundColor Cyan

# API Key - Replace with your actual key
$apiKey = Read-Host "Enter your Groq API key" -AsSecureString
$apiKey = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($apiKey))
$varName = "VITE_GROQ_API_KEY"

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host "Setting environment variable: $varName" -ForegroundColor Yellow

# Set for Production
vercel env add $varName production <<< $apiKey

# Set for Preview
vercel env add $varName preview <<< $apiKey

# Set for Development
vercel env add $varName development <<< $apiKey

Write-Host "Environment variable set successfully!" -ForegroundColor Green
Write-Host "Please redeploy your application in Vercel dashboard." -ForegroundColor Cyan

