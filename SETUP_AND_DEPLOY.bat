@echo off
echo ========================================
echo   VERCEL DEPLOYMENT SETUP
echo ========================================
echo.

cd /d "%~dp0"

echo Step 1: Generate Secrets
echo.
powershell -Command "$secret1 = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 })); $secret2 = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 })); Write-Host 'NEXTAUTH_SECRET='$secret1; Write-Host 'JWT_SECRET='$secret2; Write-Host ''; Write-Host 'Copy these values and add them to Vercel:'; Write-Host 'https://vercel.com/aadhityaezhumalai-5234s-projects/organic-food-app/settings/environment-variables'"

echo.
echo.
echo Step 2: Add Environment Variables to Vercel
echo.
echo Go to: https://vercel.com/aadhityaezhumalai-5234s-projects/organic-food-app/settings/environment-variables
echo.
echo Add these 3 variables:
echo 1. NEXTAUTH_SECRET = (use generated value above)
echo 2. JWT_SECRET = (use generated value above)
echo 3. NEXTAUTH_URL = https://organic-food-ifq5ca1u8-aadhityaezhumalai-5234s-projects.vercel.app
echo.
echo.
echo Step 3: After adding variables, press any key to deploy...
pause >nul

echo.
echo Deploying to Vercel...
call vercel --prod --yes

echo.
echo ========================================
echo   DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your app: https://organic-food-ifq5ca1u8-aadhityaezhumalai-5234s-projects.vercel.app
echo.
pause
