@echo off
echo Starting AION Prediction Market Application...
echo.

echo [1/3] Starting Backend Server...
cd backend
start "AION Backend" cmd /k "python -m uvicorn server:app --reload --port 8001"
cd ..

echo [2/3] Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo [3/3] Starting Frontend Development Server...
cd frontend
start "AION Frontend" cmd /k "npm start"
cd ..

echo.
echo ✅ AION Application is starting!
echo.
echo Backend: http://localhost:8001
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul