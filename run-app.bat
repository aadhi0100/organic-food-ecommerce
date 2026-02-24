@echo off
title Organic Food E-commerce App
color 0A

echo ========================================
echo   ORGANIC FOOD E-COMMERCE APP
echo ========================================
echo.
echo Starting development server...
echo.
echo Access the app at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

cd /d "%~dp0"
npm run dev
