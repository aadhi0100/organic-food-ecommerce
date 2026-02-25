@echo off
title Firebase Deployment
color 0B

echo ========================================
echo   FIREBASE DEPLOYMENT SETUP
echo ========================================
echo.

REM Check if Firebase CLI is installed
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Firebase CLI...
    call npm install -g firebase-tools
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install Firebase CLI
        pause
        exit /b 1
    )
    echo Firebase CLI installed successfully!
    echo.
)

echo Firebase CLI is ready!
echo.
echo ========================================
echo   STEP 1: LOGIN TO FIREBASE
echo ========================================
echo.
echo Opening browser for Firebase login...
echo Please login with your Google account.
echo.
call firebase login
if %errorlevel% neq 0 (
    echo ERROR: Firebase login failed
    pause
    exit /b 1
)

echo.
echo Login successful!
echo.
echo ========================================
echo   STEP 2: INITIALIZE FIREBASE HOSTING
echo ========================================
echo.

REM Check if firebase.json exists
if exist firebase.json (
    echo Firebase already initialized. Skipping...
) else (
    echo Initializing Firebase Hosting...
    echo.
    echo IMPORTANT: When prompted, answer:
    echo   - What do you want to use? Hosting
    echo   - Use existing project or create new? Use existing
    echo   - What do you want to use as public directory? out
    echo   - Configure as single-page app? Yes
    echo   - Set up automatic builds with GitHub? No
    echo.
    pause
    call firebase init hosting
    if %errorlevel% neq 0 (
        echo ERROR: Firebase initialization failed
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo   STEP 3: BUILD YOUR APP
echo ========================================
echo.
echo Building production version...
echo This may take a few minutes...
echo.

call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    echo Please fix the errors and try again
    pause
    exit /b 1
)

echo.
echo Build completed successfully!
echo.

REM Export static files
echo Exporting static files...
call npx next export
if %errorlevel% neq 0 (
    echo Note: Export step skipped (may not be needed for your setup)
)

echo.
echo ========================================
echo   STEP 4: DEPLOY TO FIREBASE
echo ========================================
echo.
echo Deploying to Firebase Hosting...
echo.

call firebase deploy --only hosting
if %errorlevel% neq 0 (
    echo ERROR: Deployment failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo   DEPLOYMENT SUCCESSFUL!
echo ========================================
echo.
echo Your app is now live on Firebase!
echo.
echo To view your app, run: firebase open hosting:site
echo.
pause
