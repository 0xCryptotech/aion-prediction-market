#!/bin/bash

echo "🔗 Starting AION - Fully Onchain Mode"
echo "====================================="
echo ""

# Start backend
echo "Starting blockchain proxy backend..."
cd backend
source venv/bin/activate 2>/dev/null || python3 -m venv venv && source venv/bin/activate

# Install dependencies
pip install -q fastapi uvicorn python-dotenv pydantic

# Start server
echo "Backend running on http://localhost:8001"
uvicorn server_onchain:app --reload --port 8001 &
BACKEND_PID=$!

cd ..

# Start frontend
echo "Starting frontend..."
cd "AION LINERA"
echo "Frontend running on http://localhost:8080"
python3 -m http.server 8080 &
FRONTEND_PID=$!

cd ..

echo ""
echo "✅ AION is running!"
echo ""
echo "🌐 Open: http://localhost:8080"
echo "📡 Backend: http://localhost:8001"
echo "⛓️  Mode: Fully Onchain"
echo ""
echo "Press Ctrl+C to stop..."

# Wait for interrupt
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
