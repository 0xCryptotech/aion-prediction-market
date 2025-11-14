#!/bin/bash
# gunakan port dari Railway, bukan port hardcode
PORT=${PORT:-8000}
uvicorn server:app --host 0.0.0.0 --port $PORT
