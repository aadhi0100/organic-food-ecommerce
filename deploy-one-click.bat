@echo off
title One-Click Firebase Deploy
color 0B

echo ========================================
echo   ONE-CLICK FIREBASE DEPLOYMENT
echo ========================================
echo.

cd /d "%~dp0"

REM Install Firebase CLI if not installed
where firebase >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Firebase CLI...
    call npm install -g firebase-tools
)

echo.
echo Step 1: Login to Firebase...
call firebase login --no-localhost

echo.
echo Step 2: Building app...
call npm run build

echo.
echo Step 3: Deploying to Firebase...
call firebase deploy --only hosting

echo.
echo ========================================
echo   DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your app is live!
echo Run: firebase open hosting:site
echo.
pause
