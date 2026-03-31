@echo off
REM Vercel Environment Variables Setup Script
REM This script helps you configure environment variables for Vercel deployment

echo.
echo ========================================
echo Vercel Environment Setup
echo ========================================
echo.
echo This script will help you set up environment variables for Vercel.
echo.
echo IMPORTANT: You need to have Vercel CLI installed
echo Install with: npm install -g vercel
echo.
echo ========================================
echo STEP 1: Email Configuration
echo ========================================
echo.
echo To enable Welcome Emails and Password Reset Emails:
echo.
echo 1. Go to https://myaccount.google.com/security
echo 2. Enable 2-Factor Authentication
echo 3. Go to App Passwords (https://myaccount.google.com/apppasswords)
echo 4. Select "Mail" and "Windows Computer"
echo 5. Copy the 16-character password
echo.
set /p EMAIL_USER="Enter your Gmail address: "
set /p EMAIL_PASSWORD="Enter your Gmail app password (16 chars): "
echo.

echo ========================================
echo STEP 2: Setting Vercel Variables
echo ========================================
echo.
echo Run these commands to set environment variables:
echo.
echo vercel env add EMAIL_USER
echo (paste: %EMAIL_USER%)
echo.
echo vercel env add EMAIL_PASSWORD
echo (paste: %EMAIL_PASSWORD%)
echo.
echo vercel env add APP_BASE_URL
echo (paste: https://organic-food-app-ashy.vercel.app)
echo.

echo ========================================
echo STEP 3: Redeploy
echo ========================================
echo.
echo After setting variables, redeploy with:
echo vercel --prod
echo.

pause
