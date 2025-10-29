@echo off
echo ========================================
echo AION Local Deployment
echo ========================================
echo.

echo [1/5] Starting Linera local network...
start "Linera Network" cmd /k "linera net up --local"
timeout /t 5

echo [2/5] Building Wasm contract...
cd linera
cargo build --target wasm32-unknown-unknown --release
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    exit /b 1
)
cd ..

echo [3/5] Starting MongoDB...
echo Make sure MongoDB is running on localhost:27017

echo [4/5] Starting backend...
start "AION Backend" cmd /k "cd backend && uvicorn server:app --reload --port 8001"
timeout /t 3

echo [5/5] Starting indexer...
start "AION Indexer" cmd /k "cd backend && python indexer.py"

echo.
echo ========================================
echo Deployment complete!
echo Backend: http://localhost:8001
echo Frontend: Open aion-static/index.html
echo ========================================
