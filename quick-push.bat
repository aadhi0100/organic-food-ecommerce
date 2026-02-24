@echo off
setlocal

set "GIT=C:\Program Files\Git\bin\git.exe"

echo ========================================
echo   Quick Git Push to GitHub
echo ========================================
echo.

REM Add all changes
echo [1/3] Adding changes...
"%GIT%" add .

REM Commit with timestamp
echo [2/3] Committing changes...
set timestamp=%date:~-4%-%date:~3,2%-%date:~0,2% %time:~0,2%:%time:~3,2%
"%GIT%" commit -m "Auto-commit: %timestamp%"

REM Push to GitHub
echo [3/3] Pushing to GitHub...
"%GIT%" push

echo.
echo ========================================
echo   ✓ Successfully pushed to GitHub!
echo ========================================
pause
