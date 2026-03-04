@echo off
echo ========================================
echo   AUTOMATIC VERCEL DEPLOYMENT
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] Installing Vercel CLI...
call npm install -g vercel@latest

echo.
echo [2/4] Logging in to Vercel...
call vercel login

echo.
echo [3/4] Linking project...
call vercel link

echo.
echo [4/4] Deploying to production...
call vercel --prod

echo.
echo ========================================
echo   DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your app is now live on Vercel!
echo Check the URL above to access it.
echo.
pause
