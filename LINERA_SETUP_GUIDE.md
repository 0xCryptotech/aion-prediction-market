# Linera Setup Guide for AION

## Current Status

✅ **Smart Contract**: Complete & tested  
❌ **Linera CLI**: Not available via cargo install  
✅ **Rust & WASM**: Installed  

---

## Issue: Linera CLI Installation

The official Linera CLI is not available via `cargo install linera-cli` yet.

### Options:

### Option 1: Build from Source (Recommended)
```bash
# Clone Linera repository
git clone https://github.com/linera-io/linera-protocol.git
cd linera-protocol

# Build Linera CLI
cargo build --release -p linera-service

# Add to PATH
export PATH="$PWD/target/release:$PATH"

# Verify
linera --version
```

### Option 2: Use Docker
```bash
# Pull Linera Docker image
docker pull ghcr.io/linera-io/linera:latest

# Run Linera commands via Docker
docker run --rm ghcr.io/linera-io/linera:latest linera --version
```

### Option 3: Wait for Official Release
Linera is still in development. Official CLI release coming soon.

### Option 4: Mock Deployment (For Testing)
Use our smart contract logic directly without Linera for now.

---

## Alternative: Test Without Linera

Since our smart contract logic is complete and tested, we can:

### 1. Use the Simple Version Directly
```rust
// File: linera/src/lib_simple.rs
// Already fully functional!

use aion_contract::State;

let mut state = State::new("admin".to_string());

// Create market
state.create_market(...)?;

// Stake
state.stake(...)?;

// Resolve
state.resolve_market(...)?;

// Claim
state.claim_rewards(...)?;
```

### 2. Integrate with Backend Now
We can integrate the contract logic with our backend API without deploying to Linera yet.

```python
# backend/contract_logic.py
# Port the Rust logic to Python or use PyO3
```

### 3. Mock Linera Adapter
Update `backend/linera_adapter.py` to use in-memory state for testing.

---

## Recommended Next Steps

### Immediate (Today)

**Option A: Frontend-Backend Integration**
- Skip Linera deployment for now
- Use mock data or in-memory state
- Get full UI working
- Test user flows

**Option B: Build Linera from Source**
- Clone linera-protocol repo
- Build CLI
- Deploy locally
- Test full flow

**Option C: Continue with Mock**
- Use existing backend with MongoDB
- Simulate blockchain operations
- Perfect for development/testing

### Short-term (This Week)

1. **Complete Frontend Integration**
   - Connect UI to backend APIs
   - Add wallet integration
   - Test all features

2. **Prepare for Linera**
   - Monitor Linera releases
   - Keep contract code updated
   - Document deployment process

3. **Production Backend**
   - Deploy backend to Railway/Render
   - Deploy frontend to Vercel
   - Use MongoDB for state

### Long-term (When Linera is Ready)

1. **Deploy to Linera Testnet**
   - Use official CLI
   - Deploy contract
   - Test on testnet

2. **Migrate State**
   - Move from MongoDB to Linera
   - Keep backend as adapter
   - Maintain compatibility

---

## Current Architecture

```
┌─────────────┐
│   Frontend  │ (Static HTML)
│  AION UI    │
└──────┬──────┘
       │
       │ HTTP API
       │
┌──────▼──────┐
│   Backend   │ (FastAPI)
│  API Server │
└──────┬──────┘
       │
       ├─────────────┐
       │             │
┌──────▼──────┐ ┌───▼────────┐
│   MongoDB   │ │  Linera    │
│   (State)   │ │ (Future)   │
└─────────────┘ └────────────┘
```

**Current**: MongoDB stores all state  
**Future**: Linera stores state, MongoDB caches

---

## What We Can Do NOW

### 1. Complete Frontend Integration ✅
```javascript
// AION LINERA/index.html
// Add API calls to backend

async function loadMarkets() {
    const response = await fetch('http://localhost:8001/api/predictions');
    const markets = await response.json();
    displayMarkets(markets);
}
```

### 2. Test Full User Flow ✅
```
User Journey:
1. Open AION frontend
2. Connect MetaMask wallet
3. Browse prediction markets
4. Stake on a prediction
5. Wait for resolution
6. Claim rewards
```

### 3. Deploy to Production ✅
```bash
# Backend to Railway
cd backend
railway up

# Frontend to Vercel
cd "AION LINERA"
vercel --prod
```

---

## Decision Point

**What do you want to do?**

### Option 1: Frontend Integration (Recommended)
**Time**: 3-4 hours  
**Impact**: High - Get full app working  
**Blocker**: None

**Steps**:
1. Add API calls to frontend
2. Connect wallet
3. Test user flows
4. Deploy to production

### Option 2: Build Linera from Source
**Time**: 1-2 hours  
**Impact**: Medium - Can deploy contract  
**Blocker**: Need to clone & build

**Steps**:
1. Clone linera-protocol
2. Build CLI
3. Deploy contract locally
4. Test operations

### Option 3: Deploy Backend/Frontend Now
**Time**: 1 hour  
**Impact**: High - Live app  
**Blocker**: None

**Steps**:
1. Deploy backend to Railway
2. Deploy frontend to Vercel
3. Test live
4. Share with users

---

## My Recommendation

**Go with Option 1: Frontend Integration**

**Why?**
1. No blockers - can start immediately
2. High impact - full app working
3. Linera can be added later
4. Users can test the app now

**Then**:
- Deploy to production (Option 3)
- Build Linera when ready (Option 2)

**Result**:
- Working app in 4-5 hours
- Can demo to users
- Can add Linera later without breaking anything

---

## Summary

**Current Status**:
- ✅ Smart contract logic complete
- ✅ Backend API ready
- ✅ Frontend UI ready
- ❌ Linera CLI not available yet

**Recommendation**:
Focus on **Frontend Integration** now, deploy to production, add Linera later.

**Timeline**:
- Today: Frontend integration (3-4 hours)
- Tomorrow: Production deployment (1 hour)
- Next week: Linera integration (when CLI available)

**This approach gets you a working app ASAP!** 🚀
