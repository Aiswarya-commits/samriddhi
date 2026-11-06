@echo off
title Alethia Earth Local Server
cd /d "%~dp0"

echo ========================================================
echo   Starting Alethia Earth Website Local Server...
echo ========================================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Starting server with Node.js on http://localhost:3000 ...
    start "" cmd /c "timeout /t 1 /nobreak >nul & start http://localhost:3000"
    node server.js
    goto end
)

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Starting server with Python on http://localhost:3000 ...
    start "" cmd /c "timeout /t 1 /nobreak >nul & start http://localhost:3000"
    python serve.py
    goto end
)

echo [ERROR] Neither Node.js nor Python was found on your system PATH!
echo Please install Node.js or Python to run the local server.
pause

:end
