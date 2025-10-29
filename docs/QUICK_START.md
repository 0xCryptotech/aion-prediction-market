# AION Quick Start Guide

## Prerequisites
- Rust 1.70+
- Python 3.10+
- MongoDB
- Node.js 18+ (optional)

## Installation

### 1. Setup Linera
```bash
# Windows
scripts\setup_linera.bat

# Linux/Mac
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32-unknown-unknown
cargo install linera-cli
```

### 2. Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 3. Configure Environment
```bash
# Copy template
copy .env.example backend\.env

# Edit backend\.env
MONGO_URL=mongodb://localhost:27017
DB_NAME=aion_db
API_KEY=your-secret-key
```

## Local Development

### Option A: Automated (Windows)
```bash
scripts\deploy_local.bat
```

### Option B: Manual

**Terminal 1 - Linera Network:**
```bash
linera net up --local
```

**Terminal 2 - Backend:**
```bash
cd backend
uvicorn server:app --reload --port 8001
```

**Terminal 3 - Indexer:**
```bash
cd backend
python indexer.py
```

**Terminal 4 - Frontend:**
```bash
cd aion-static
python -m http.server 3000
```

## Testing

### Run All Tests
```bash
# Windows
scripts\test_all.bat

# Manual
cd linera && cargo test
cd backend && pytest
```

### Test CLI
```bash
python scripts/aion_cli.py query
```

## Build & Deploy Contract

### Local
```bash
cd linera
cargo build --target wasm32-unknown-unknown --release
linera project deploy --network local
```

### Testnet
```bash
bash scripts/deploy_linera.sh
```

## API Endpoints

### Standard Endpoints
- `GET /api/predictions` - List predictions
- `POST /api/predictions/{id}/stake` - Stake on prediction
- `GET /api/ai-models` - List AI models
- `GET /api/dao-proposals` - List proposals

### Linera Endpoints
- `POST /api/linera/market` - Create market (requires API key)
- `POST /api/linera/stake` - Stake on Linera
- `GET /api/linera/state` - Query Linera state
- `POST /api/linera/resolve/{id}` - Resolve market (requires API key)

## Troubleshooting

### Linera CLI not found
```bash
cargo install linera-cli
```

### MongoDB connection error
```bash
# Start MongoDB
mongod --dbpath=./data
```

### Port already in use
```bash
# Change port in backend/.env
BACKEND_PORT=8002
```

## Next Steps

1. Read [LINERA_INTEGRATION.md](LINERA_INTEGRATION.md)
2. Check [BCS_SCHEMA.md](bcs_schema.md)
3. Review [CHECKLIST_STATUS.md](../CHECKLIST_STATUS.md)
