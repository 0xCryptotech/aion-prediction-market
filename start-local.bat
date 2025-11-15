@echo off
REM AION Local Startup Script for Windows
REM Script ini akan menjalankan backend dan frontend

echo ========================================
echo    AION Prediction Market - Local Setup
echo ========================================
echo.

REM Check if backend/.env exists
if not exist "backend\.env" (
    echo [!] File backend\.env tidak ditemukan!
    echo [*] Membuat dari template...
    copy .env.example backend\.env
    echo [OK] File backend\.env dibuat.
    echo.
)

echo [*] Starting Backend (Port 8001)...
start "AION Backend" cmd /k "cd backend && uvicorn server:app --reload --port 8001"

timeout /t 3 /nobreak > nul

echo [*] Starting Frontend (Port 3000)...
start "AION Frontend" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo    AION is starting up!
echo ========================================
echo.
echo URLs:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8001
echo   API Docs: http://localhost:8001/docs
echo.
echo Tutup window ini untuk stop semua services
echo ========================================
pause
