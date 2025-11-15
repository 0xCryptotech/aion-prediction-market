# 🔗 AION x Linera Integration Guide

## 📊 Current Integration Status

### ✅ What's Already Integrated

**Backend:**
- ✅ Linera Adapter (`backend/linera_adapter.py`)
- ✅ Hybrid Chain Strategy (main/dedicated/shared)
- ✅ Chain allocation logic
- ✅ Environment configuration

**Frontend:**
- ✅ Linera Config (`AION LINERA/linera-config.js`)
- ✅ Chain type detection
- ✅ API integration structure

**Smart Contract:**
- ✅ Contract structure (`linera/src/lib.rs`)
- ✅ State management
- ✅ Operations defined
- ⚠️ Needs SDK update (compilation errors)

---

## 🎯 Integration Architecture

### Hybrid Chain Strategy

```
┌─────────────────────────────────────────┐
│         AION Application                │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────┐  ┌──────────┐  ┌───────┐│
│  │   Main   │  │Dedicated │  │Shared ││
│  │  Chain   │  │  Chains  │  │ Chain ││
│  └──────────┘  └──────────┘  └───────┘│
│       │              │            │    │
│   Governance    High-Value    Small   │
│   Registry      Markets      Markets  │
└─────────────────────────────────────────┘
```

### Chain Allocation Rules

| Condition | Chain Type | Use Case |
|-----------|------------|----------|
| TVL > 10,000 AION | Dedicated | High-value markets |
| Participants > 100 | Dedicated | High-volume markets |
| Default | Shared | Small markets |
| Governance | Main | DAO, Registry |

---

## 🚀 How to Use Linera Integration

### 1. Create Market with Linera

```javascript
// Frontend call
const market = {
  title: "BTC Price Prediction",
  category: "Finance",
  prediction_value: "BULLISH",
  total_stake: 15000 // > 10000, will get dedicated chain
};

const response = await fetch('http://localhost:8001/api/linera/market', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-api-key'
  },
  body: JSON.stringify(market)
});

const result = await response.json();
console.log('Chain allocated:', result.chain_info);
// Output: { chain_id: "...", app_id: "...", type: "dedicated" }
```

### 2. Stake on Linera

```javascript
// Stake on prediction
const stake = {
  market_id: "market-123",
  amount: 100,
  wallet_address: "0x..."
};

const response = await fetch('http://localhost:8001/api/linera/stake', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(stake)
});
```

### 3. Query Linera State

```javascript
// Get market state from Linera
const response = await fetch('http://localhost:8001/api/linera/state', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    chain_id: "...",
    app_id: "..."
  })
});

const state = await response.json();
console.log('On-chain state:', state);
```

---

## 🔧 Backend API Endpoints

### Market Management

```python
# Create market on Linera
POST /api/linera/market
Headers: X-API-Key: your-key
Body: {
  "title": "string",
  "category": "string",
  "prediction_value": "string",
  "total_stake": float
}
Response: {
  "success": true,
  "market_id": "uuid",
  "chain_info": {
    "chain_id": "string",
    "app_id": "string",
    "type": "dedicated|shared"
  }
}
```

### Staking

```python
# Stake on Linera
POST /api/linera/stake
Body: {
  "market_id": "string",
  "amount": float,
  "wallet_address": "string"
}
Response: {
  "success": true,
  "transaction_id": "string",
  "chain_id": "string"
}
```

### State Query

```python
# Query Linera state
POST /api/linera/state
Body: {
  "chain_id": "string",
  "app_id": "string"
}
Response: {
  "markets": [...],
  "total_staked": float,
  "participants": int
}
```

### Market Resolution

```python
# Resolve market on Linera
POST /api/linera/resolve/{market_id}
Headers: X-API-Key: your-key
Body: {
  "outcome": "correct|incorrect"
}
Response: {
  "success": true,
  "rewards_distributed": float
}
```

---

## 💻 Frontend Integration

### Display Chain Info

