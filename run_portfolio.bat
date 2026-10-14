@echo off
title Sharnitha T - Portfolio Launcher
echo ========================================================
echo   Launching Sharnitha T's Full Stack Data Analyst Portfolio
echo   Theme: Crimson & Ruby Gradient (#6C1A1A)
echo ========================================================
echo.
echo Opening index.html in your default web browser...
start "" "%~dp0index.html"
echo.
echo If you would like to run a local web server with Python:
echo Press 1 to launch Python Web Server (http://localhost:3000)
echo Press 2 to exit
set /p choice="Enter choice [1 or 2]: "

if "%choice%"=="1" (
    echo Starting Python HTTP server on port 3000...
    start http://localhost:3000
    python -m http.server 3000
) else (
    exit
)
