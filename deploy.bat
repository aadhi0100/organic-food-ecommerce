@echo off
echo ========================================
echo   Organic Food App - Vercel Deployment
echo ========================================
echo.

echo [1/5] Checking Node.js version...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)
echo.

echo [2/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)
echo.

echo [3/5] Running type check...
call npm run type-check
if %errorlevel% neq 0 (
    echo ERROR: TypeScript errors found!
    pause
    exit /b 1
)
echo.

echo [4/5] Running linter...
call npm run lint
if %errorlevel% neq 0 (
    echo ERROR: Linting errors found!
    pause
    exit /b 1
)
echo.

echo [5/5] Building for production...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo.

echo ========================================
echo   Build Successful!
echo ========================================
echo.
echo Next steps:
echo 1. Install Vercel CLI: npm i -g vercel
echo 2. Login to Vercel: vercel login
echo 3. Deploy: vercel --prod
echo.
echo Or see VERCEL_DEPLOY.md for detailed instructions
echo.
pause
