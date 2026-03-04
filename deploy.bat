@echo off
echo ========================================
echo Vercel Deployment Script
echo ========================================
echo.

echo [1/5] Checking Git status...
git status
echo.

echo [2/5] Adding all changes...
git add .
echo.

echo [3/5] Committing changes...
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set commit_msg=Deploy to Vercel

git commit -m "%commit_msg%"
echo.

echo [4/5] Pushing to repository...
git push
echo.

echo [5/5] Deployment triggered!
echo.
echo ========================================
echo Your app will be live in 2-3 minutes
echo Check status at: https://vercel.com/dashboard
echo ========================================
echo.

pause
