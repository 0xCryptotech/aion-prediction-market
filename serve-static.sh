#!/bin/bash

# Serve Static HTML on localhost
# Opens AION static HTML on http://localhost:8080

echo "🌐 Starting HTTP Server for Static HTML"
echo ""

# Check if backend is running
if ! curl -s http://localhost:8001/api/statistics > /dev/null 2>&1; then
    echo "⚠️  Backend not running. Starting backend..."
    cd backend
    source venv/bin/activate
    uvicorn server:app --reload --port 8001 &
    BACKEND_PID=$!
    cd ..
    sleep 3
    echo "✅ Backend started"
else
    echo "✅ Backend already running"
fi

echo ""
echo "🌐 Starting HTTP server on port 8080..."
echo ""

# Go to AION LINERA directory and start server
cd "AION LINERA"

# Use Python's built-in HTTP server
echo "📍 URLs:"
echo "   Frontend: http://localhost:8080"
echo "   Backend:  http://localhost:8001"
echo "   API Docs: http://localhost:8001/docs"
echo ""
echo "Press Ctrl+C to stop server"
echo ""

# Open browser
sleep 1
open http://localhost:8080

# Start server
python3 -m http.server 8080
