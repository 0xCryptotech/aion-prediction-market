# ✅ AION Deployment Checklist

## 📋 Pre-Deployment

### Install Tools
- [ ] Rust & Cargo installed
  ```bash
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  ```
- [ ] Linera CLI installed
  ```bash
  cargo install linera-cli
  ```
- [ ] WASM target added
  ```bash
  rustup target add wasm32-unknown-unknown
  ```
- [ ] MongoDB running
  ```bash
  mongod
  ```

### Verify Installation
- [ ] `rustc --version` works
- [ ] `cargo --version` works
- [ ] `linera --version` works
- [ ] MongoDB accessible at `mongodb://localhost:27017`

---

## 🚀 Deployment Steps

### Option 1: Automated (Recommended)
- [ ] Run deployment script
  ```bash
  ./deploy.sh
  ```
- [ ] Follow prompts
- [ ] Save Chain ID and App ID from output

### Option 2: Manual

#### 1. Build Contract
- [ ] Navigate to linera directory
  ```bash
  cd linera
  ```
- [ ] Build WASM
  ```bash
  cargo build --release --target wasm32-unknown-unknown
  ```
- [ ] Verify WASM file exists
  ```bash
  ls target/wasm32-unknown-unknown/release/*.wasm
  ```

#### 2. Setup Linera Network
- [ ] Start local network OR connect to testnet
  ```bash
  linera net up  # Local
  # OR
  linera --config ~/.config/linera/testnet.toml wallet show  # Testnet
  ```

#### 3. Create Main Chain
- [ ] Create governance chain
  ```bash
  linera create-chain
  ```
- [ ] Save Chain ID: `_________________`

#### 4. Deploy Application
- [ ] Deploy to main chain
  ```bash
  linera publish-and-create \
    --chain-id <MAIN_CHAIN_ID> \
    target/wasm32-unknown-unknown/release/aion_prediction_market.wasm
  ```
- [ ] Save App ID: `_________________`

#### 5. Configure Backend
- [ ] Update `backend/.env`:
  ```env
  LINERA_RPC_URL=http://localhost:8080
  LINERA_MAIN_CHAIN_ID=<your-chain-id>
  LINERA_MAIN_APP_ID=<your-app-id>
  HIGH_VALUE_THRESHOLD=10000
  HIGH_VOLUME_THRESHOLD=100
  ```

#### 6. Configure Frontend
- [ ] Update `AION LINERA/linera-config.js`:
  ```javascript
  mainChain: {
    chainId: '<your-chain-id>',
    appId: '<your-app-id>'
  }
  ```

---

## 🧪 Testing

### Backend Tests
- [ ] Start backend
  ```bash
  cd backend
  source venv/bin/activate
  uvicorn server:app --reload --port 8001
  ```
- [ ] Test config endpoint
  ```bash
  curl http://localhost:8001/api/linera/config
  ```
- [ ] Test create market
  ```bash
  curl -X POST http://localhost:8001/api/linera/market \
    -H "Content-Type: application/json" \
    -H "x-api-key: aion-secret-key-change-in-production" \
    -d '{
      "market_id": "test-001",
      "title": "Test Market",
      "description": "Testing",
      "category": "Test",
      "event_date": 1735689600,
      "estimated_stake": 100,
      "estimated_participants": 5
    }'
  ```
- [ ] Test view chains
  ```bash
  curl http://localhost:8001/api/linera/chains
  ```

### Frontend Tests
- [ ] Open frontend
  ```bash
  open "AION LINERA/index.html"
  ```
- [ ] Check console for errors
- [ ] Test wallet connection
- [ ] Test market browsing
- [ ] Test staking (if wallet connected)

### Linera Tests
- [ ] Query chain state
  ```bash
  linera client query \
    --chain-id <MAIN_CHAIN_ID> \
    --application-id <MAIN_APP_ID>
  ```
- [ ] Check chain info
  ```bash
  linera client show-chain <MAIN_CHAIN_ID>
  ```

---

## 🌍 Production Deployment

### Backend Deployment
- [ ] Choose platform (Railway/Render/Heroku)
- [ ] Deploy backend
- [ ] Set environment variables
- [ ] Test production API
- [ ] Save production URL: `_________________`

### Frontend Deployment
- [ ] Choose platform (Vercel/Netlify)
- [ ] Update API URL in config
- [ ] Deploy frontend
- [ ] Test production site
- [ ] Save production URL: `_________________`

### Security
- [ ] Change API_KEY in production
- [ ] Update CORS_ORIGINS
- [ ] Enable HTTPS
- [ ] Setup monitoring
- [ ] Configure backups

---

## 📊 Post-Deployment

### Monitoring
- [ ] Check backend logs
- [ ] Monitor Linera node
- [ ] Track chain health
- [ ] Monitor API usage
- [ ] Check error rates

### Documentation
- [ ] Save deployment info
- [ ] Document chain IDs
- [ ] Update team wiki
- [ ] Share API endpoints
- [ ] Create runbook

### Optimization
- [ ] Adjust thresholds if needed
- [ ] Monitor chain allocation
- [ ] Track migration events
- [ ] Optimize gas usage
- [ ] Scale as needed

---

## 🆘 Troubleshooting

### Build Fails
- [ ] Clean build: `cargo clean`
- [ ] Update Rust: `rustup update`
- [ ] Check dependencies: `cargo check`

### Deployment Fails
- [ ] Check Linera is running
- [ ] Verify wallet has balance
- [ ] Check network connectivity
- [ ] Review error logs

### Backend Issues
- [ ] Check MongoDB connection
- [ ] Verify .env configuration
- [ ] Check Python dependencies
- [ ] Review server logs

### Frontend Issues
- [ ] Check browser console
- [ ] Verify API URL
- [ ] Check CORS settings
- [ ] Test with different browser

---

## 📝 Deployment Info

**Deployment Date**: _______________

**Environment**: 
- [ ] Local Development
- [ ] Testnet
- [ ] Mainnet

**Chain IDs**:
- Main Chain: `_________________`
- Main App: `_________________`

**URLs**:
- Backend: `_________________`
- Frontend: `_________________`
- RPC: `_________________`

**Team Members**:
- Deployer: `_________________`
- Reviewer: `_________________`

**Notes**:
```
_________________________________
_________________________________
_________________________________
```

---

## ✅ Sign-Off

- [ ] All tests passed
- [ ] Documentation updated
- [ ] Team notified
- [ ] Monitoring configured
- [ ] Backup strategy in place

**Deployed by**: _______________  
**Date**: _______________  
**Signature**: _______________

---

## 📚 Resources

- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Full guide
- [QUICK_START_HYBRID_CHAIN.md](QUICK_START_HYBRID_CHAIN.md) - Quick reference
- [docs/HYBRID_CHAIN_STRATEGY.md](docs/HYBRID_CHAIN_STRATEGY.md) - Technical docs
- [Linera Documentation](https://linera.dev/docs)

---

**Status**: 
- [ ] Not Started
- [ ] In Progress
- [ ] Completed
- [ ] Verified

**Last Updated**: _______________
