# Create GitHub Repository and Push Script
$GitHubUsername = "ShreeyanBejagam"
$RepoName = "Harshtih"

Write-Host "=== Creating GitHub Repository and Pushing Code ===" -ForegroundColor Cyan
Write-Host ""

# Check if token is provided as environment variable
$token = $env:GITHUB_TOKEN

if (-not $token) {
    Write-Host "GitHub Personal Access Token required." -ForegroundColor Yellow
    Write-Host "Create one at: https://github.com/settings/tokens" -ForegroundColor Cyan
    Write-Host "Required scope: 'repo' (Full control of private repositories)" -ForegroundColor Cyan
    Write-Host ""
    $secureToken = Read-Host "Enter your GitHub Personal Access Token" -AsSecureString
    $token = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureToken))
}

if (-not $token) {
    Write-Host "No token provided. Exiting." -ForegroundColor Red
    exit 1
}

Write-Host "Creating repository '$RepoName' on GitHub..." -ForegroundColor Yellow

$headers = @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/vnd.github.v3+json"
    "User-Agent" = "PowerShell"
}

$body = @{
    name = $RepoName
    description = "Professional AI Chatbot with Groq API, voice input, and person-focused conversations"
    private = $false
} | ConvertTo-Json

$ErrorActionPreference = "Stop"
$success = $false

try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json"
    $success = $true
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 422) {
        Write-Host "Repository already exists. Continuing with push..." -ForegroundColor Yellow
        $success = $true
    } else {
        Write-Host "Error creating repository: $_" -ForegroundColor Red
        exit 1
    }
}

if ($success) {
    # Remove existing remote if it exists
    $existingRemote = git remote get-url origin 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Removing existing remote..." -ForegroundColor Yellow
        git remote remove origin
    }
    
    # Add the new remote
    Write-Host "Adding remote origin..." -ForegroundColor Yellow
    if ($response) {
        $repoUrl = $response.clone_url
        Write-Host "✓ Repository created successfully!" -ForegroundColor Green
        Write-Host "Repository URL: $($response.html_url)" -ForegroundColor Cyan
    } else {
        $repoUrl = "https://github.com/$GitHubUsername/$RepoName.git"
    }
    
    git remote add origin $repoUrl
    Write-Host "✓ Remote added" -ForegroundColor Green
    
    # Push to GitHub
    Write-Host "Pushing code to GitHub..." -ForegroundColor Yellow
    git branch -M main
    
    # Use token in URL for authentication
    $pushUrl = $repoUrl -replace "https://", "https://$token@"
    git remote set-url origin $pushUrl
    
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        # Reset to normal URL (without token)
        git remote set-url origin $repoUrl
        Write-Host ""
        Write-Host "✓ Successfully pushed to GitHub!" -ForegroundColor Green
        if ($response) {
            Write-Host "Repository: $($response.html_url)" -ForegroundColor Cyan
        } else {
            Write-Host "Repository: https://github.com/$GitHubUsername/$RepoName" -ForegroundColor Cyan
        }
    } else {
        Write-Host "Push failed. Please check your token permissions." -ForegroundColor Red
    }
}
