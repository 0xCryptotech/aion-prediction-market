# 🚀 AION Deployment Guide - Linera Blockchain

## Prerequisites

### 1. Install Rust & Cargo
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Verify
rustc --version
cargo --version
```

### 2. Install Linera CLI
```bash
# Install Linera toolchain
cargo install linera-cli

# Verify installation
linera --version
```

### 3. Add WASM Target
```bash
rustup target add wasm32-unknown-unknown
```

### 4. Install Additional Tools
```bash
# For macOS
brew install protobuf

# Verify
protoc --version
```

---

## 📦 Step 1: Build Smart Contract

### Build WASM Binaries
```bash
cd linera

# Build contract and service
cargo build --release --target wasm32-unknown-unknown

# Verify build
ls -lh target/wasm32-unknown-unknown/release/*.wasm
```

Expected output:
```
aion_prediction_market.wasm
```

---

## 🌐 Step 2: Setup Linera Network

### Option A: Local Development Network

```bash
# Initialize local Linera network
linera net up

# This will:
# - Start local validator nodes
# - Create default wallet
# - Setup test chains
```

### Option B: Connect to Testnet

```bash
# Get testnet configuration
curl -o ~/.config/linera/testnet.toml https://linera.dev/testnet.toml

# Use testnet
linera --config ~/.config/linera/testnet.toml wallet show
```

---

## 🎯 Step 3: Deploy Main Chain

### 1. Create Main Chain (Governance)
```bash
# Create new chain for governance
linera create-chain

# Output example:
# Created chain: e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65
```

Save this as your **MAIN_CHAIN_ID**.

### 2. Deploy Application to Main Chain
```bash
# Publish bytecode and create application
linera publish-and-create \
  --chain-id <MAIN_CHAIN_ID> \
  target/wasm32-unknown-unknown/release/aion_prediction_market.wasm

# Output example:
# Application ID: e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65000000000000000000000000
```

Save this as your **MAIN_APP_ID**.

---

## ⚙️ Step 4: Configure Backend

### Update `.env` File
```bash
cd ../backend
nano .env
```

Add/update these values:
```env
# MongoDB
MONGO_URL=mongodb://localhost:27017
DB_NAME=aion_db

# API Security
API_KEY=your-production-secret-key-here

# CORS
CORS_ORIGINS=http://localhost:3000,https://your-frontend-domain.com

# Linera Configuration
LINERA_RPC_URL=http://localhost:8080
LINERA_MAIN_CHAIN_ID=e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65
LINERA_MAIN_APP_ID=e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65000000000000000000000000

# Hybrid Chain Thresholds
HIGH_VALUE_THRESHOLD=10000
HIGH_VOLUME_THRESHOLD=100
```

---

## 🎨 Step 5: Configure Frontend

### Update `linera-config.js`
```bash
cd "../AION LINERA"
nano linera-config.js
```

Update with your chain IDs:
```javascript
const LineraConfig = {
  rpcUrl: 'http://localhost:8080', // or testnet URL
  
  mainChain: {
    chainId: 'e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65',
    appId: 'e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65000000000000000000000000',
    purpose: 'Governance, user registry, global state'
  },
  
  thresholds: {
    highValue: 10000,
    highVolume: 100
  }
};
```

---

## 🧪 Step 6: Test Deployment

### 1. Test Contract Call
```bash
# Test creating a market
linera client call \
  --chain-id <MAIN_CHAIN_ID> \
  --application-id <MAIN_APP_ID> \
  --operation CreateMarket \
  --params '{"title":"Test Market","description":"Testing","category":"Test","event_date":1735689600}'
```

### 2. Query State
```bash
linera client query \
  --chain-id <MAIN_CHAIN_ID> \
  --application-id <MAIN_APP_ID>
```

### 3. Test via Backend API
```bash
# Start backend
cd backend
source venv/bin/activate
python -m uvicorn server:app --reload --port 8001

# Test create market
curl -X POST http://localhost:8001/api/linera/market \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-production-secret-key-here" \
  -d '{
    "market_id": "test-001",
    "title": "Test Market",
    "description": "Testing deployment",
    "category": "Test",
    "event_date": 1735689600,
    "estimated_stake": 100,
    "estimated_participants": 5
  }'
```

---

## 🌍 Step 7: Production Deployment

### Backend (Railway/Render/Heroku)

#### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
cd backend
railway init
railway up
```

Add environment variables in Railway dashboard:
- All variables from `.env`
- `PORT` (Railway provides this)

#### Render
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repo
4. Settings:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
5. Add environment variables

### Frontend (Vercel/Netlify)

#### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd "AION LINERA"
vercel

# Production
vercel --prod
```

#### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd "AION LINERA"
netlify deploy

# Production
netlify deploy --prod
```

---

## 📊 Step 8: Monitor & Verify

### Check Chain Status
```bash
# View all chains
curl http://your-backend-url/api/linera/chains

# Check specific market
curl http://your-backend-url/api/linera/market/test-001/chain

# Get configuration
curl http://your-backend-url/api/linera/config
```

### Monitor Linera Node
```bash
# Check node status
linera client query-validators

# View chain info
linera client show-chain <CHAIN_ID>

# Check application
linera client show-application <APP_ID>
```

---

## 🔧 Troubleshooting

### Contract Build Fails
```bash
# Clean and rebuild
cd linera
cargo clean
cargo build --release --target wasm32-unknown-unknown
```

### Linera CLI Not Found
```bash
# Reinstall
cargo install linera-cli --force

# Add to PATH
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Chain Creation Fails
```bash
# Check Linera service is running
linera service

# Check wallet
linera wallet show

# Verify balance
linera wallet balance
```

### Backend Can't Connect to Linera
```bash
# Check RPC URL
curl http://localhost:8080/health

# Verify chain ID exists
linera client show-chain <CHAIN_ID>

# Check logs
tail -f backend/logs/app.log
```

---

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Rust & Cargo installed
- [ ] Linera CLI installed
- [ ] WASM target added
- [ ] Contract builds successfully
- [ ] MongoDB running
- [ ] Environment variables configured

### Deployment
- [ ] Linera network running (local or testnet)
- [ ] Main chain created
- [ ] Application deployed
- [ ] Chain IDs saved
- [ ] Backend `.env` updated
- [ ] Frontend config updated

### Testing
- [ ] Contract call works
- [ ] State query works
- [ ] Backend API responds
- [ ] Frontend connects
- [ ] Market creation works
- [ ] Staking works
- [ ] Chain allocation works

### Production
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Environment variables set
- [ ] CORS configured
- [ ] API keys secured
- [ ] Monitoring setup
- [ ] Backup strategy

---

## 🎯 Quick Deploy Script

Create `deploy.sh`:
```bash
#!/bin/bash

echo "🚀 AION Deployment Script"
echo "=========================="

# Build contract
echo "📦 Building smart contract..."
cd linera
cargo build --release --target wasm32-unknown-unknown
cd ..

# Create main chain
echo "🌐 Creating main chain..."
MAIN_CHAIN_ID=$(linera create-chain | grep -oE '[a-f0-9]{64}')
echo "Main Chain ID: $MAIN_CHAIN_ID"

# Deploy application
echo "📤 Deploying application..."
MAIN_APP_ID=$(linera publish-and-create \
  --chain-id $MAIN_CHAIN_ID \
  linera/target/wasm32-unknown-unknown/release/aion_prediction_market.wasm \
  | grep -oE '[a-f0-9]{64,}')
echo "Main App ID: $MAIN_APP_ID"

# Update backend .env
echo "⚙️ Updating backend configuration..."
cd backend
sed -i '' "s/LINERA_MAIN_CHAIN_ID=.*/LINERA_MAIN_CHAIN_ID=$MAIN_CHAIN_ID/" .env
sed -i '' "s/LINERA_MAIN_APP_ID=.*/LINERA_MAIN_APP_ID=$MAIN_APP_ID/" .env

echo "✅ Deployment complete!"
echo ""
echo "Main Chain ID: $MAIN_CHAIN_ID"
echo "Main App ID: $MAIN_APP_ID"
echo ""
echo "Next steps:"
echo "1. Update frontend config with chain IDs"
echo "2. Start backend: cd backend && uvicorn server:app --reload"
echo "3. Open frontend: open 'AION LINERA/index.html'"
```

Make executable and run:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 📚 Additional Resources

- [Linera Documentation](https://linera.dev/docs)
- [Linera SDK Reference](https://docs.rs/linera-sdk)
- [AION Hybrid Chain Strategy](docs/HYBRID_CHAIN_STRATEGY.md)
- [Quick Start Guide](QUICK_START_HYBRID_CHAIN.md)

---

## 🎉 Summary

Untuk deploy AION, kamu butuh:

1. **Tools**: Rust, Linera CLI, WASM target
2. **Build**: Compile smart contract ke WASM
3. **Deploy**: Create chain & deploy application
4. **Configure**: Update chain IDs di backend & frontend
5. **Test**: Verify semua fungsi bekerja
6. **Production**: Deploy backend & frontend ke hosting

**Estimated Time**: 30-60 minutes untuk first deployment

Good luck! 🚀
