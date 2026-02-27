@echo off
cls
echo ========================================
echo   VERCEL DEPLOYMENT - ONE CLICK
echo ========================================
echo.
echo This will deploy your app to Vercel
echo.
pause

echo.
echo [1/3] Building project...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ❌ Build failed! Fix errors first.
    pause
    exit /b 1
)

echo.
echo ✅ Build successful!
echo.
echo [2/3] Deploying to Vercel...
call vercel --prod

echo.
echo [3/3] Deployment complete!
echo.
echo ========================================
echo   NEXT STEPS
echo ========================================
echo.
echo 1. Add environment variables in Vercel:
echo    - JWT_SECRET
echo    - EMAIL_USER (optional)
echo    - EMAIL_PASSWORD (optional)
echo.
echo 2. Visit your live app URL
echo.
echo 3. Test all features
echo.
echo ========================================
echo.
pause
