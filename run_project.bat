@echo off
setlocal enabledelayedexpansion
title JobConnect Platform Launcher
color 0b

echo ================================================================
echo           🌟 JobConnect Platform Launcher (MySQL + React)
echo ================================================================
echo.

:: 1. Check Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not found in your system PATH!
    echo Please install Node.js from https://nodejs.org/ to run JobConnect.
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js detected:
node -v
echo.

:: 2. Launch Backend
echo [1/3] Starting Backend API Server (Port 5000)...
cd /d "%~dp0backend"
start "JobConnect - Backend API (Port 5000)" cmd /k "title Backend API (Port 5000) && npm start"

:: 3. Launch Frontend
timeout /t 2 /nobreak >nul
echo [2/3] Starting Frontend React Server (Port 3000)...
cd /d "%~dp0frontend"
start "JobConnect - Frontend UI (Port 3000)" cmd /k "title Frontend UI (Port 3000) && npm start"

:: 4. Open Browser
timeout /t 3 /nobreak >nul
echo [3/3] Opening Browser at http://localhost:3000/ ...
start http://localhost:3000/

echo.
echo ================================================================
echo ✅ JobConnect servers have been launched!
echo.
echo 🌐 Frontend UI:  http://localhost:3000/
echo 📡 Backend API:  http://localhost:5000/
echo.
echo NOTE: Please keep the two opened terminal windows running!
echo ================================================================
echo.
pause
