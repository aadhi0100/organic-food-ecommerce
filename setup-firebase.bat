@echo off
echo.
echo ========================================
echo   Firebase Setup Helper
echo ========================================
echo.
echo This will help you set up Firebase for your app.
echo.
echo STEP 1: Create Firebase Project
echo   1. Go to: https://console.firebase.google.com/
echo   2. Click "Add project"
echo   3. Name: organic-food-ecommerce
echo   4. Click "Create project"
echo.
pause
echo.
echo STEP 2: Register Web App
echo   1. Click Web icon ^(^<^/^>^)
echo   2. App nickname: Organic Food App
echo   3. Click "Register app"
echo   4. COPY the Firebase config values
echo.
pause
echo.
echo STEP 3: Enable Services
echo   1. Enable Firestore Database
echo   2. Enable Authentication (Email/Password)
echo   3. Enable Storage
echo.
pause
echo.
echo STEP 4: Update .env.local
echo   Open .env.local and paste your Firebase config
echo.
notepad .env.local
echo.
echo STEP 5: Restart your app
echo   Close the current app and run: run-app.bat
echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Your app will now use Firebase for:
echo   - Real-time database
echo   - User authentication
echo   - File storage
echo   - Cloud hosting
echo.
echo Next: Read FIREBASE_SETUP.md for details
echo.
pause
