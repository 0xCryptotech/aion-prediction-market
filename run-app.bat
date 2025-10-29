@echo off
echo Starting AION Application...
echo.

echo [1/2] Starting Backend Server...
cd backend
start /B python -m uvicorn server:app --reload --port 8001
cd ..

echo [2/2] Starting Frontend Server...
timeout /t 3 /nobreak > nul
cd frontend
npm start

pause