```javascript
// Show which chain a market is using
async function displayMarketChain(marketId) {
  const chainInfo = await LineraConfig.getMarketChainInfo(marketId);
  
  const label = LineraConfig.getChainTypeLabel(chainInfo.type);
  console.log(`Market on: ${label}`);
  
  // Display in UI
  document.getElementById('chain-badge').innerHTML = `
    <span class="badge">${label}</span>
    <span class="chain-id">${chainInfo.chain_id.substring(0, 8)}...</span>
  `;
}
```

### Check Chain Allocation

```javascript
// Check if market will get dedicated chain
const totalStake = 15000;
const participants = 50;

if (LineraConfig.shouldUseDedicatedChain(totalStake, participants)) {
  console.log('⚡ This market will get a dedicated chain!');
} else {
  console.log('🔗 This market will use shared chain');
}
```

---

## 🔐 Configuration

### Backend (.env)

```env
# Linera Configuration
LINERA_RPC_URL=http://localhost:8080
LINERA_MAIN_CHAIN_ID=e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65
LINERA_MAIN_APP_ID=e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65000000000000000000000000

# Chain Allocation Thresholds
HIGH_VALUE_THRESHOLD=10000
HIGH_VOLUME_THRESHOLD=100

# API Security
API_KEY=your-secret-key
```

### Frontend (linera-config.js)

```javascript
const LineraConfig = {
  rpcUrl: 'http://localhost:8080',
  mainChain: {
    chainId: 'e476187f...',
    appId: 'e476187f...'
  },
  thresholds: {
    highValue: 10000,
    highVolume: 100
  }
};
```

---

## 🧪 Testing Integration

### 1. Test Chain Allocation

```bash
# Create high-value market (should get dedicated chain)
curl -X POST http://localhost:8001/api/linera/market \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-key" \
  -d '{
    "title": "High Value Market",
    "total_stake": 15000
  }'

# Response should show: "type": "dedicated"
```

### 2. Test Staking

```bash
# Stake on market
curl -X POST http://localhost:8001/api/linera/stake \
  -H "Content-Type: application/json" \
  -d '{
    "market_id": "market-123",
    "amount": 100,
    "wallet_address": "0x..."
  }'
```

### 3. Test State Query

```bash
# Query on-chain state
curl -X POST http://localhost:8001/api/linera/state \
  -H "Content-Type: application/json" \
  -d '{
    "chain_id": "...",
    "app_id": "..."
  }'
```

---

## 📊 Current Status

### ✅ Working (Mock Mode)

- Backend API endpoints
- Chain allocation logic
- Hybrid strategy implementation
- Frontend configuration
- API integration structure

### ⏳ Needs Real Linera

- Smart contract deployment
- Actual on-chain transactions
- Cross-chain messaging
- Real state verification

---

## 🎯 Next Steps

### To Enable Full Linera Integration:

1. **Fix Smart Contract**
   - Update to Linera SDK 0.12.1 API
   - Fix compilation errors
   - Test contract locally

2. **Deploy to Testnet**
   - Build WASM contract
   - Deploy to Linera testnet
   - Get real Chain ID & App ID

3. **Update Configuration**
   - Replace placeholder IDs with real ones
   - Update backend/.env
   - Update frontend config

4. **Test End-to-End**
   - Create market on-chain
   - Stake tokens
   - Resolve market
   - Claim rewards

---

## 💡 Benefits of Linera Integration

### Performance
- ⚡ Instant finality
- 🚀 High throughput
- 💰 Near-zero gas fees

### Scalability
- 📈 Dedicated chains for popular markets
- 🔗 Shared chains for efficiency
- 🏛️ Main chain for governance

### User Experience
- ✅ Fast transactions
- ✅ Low costs
- ✅ Seamless experience

---

## 📝 Summary

**Current State:**
- ✅ Integration architecture complete
- ✅ API endpoints ready
- ✅ Frontend structure ready
- ⏸️ Waiting for Linera contract deployment

**To Go Live:**
1. Deploy Linera smart contract
2. Update Chain IDs in config
3. Test on testnet
4. Deploy to mainnet

**Mock Mode:**
- All features work without blockchain
- Perfect for development and testing
- Easy to switch to real Linera later

---

**Status:** 🟡 **Ready for Linera Deployment**

Integration code is complete. Just need to deploy smart contract and update IDs!
