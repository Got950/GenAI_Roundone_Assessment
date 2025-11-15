# Automated GitHub Setup and Push Script
param(
    [string]$GitHubToken = "",
    [string]$RepoName = "Harshtih",
    [string]$GitHubUsername = "ShreeyanBejagam"
)

Write-Host "=== Automated GitHub Setup ===" -ForegroundColor Cyan

# Step 1: Ensure git is initialized
if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
}

# Step 2: Configure git user (if not already set)
$currentName = git config user.name
$currentEmail = git config user.email

if (-not $currentName) {
    Write-Host "Setting git user name..." -ForegroundColor Yellow
    git config user.name $GitHubUsername
}

if (-not $currentEmail) {
    Write-Host "Setting git user email..." -ForegroundColor Yellow
    git config user.email "$GitHubUsername@users.noreply.github.com"
}

# Step 3: Stage and commit all files
Write-Host "`nStaging all files..." -ForegroundColor Yellow
git add .

$status = git status --porcelain
if ($status) {
    Write-Host "Committing changes..." -ForegroundColor Yellow
    git commit -m "Initial commit: Professional AI Chatbot with Groq API, voice input, and person-focused conversations"
    Write-Host "Changes committed!" -ForegroundColor Green
}

# Step 4: Check if remote exists
$remoteUrl = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nNo remote configured. Creating GitHub repository..." -ForegroundColor Yellow
    
    if (-not $GitHubToken) {
        Write-Host "`nGitHub Personal Access Token required to create repository." -ForegroundColor Yellow
        Write-Host "You can create one at: https://github.com/settings/tokens" -ForegroundColor Cyan
        Write-Host "Required scopes: repo" -ForegroundColor Cyan
        $GitHubToken = Read-Host "Enter your GitHub Personal Access Token" -AsSecureString
        $GitHubToken = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($GitHubToken))
    }
    
    if ($GitHubToken) {
        try {
            Write-Host "Creating repository '$RepoName' on GitHub..." -ForegroundColor Yellow
            
            $headers = @{
                "Authorization" = "token $GitHubToken"
                "Accept" = "application/vnd.github.v3+json"
            }
            
            $body = @{
                name = $RepoName
                description = "Professional AI Chatbot with Groq API, voice input, and person-focused conversations"
                private = $false
                auto_init = $false
            } | ConvertTo-Json
            
            $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json"
            
            Write-Host "Repository created successfully!" -ForegroundColor Green
            $repoUrl = $response.clone_url
            
            Write-Host "Adding remote origin..." -ForegroundColor Yellow
            git remote add origin $repoUrl
            Write-Host "Remote added: $repoUrl" -ForegroundColor Green
        } catch {
            Write-Host "Failed to create repository via API: $_" -ForegroundColor Red
            Write-Host "`nPlease create the repository manually at: https://github.com/new" -ForegroundColor Yellow
            Write-Host "Then run: git remote add origin https://github.com/$GitHubUsername/$RepoName.git" -ForegroundColor Cyan
            exit 1
        }
    } else {
        Write-Host "No token provided. Please create repository manually." -ForegroundColor Red
        Write-Host "Repository URL will be: https://github.com/$GitHubUsername/$RepoName" -ForegroundColor Cyan
        exit 1
    }
} else {
    Write-Host "Remote already configured: $remoteUrl" -ForegroundColor Green
}

# Step 5: Push to GitHub
Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
git branch -M main

git push -u origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ Successfully pushed to GitHub!" -ForegroundColor Green
    $repoUrl = git remote get-url origin
    Write-Host "Repository URL: $repoUrl" -ForegroundColor Cyan
} else {
    Write-Host "`nPush failed. You may need to authenticate." -ForegroundColor Red
    Write-Host "Try one of these:" -ForegroundColor Yellow
    Write-Host "1. Set up GitHub credentials: git config --global credential.helper wincred" -ForegroundColor Cyan
    Write-Host "2. Or use SSH: git remote set-url origin git@github.com:$GitHubUsername/$RepoName.git" -ForegroundColor Cyan
    Write-Host "3. Or authenticate when prompted" -ForegroundColor Cyan
}

