# PowerShell script to push to GitHub
# This script will help you push your code to GitHub

Write-Host "=== GitHub Push Script ===" -ForegroundColor Cyan

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
}

# Check git status
Write-Host "`nChecking git status..." -ForegroundColor Yellow
git status

# Check if remote exists
$remoteExists = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nNo GitHub remote configured." -ForegroundColor Yellow
    Write-Host "Please provide your GitHub repository URL (e.g., https://github.com/username/repo.git)" -ForegroundColor Cyan
    $repoUrl = Read-Host "Enter repository URL"
    
    if ($repoUrl) {
        Write-Host "Adding remote origin..." -ForegroundColor Yellow
        git remote add origin $repoUrl
        Write-Host "Remote added successfully!" -ForegroundColor Green
    } else {
        Write-Host "No URL provided. Exiting." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "`nRemote already configured: $remoteExists" -ForegroundColor Green
}

# Stage all files
Write-Host "`nStaging all files..." -ForegroundColor Yellow
git add .

# Check if there are changes to commit
$status = git status --porcelain
if ($status) {
    Write-Host "Committing changes..." -ForegroundColor Yellow
    git commit -m "Update: Latest changes"
    Write-Host "Changes committed!" -ForegroundColor Green
} else {
    Write-Host "No changes to commit." -ForegroundColor Green
}

# Push to GitHub
Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSuccessfully pushed to GitHub!" -ForegroundColor Green
} else {
    Write-Host "`nPush failed. You may need to:" -ForegroundColor Red
    Write-Host "1. Create the repository on GitHub first" -ForegroundColor Yellow
    Write-Host "2. Authenticate with GitHub (git credential helper or SSH key)" -ForegroundColor Yellow
    Write-Host "3. Check your repository URL" -ForegroundColor Yellow
}

