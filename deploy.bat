@echo off
echo ========================================
echo   DEPLOYING TO VERCEL
echo ========================================
echo.
echo Target: organic-food-ifq5ca1u8-aadhityaezhumalai-5234s-projects.vercel.app
echo.

cd /d "%~dp0"

echo [1/3] Building project...
call npm run build
if errorlevel 1 (
    echo.
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo [2/3] Deploying to production...
call vercel --prod --yes

echo.
echo [3/3] Done!
echo.
echo ========================================
echo   DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your app is live at:
echo https://organic-food-ifq5ca1u8-aadhityaezhumalai-5234s-projects.vercel.app
echo.
pause
