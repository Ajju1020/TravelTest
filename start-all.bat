@echo off
title TravelTest Platform Launcher
echo ========================================================
echo    TravelTest - Travel & Booking Automation System
echo ========================================================
echo Starting Backend (Port 5000) and Frontend (Port 5173)...
echo.

start "TravelTest Backend (Port 5000)" cmd /k "cd server && npm run dev"
timeout /t 2 /nobreak > nul
start "TravelTest Frontend (Port 5173)" cmd /k "cd client && npm run dev"

echo.
echo Servers started in separate windows!
echo Opening browser at http://localhost:5173 ...
timeout /t 3 /nobreak > nul
start http://localhost:5173
echo.
echo Press any key to exit this launcher (servers remain active).
pause > nul
