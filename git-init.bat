@echo off
setlocal

set "GIT=C:\Program Files\Git\bin\git.exe"

echo Initializing Git repository...
"%GIT%" init

echo Configuring Git...
"%GIT%" config user.name "User"
"%GIT%" config user.email "user@example.com"

echo Adding files...
"%GIT%" add .

echo Creating initial commit...
"%GIT%" commit -m "Initial commit: Organic Food E-commerce App"

echo.
echo ========================================
echo   Git repository initialized!
echo ========================================
echo.
echo Next steps:
echo 1. Create GitHub repository at https://github.com/new
echo 2. Run: git-connect-github.bat
echo.
pause
