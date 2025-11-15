# 🚀 AION Onchain - Quick Start

## Mulai Aplikasi

```bash
./start-onchain.sh
```

Atau manual:

```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate
uvicorn server_onchain:app --reload --port 8001

# Terminal 2 - Frontend  
cd "AION LINERA"
python3 -m http.server 8080
```

## Akses

- **Frontend:** http://localhost:8080
- **API:** http://localhost:8001
- **Docs:** http://localhost:8001/docs

## Test API

```bash
# Info blockchain
curl http://localhost:8001/api/blockchain/info

# Buat market
curl -X POST http://localhost:8001/api/markets \
  -H "Content-Type: application/json" \
  -d '{
    "market_id": "btc-100k-2025",
    "title": "Bitcoin $100K di 2025?",
    "description": "Prediksi harga Bitcoin",
    "category": "crypto",
    "event_date": 1735689600
  }'

# Lihat markets
curl http://localhost:8001/api/markets

# Place stake
curl -X POST http://localhost:8001/api/markets/btc-100k-2025/stake \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "amount": 100,
    "prediction": true
  }'
```

## Arsitektur

```
Frontend (8080) → Backend Proxy (8001) → Linera Blockchain
```

**Semua data di blockchain!** 🔗

## Files Penting

- `linera/src/lib.rs` - Smart contract
- `backend/server_onchain.py` - API proxy
- `backend/blockchain_proxy.py` - Blockchain interface
- `backend/.env` - Configuration

## Mode

**Current:** Mock Blockchain (demo)  
**Future:** Real Linera Network

Set `USE_MOCK_BLOCKCHAIN=false` untuk real blockchain.

## Dokumentasi

- `FULLY_ONCHAIN.md` - Full documentation
- `ONCHAIN_DEPLOYMENT_SUCCESS.md` - Deployment details
- `deploy-fully-onchain.sh` - Deployment script

---

**Status:** ✅ Operational  
**Mode:** 100% Onchain  
**Blockchain:** Linera Protocol
