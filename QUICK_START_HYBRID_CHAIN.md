# 🚀 Quick Start - Hybrid Chain Strategy

## TL;DR

AION sekarang menggunakan **3-tier hybrid chain strategy**:
- 🏛️ **Main Chain**: Governance & global state
- ⚡ **Dedicated Chains**: High-value markets (≥10k AION or ≥100 users)
- 🔗 **Shared Chain**: Small markets

---

## ⚡ Quick Commands

### Check Configuration
```bash
curl http://localhost:8001/api/linera/config
```

### Create Market (Auto-Allocates Chain)
```bash
curl -X POST http://localhost:8001/api/linera/market \
  -H "Content-Type: application/json" \
  -H "x-api-key: aion-secret-key-change-in-production" \
  -d '{
    "market_id": "btc-100k",
    "title": "Bitcoin $100k by 2025?",
    "description": "Will BTC reach $100k?",
    "category": "Finance",
    "event_date": 1735689600,
    "estimated_stake": 50000,
    "estimated_participants": 200
  }'
```

### Check Market Chain
```bash
curl http://localhost:8001/api/linera/market/btc-100k/chain
```

### View All Chains
```bash
curl http://localhost:8001/api/linera/chains
```

### Stake (Auto-Routes)
```bash
curl -X POST http://localhost:8001/api/linera/stake \
  -H "Content-Type: application/json" \
  -d '{
    "market_id": "btc-100k",
    "amount": 1000,
    "prediction": true,
    "user_address": "0x123..."
  }'
```

---

## 📊 Chain Allocation Rules

| Condition | Chain Type | Icon |
|-----------|-----------|------|
| Stake ≥ 10,000 AION | Dedicated | ⚡ |
| Users ≥ 100 | Dedicated | ⚡ |
| Stake < 10,000 AND Users < 100 | Shared | 🔗 |
| New market (no data) | Shared | 🔗 |

---

## 🔧 Configuration Files

### Backend: `backend/.env`
```env
LINERA_MAIN_CHAIN_ID=default
LINERA_MAIN_APP_ID=<set-after-deployment>
HIGH_VALUE_THRESHOLD=10000
HIGH_VOLUME_THRESHOLD=100
```

### Frontend: `AION LINERA/linera-config.js`
```javascript
const LineraConfig = {
  mainChain: { chainId: 'default', appId: '...' },
  thresholds: { highValue: 10000, highVolume: 100 }
};
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `backend/linera_adapter.py` | Chain allocation logic |
| `backend/server.py` | API endpoints |
| `backend/.env` | Configuration |
| `AION LINERA/linera-config.js` | Frontend config |
| `docs/HYBRID_CHAIN_STRATEGY.md` | Full documentation |

---

## 🎯 What Happens When?

### Creating Small Market
```
estimated_stake: 1000
estimated_participants: 10
    ↓
Uses Shared Chain 🔗
    ↓
Fast & cost-efficient
```

### Creating Large Market
```
estimated_stake: 50000
estimated_participants: 200
    ↓
Creates Dedicated Chain ⚡
    ↓
Maximum performance
```

### Market Grows
```
Small market on Shared Chain
    ↓
Reaches 10k stake or 100 users
    ↓
Auto-migrate to Dedicated Chain
    ↓
Scales seamlessly
```

---

## 🧪 Test It Now

1. **Start Backend** (already running ✅)
   ```bash
   cd backend
   source venv/bin/activate
   python -m uvicorn server:app --reload --port 8001
   ```

2. **Test Small Market**
   ```bash
   curl -X POST http://localhost:8001/api/linera/market \
     -H "Content-Type: application/json" \
     -H "x-api-key: aion-secret-key-change-in-production" \
     -d '{"market_id":"small","title":"Small","description":"Test","category":"Test","event_date":1735689600,"estimated_stake":100,"estimated_participants":5}'
   ```

3. **Test Large Market**
   ```bash
   curl -X POST http://localhost:8001/api/linera/market \
     -H "Content-Type: application/json" \
     -H "x-api-key: aion-secret-key-change-in-production" \
     -d '{"market_id":"large","title":"Large","description":"Test","category":"Test","event_date":1735689600,"estimated_stake":50000,"estimated_participants":200}'
   ```

4. **Compare Results**
   ```bash
   curl http://localhost:8001/api/linera/chains
   ```

---

## 💡 Pro Tips

1. **Estimate Accurately**: Provide good estimates when creating markets
2. **Monitor Growth**: Track stake/participants for auto-migration
3. **Check Chain Type**: Display chain badge in UI (⚡ vs 🔗)
4. **Cache Chain Info**: Store mappings in DB for fast lookup
5. **Handle Fallbacks**: Shared chain is fallback if dedicated fails

---

## 🎉 Done!

Hybrid chain strategy is **ready to use**! 

Backend: ✅ Running on port 8001  
Frontend: ✅ Open at http://localhost:3000  
Docs: ✅ Complete in `docs/HYBRID_CHAIN_STRATEGY.md`

**Next**: Deploy Linera contract & update chain IDs in `.env`
