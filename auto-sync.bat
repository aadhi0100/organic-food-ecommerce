@echo off
setlocal
title Auto-Sync to GitHub
color 0E

set "GIT=C:\Program Files\Git\bin\git.exe"

echo ========================================
echo   AUTO-SYNC TO GITHUB (ADVANCED)
echo ========================================
echo.
echo This will automatically push changes
echo every 5 minutes while running.
echo.
echo WARNING: This is for active development.
echo Press Ctrl+C to stop at any time.
echo.
pause

:loop
echo.
echo [%time%] Checking for changes...

REM Check if there are changes
"%GIT%" status --short > temp.txt
set /p changes=<temp.txt
del temp.txt

if not "%changes%"=="" (
    echo Changes detected! Pushing to GitHub...
    
    "%GIT%" add .
    set timestamp=%date:~-4%-%date:~3,2%-%date:~0,2% %time:~0,2%:%time:~3,2%
    "%GIT%" commit -m "Auto-sync: %timestamp%"
    "%GIT%" push
    
    echo ✓ Pushed successfully!
) else (
    echo No changes detected.
)

echo Next check in 5 minutes...
timeout /t 300 /nobreak > nul
goto loop
