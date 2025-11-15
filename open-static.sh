#!/bin/bash

# AION Static HTML Launcher
# Opens the static HTML version with backend running

echo "🚀 AION Static HTML Launcher"
echo ""

# Check if backend is running
if ! curl -s http://localhost:8001/api/statistics > /dev/null 2>&1; then
    echo "⚠️  Backend not running on port 8001"
    echo "   Starting backend..."
    cd backend
    source venv/bin/activate
    uvicorn server:app --reload --port 8001 &
    BACKEND_PID=$!
    cd ..
    echo "✅ Backend started (PID: $BACKEND_PID)"
    sleep 3
else
    echo "✅ Backend already running"
fi

# Check MongoDB
if ! pgrep -x mongod > /dev/null; then
    echo "⚠️  MongoDB not running"
    echo "   Please start MongoDB: brew services start mongodb-community"
else
    echo "✅ MongoDB running"
fi

echo ""
echo "📊 API Status:"
curl -s http://localhost:8001/api/statistics | python3 -m json.tool 2>/dev/null || echo "   Backend not ready yet..."

echo ""
echo "🌐 Opening Static HTML..."
open "AION LINERA/index.html"

echo ""
echo "✅ AION Static HTML opened!"
echo ""
echo "📍 URLs:"
echo "   Frontend: file://$(pwd)/AION%20LINERA/index.html"
echo "   Backend:  http://localhost:8001"
echo "   API Docs: http://localhost:8001/docs"
echo ""
echo "💡 Tips:"
echo "   - Press F12 to open Developer Tools"
echo "   - Check Console for API logs"
echo "   - Check Network tab for API calls"
echo ""
