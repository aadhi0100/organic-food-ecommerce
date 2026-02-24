@echo off
echo ========================================
echo ORGANIC FOOD E-COMMERCE APP
echo Multi-User System Setup
echo ========================================
echo.

echo Step 1: Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js 18 or higher from https://nodejs.org
    pause
    exit /b 1
)
echo Node.js found!
echo.

echo Step 2: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)
echo Dependencies installed successfully!
echo.

echo Step 3: Creating data directories...
if not exist "data" mkdir data
if not exist "data\users" mkdir data\users
if not exist "data\carts" mkdir data\carts
if not exist "data\orders" mkdir data\orders
if not exist "data\products" mkdir data\products
echo Data directories created!
echo.

echo Step 4: Building application...
call npm run build
if %errorlevel% neq 0 (
    echo WARNING: Build had issues, but continuing...
)
echo.

echo ========================================
echo SETUP COMPLETE!
echo ========================================
echo.
echo Test Accounts:
echo.
echo ADMIN:
echo   Email: admin@organic.com
echo   Password: admin123
echo.
echo VENDOR:
echo   Email: vendor@organic.com
echo   Password: vendor123
echo.
echo CUSTOMER:
echo   Email: customer@organic.com
echo   Password: customer123
echo.
echo ========================================
echo Starting development server...
echo App will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

call npm run dev
