@echo off
echo ========================================
echo Automatic GitHub Upload and Vercel Deploy
echo ========================================
echo.

REM Check if GitHub CLI is installed
where gh >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo GitHub CLI not found. Installing...
    echo Please install from: https://cli.github.com/
    echo.
    echo After installing, run this script again.
    pause
    exit /b
)

REM Check if logged in to GitHub
gh auth status >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Please login to GitHub first...
    gh auth login
)

echo [1/6] Enter repository details...
set /p repo_name="Repository name (e.g., organic-food-app): "
if "%repo_name%"=="" set repo_name=organic-food-app

set /p repo_desc="Repository description (or press Enter to skip): "
if "%repo_desc%"=="" set repo_desc=Premium organic food e-commerce marketplace

set /p repo_visibility="Make repository public? (y/n, default: n): "
if /i "%repo_visibility%"=="y" (
    set visibility=public
) else (
    set visibility=private
)
echo.

echo [2/6] Initializing Git repository...
if not exist .git (
    git init
    echo Git initialized.
) else (
    echo Git already initialized.
)
echo.

echo [3/6] Creating GitHub repository...
gh repo create %repo_name% --description "%repo_desc%" --%visibility% --source=. --remote=origin
if %ERRORLEVEL% NEQ 0 (
    echo Repository might already exist. Continuing...
)
echo.

echo [4/6] Adding files to Git...
git add .
echo.

echo [5/6] Committing changes...
git commit -m "Initial commit - Ready for Vercel deployment"
echo.

echo [6/6] Pushing to GitHub...
git branch -M main
git push -u origin main
echo.

echo ========================================
echo SUCCESS! Repository uploaded to GitHub
echo ========================================
echo.
echo Next steps:
echo 1. Go to https://vercel.com
echo 2. Click "Add New Project"
echo 3. Import your repository: %repo_name%
echo 4. Click "Deploy"
echo.
echo Your repository: https://github.com/$(gh api user --jq .login)/%repo_name%
echo.

pause
