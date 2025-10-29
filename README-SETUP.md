# AION Setup Instructions

## Prerequisites Required

1. **Python 3.10+** - Install from https://python.org
2. **Node.js 18+** - Install from https://nodejs.org
3. **MongoDB** - Install from https://mongodb.com or use MongoDB Atlas

## Quick Setup

### 1. Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Install Node.js Dependencies
```bash
cd frontend
npm install
```

### 3. Start Backend Server
```bash
cd backend
uvicorn server:app --reload --port 8001
```

### 4. Start Frontend Server (in new terminal)
```bash
cd frontend
npm start
```

## Application URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001
- API Docs: http://localhost:8001/docs

## Current Status
✅ Project structure created
✅ Backend API with FastAPI
✅ Frontend React app with Tailwind CSS
✅ MongoDB integration
✅ Wallet integration (MetaMask)
✅ All core features implemented

## Features Available
- Dashboard with analytics
- Prediction marketplace
- AI models leaderboard
- DAO governance system
- Wallet connection
- Real-time data updates