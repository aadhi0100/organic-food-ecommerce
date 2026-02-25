@echo off
title Firebase Deployment
color 0B

echo ========================================
echo   FIREBASE DEPLOYMENT
echo ========================================
echo.
echo You are logged in as: aadhityaezhumalai@gmail.com
echo.
echo STEP 1: Create Firebase Project
echo --------------------------------
echo.
echo 1. Go to: https://console.firebase.google.com/
echo 2. Click "Add project"
echo 3. Project name: organic-food-ecommerce
echo 4. Click "Continue" and "Create project"
echo.
echo After creating the project, come back here.
echo.
pause

echo.
echo STEP 2: Get Your Project ID
echo --------------------------------
echo.
echo In Firebase Console, your Project ID is shown at the top.
echo Example: organic-food-ecommerce-abc123
echo.
set /p PROJECT_ID="Enter your Firebase Project ID: "

echo.
echo Updating .firebaserc with your project ID...
(
echo {
echo   "projects": {
echo     "default": "%PROJECT_ID%"
echo   }
echo }
) > .firebaserc

echo Done!
echo.

echo STEP 3: Enable Firebase Hosting
echo --------------------------------
echo.
echo In Firebase Console:
echo 1. Go to "Build" -^> "Hosting"
echo 2. Click "Get started"
echo 3. Follow the setup wizard
echo.
pause

echo.
echo STEP 4: Building Your App
echo --------------------------------
echo.
echo Building production version...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Build failed!
    echo Please fix the errors and try again.
    pause
    exit /b 1
)

echo.
echo Build successful!
echo.

echo STEP 5: Deploying to Firebase
echo --------------------------------
echo.
echo Deploying to Firebase Hosting...
call firebase deploy --only hosting --project %PROJECT_ID%

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Deployment failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   DEPLOYMENT SUCCESSFUL!
echo ========================================
echo.
echo Your app is now live at:
echo https://%PROJECT_ID%.web.app
echo https://%PROJECT_ID%.firebaseapp.com
echo.
echo Opening your live app...
start https://%PROJECT_ID%.web.app
echo.
pause
