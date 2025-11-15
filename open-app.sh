#!/bin/bash

# Open AION Application
# Ensures everything is running and opens in browser

echo "🚀 Opening AION Application"
echo "=========================="
echo ""

# Check backend
if ! curl -s http://localhost:8001/api/statistics > /dev/null 2>&1; then
    echo "⚠️  Backend not running on port 8001"
    echo "   Please start backend first:"
    echo "   cd backend && source venv/bin/activate && uvicorn server:app --reload --port 8001"
    echo ""
    exit 1
fi
echo "✅ Backend running on port 8001"

# Check static server
if ! curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo "⚠️  Static server not running on port 8080"
    echo "   Starting server..."
    cd "AION LINERA"
    python3 -m http.server 8080 &
    sleep 2
    cd ..
fi
echo "✅ Static server running on port 8080"

# Check MongoDB
if ! pgrep -x mongod > /dev/null; then
    echo "⚠️  MongoDB not running"
else
    echo "✅ MongoDB running"
fi

echo ""
echo "🌐 Opening application in browser..."
echo "   URL: http://localhost:8080"
echo ""

# Open in default browser
open http://localhost:8080

echo "✅ Application opened!"
echo ""
echo "💡 Tips:"
echo "   - Use http://localhost:8080 (NOT file://)"
echo "   - Press Cmd+Shift+R to hard refresh"
echo "   - Press F12 to open DevTools"
echo "   - Check Console for errors"
echo ""
