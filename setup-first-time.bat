@echo off
title First Time Setup
color 0B

echo ========================================
echo   FIRST TIME SETUP
echo ========================================
echo.
echo This will:
echo  1. Install all dependencies
echo  2. Create data directories
echo  3. Initialize Git repository
echo.
pause

echo.
echo [1/3] Installing dependencies...
call npm install

echo.
echo [2/3] Creating data directories...
if not exist "data\users" mkdir data\users
if not exist "data\orders" mkdir data\orders
if not exist "data\carts" mkdir data\carts
if not exist "data\products" mkdir data\products
if not exist "data\subscriptions" mkdir data\subscriptions
if not exist "data\exports" mkdir data\exports
if not exist "data\backups" mkdir data\backups
if not exist "data\logs" mkdir data\logs

echo.
echo [3/3] Initializing Git...
set "GIT=C:\Program Files\Git\bin\git.exe"
"%GIT%" init
"%GIT%" config user.name "User"
"%GIT%" config user.email "user@example.com"
"%GIT%" add .
"%GIT%" commit -m "Initial commit: Organic Food E-commerce App"

echo.
echo ========================================
echo   ✓ Setup Complete!
echo ========================================
echo.
echo Next steps:
echo  1. Read GITHUB_SETUP.md for GitHub connection
echo  2. Run 'run-app.bat' to start the app
echo  3. Use 'quick-push.bat' to push changes
echo.
pause
