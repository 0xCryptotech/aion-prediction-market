# AION Linera Integration Guide

## Setup Linera Development Environment

### 1. Install Rust & Linera CLI
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32-unknown-unknown
cargo install linera-cli
```

### 2. Start Local Linera Network
```bash
linera net up --local
```

### 3. Build & Deploy Contract
```bash
cd linera
cargo build --target wasm32-unknown-unknown --release
linera project deploy --network local
```

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Frontend  │─────▶│   Backend    │─────▶│   Linera    │
│  (Vercel)   │      │  (FastAPI)   │      │  Testnet    │
└─────────────┘      └──────────────┘      └─────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   MongoDB    │
                     │  (Indexer)   │
                     └──────────────┘
```

## Components

### 1. Smart Contract (Rust)
- Location: `linera/src/lib.rs`
- Operations: CreateMarket, Stake, ResolveMarket, ClaimRewards
- State: Markets with stakes and outcomes

### 2. Backend Adapter (Python)
- Location: `backend/linera_adapter.py`
- Purpose: Bridge between FastAPI and Linera CLI
- Methods: call_operation(), query_state()

### 3. Indexer (Python)
- Location: `backend/indexer.py`
- Purpose: Sync Linera state to MongoDB every 15s
- Run: `python backend/indexer.py`

### 4. CLI Tool (Python)
- Location: `scripts/aion_cli.py`
- Usage:
  ```bash
  python scripts/aion_cli.py create --title "BTC $150k" --description "..." --category Finance --event-date 1735689600
  python scripts/aion_cli.py stake --market-id 1 --amount 1000 --prediction true
  python scripts/aion_cli.py query
  python scripts/aion_cli.py resolve --market-id 1 --outcome true
  ```

## Deployment Flow

### Local Testing
1. Start Linera: `linera net up --local`
2. Deploy contract: `cd linera && cargo build --target wasm32-unknown-unknown --release`
3. Start indexer: `python backend/indexer.py`
4. Start backend: `uvicorn backend.server:app --reload --port 8001`
5. Start frontend: `cd aion-static && python -m http.server 3000`

### Testnet Deployment
1. Build contract: `cd linera && cargo build --target wasm32-unknown-unknown --release`
2. Deploy: `bash scripts/deploy_linera.sh`
3. Update `.env` with new APP_ID
4. Deploy backend to Railway/Render
5. Deploy frontend to Vercel

## Environment Variables

```env
LINERA_APP_ID=0xabcd1234...
LINERA_RPC_URL=https://testnet.linera.io
LINERA_CHAIN_ID=default
MONGODB_URL=mongodb+srv://...
```

## Testing

### Unit Tests (Rust)
```bash
cd linera
cargo test
```

### Integration Tests (Python)
```bash
cd backend
pytest tests/
```

## Monitoring

- Linera Explorer: https://explorer.linera.io
- Check state: `linera client query --application-id $APP_ID`
- View logs: `linera net show`

## Security Checklist

- ✅ API key validation on all endpoints
- ✅ Input validation with Pydantic
- ✅ No private keys in repo
- ✅ CORS properly configured
- ✅ Rate limiting on stake operations
- ✅ BCS encoding for all operations

## Troubleshooting

### Contract deployment fails
- Check Rust version: `rustc --version` (need 1.70+)
- Verify wasm target: `rustup target list --installed`
- Clean build: `cargo clean && cargo build --release`

### Indexer not syncing
- Check MongoDB connection
- Verify LINERA_APP_ID in .env
- Check Linera node is running: `linera net show`

### Backend can't call Linera
- Verify linera CLI in PATH: `which linera`
- Check RPC URL is accessible
- Test manually: `linera client query --application-id $APP_ID`
