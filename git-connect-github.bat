@echo off
setlocal

set "GIT=C:\Program Files\Git\bin\git.exe"

echo ========================================
echo   Connect to GitHub
echo ========================================
echo.
set /p REPO_URL="Enter your GitHub repository URL: "

echo.
echo Adding remote origin...
"%GIT%" remote add origin %REPO_URL%

echo Setting branch to main...
"%GIT%" branch -M main

echo Pushing to GitHub...
"%GIT%" push -u origin main

echo.
echo ========================================
echo   Successfully connected to GitHub!
echo ========================================
pause
