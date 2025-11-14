#!/bin/bash
# Railway start script - properly handles $PORT variable

# Default port if not set
PORT=${PORT:-8001}

echo "Starting AION Backend on port $PORT..."

# Start uvicorn with the PORT variable (already in backend dir)
exec uvicorn server:app --host 0.0.0.0 --port "$PORT"
