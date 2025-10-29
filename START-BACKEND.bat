@echo off
echo Starting AION Backend Server...
cd backend
python -m uvicorn server:app --reload --port 8001
pause