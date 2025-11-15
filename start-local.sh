#!/bin/bash

# AION Local Startup Script
# Script ini akan menjalankan backend dan frontend secara bersamaan

echo "🚀 Starting AION Prediction Market..."
echo ""

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB tidak terdeteksi running!"
    echo "   Silakan jalankan: mongod"
    echo ""
fi

# Check if backend/.env exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  File backend/.env tidak ditemukan!"
    echo "   Membuat dari template..."
    cp .env.example backend/.env
    echo "✅ File backend/.env dibuat. Silakan edit jika perlu."
    echo ""
fi

# Start backend in background
echo "🔧 Starting Backend (Port 8001)..."
cd backend
source venv/bin/activate
uvicorn server:app --reload --port 8001 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting Frontend (Port 3000)..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ AION is starting up!"
echo ""
echo "📍 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8001"
echo "   API Docs: http://localhost:8001/docs"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for Ctrl+C
trap "echo ''; echo '🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
