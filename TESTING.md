# 🧪 AION Testing Guide

## 🎯 Quick Test (Paling Mudah)

Test UI dan backend tanpa Linera:

```bash
# 1. Start MongoDB
mongod

# 2. Start Backend
cd backend
uvicorn server:app --reload --port 8001

# 3. Buka browser
# File: aion-static\index.html
```

**Cek:**
- ✅ Dashboard menampilkan statistics
- ✅ Marketplace menampilkan predictions
- ✅ Leaderboard menampilkan AI models
- ✅ Governance menampilkan proposals
- ✅ Connect Wallet berfungsi (MetaMask)

---

## 1️⃣ Setup Awal (Sekali Saja)

```bash
# Install Linera CLI
scripts\setup_linera.bat

# Install Python dependencies
cd backend
pip install -r requirements.txt
cd ..
```

---

## 2️⃣ Setup Environment

```bash
# Copy template
copy .env.example backend\.env

# Edit dengan notepad
notepad backend\.env
```

**Isi minimal:**
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=aion_db
API_KEY=test-secret-key
CORS_ORIGINS=http://localhost:3000
```

---

## 3️⃣ Test Backend

```bash
# Terminal 1: MongoDB
mongod

# Terminal 2: Backend
cd backend
uvicorn server:app --reload --port 8001
```

**Test API:**
```bash
curl http://localhost:8001/api/statistics
curl http://localhost:8001/api/predictions
curl http://localhost:8001/api/ai-models
```

---

## 4️⃣ Test Frontend

```bash
# Buka langsung
aion-static\index.html

# Atau dengan server
cd aion-static
python -m http.server 3000
# http://localhost:3000
```

---

## 5️⃣ Test Linera Integration

```bash
# Terminal 1: Linera network
linera net up --local

# Terminal 2: Build contract
cd linera
cargo build --target wasm32-unknown-unknown --release

# Terminal 3: Test CLI
python scripts\aion_cli.py query
```

---

## 6️⃣ Test Otomatis (All-in-One)

```bash
scripts\deploy_local.bat
```

**Ini akan start:**
- Linera network
- Backend (port 8001)
- Indexer

---

## 7️⃣ Test Unit Tests

```bash
# Test semua
scripts\test_all.bat

# Manual
cd linera && cargo test
cd backend && pytest
```

---

## 8️⃣ Test API Endpoints

```bash
# Statistics
curl http://localhost:8001/api/statistics

# Predictions
curl http://localhost:8001/api/predictions

# Linera state
curl http://localhost:8001/api/linera/state

# Stake (POST)
curl -X POST http://localhost:8001/api/linera/stake ^
  -H "Content-Type: application/json" ^
  -d "{\"market_id\": 1, \"amount\": 1000, \"prediction\": true, \"wallet_address\": \"0x123\"}"
```

---

## ⚠️ Troubleshooting

**MongoDB error:**
```bash
# Install MongoDB atau gunakan MongoDB Atlas
# Update MONGO_URL di backend\.env
```

**Linera CLI not found:**
```bash
cargo install linera-cli
```

**Port 8001 sudah dipakai:**
```bash
# Ganti di backend\.env
BACKEND_PORT=8002
```

---

## 📋 Test Checklist

- [ ] MongoDB running
- [ ] Backend API responding
- [ ] Frontend UI loading
- [ ] Predictions displayed
- [ ] AI Models leaderboard working
- [ ] Wallet connection working
- [ ] Linera CLI installed
- [ ] Contract builds successfully
- [ ] Unit tests passing
- [ ] API endpoints responding
