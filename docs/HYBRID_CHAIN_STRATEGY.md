# Hybrid Chain Strategy - AION on Linera

## Overview

AION menggunakan **Hybrid Chain Strategy** untuk mengoptimalkan performa dan biaya di Linera blockchain.

## Arsitektur

### 1. Main Chain (Governance Chain)
**Chain ID**: `LINERA_MAIN_CHAIN_ID`  
**App ID**: `LINERA_MAIN_APP_ID`

**Fungsi**:
- DAO Governance proposals & voting
- User registry dan reputation
- Global statistics
- AI model leaderboard
- Cross-chain coordination

**Karakteristik**:
- Always active
- High security
- Moderate throughput

---

### 2. Dedicated Chains (High-Value Markets)
**Allocation**: Dynamic, per market

**Kriteria**:
- Total stake ≥ 10,000 AION tokens
- Participants ≥ 100 users
- High-profile events (manual allocation)

**Keuntungan**:
- Maximum throughput
- Isolated state (no congestion)
- Independent scaling
- Dedicated resources

**Contoh Use Cases**:
- Major sports events (World Cup, Olympics)
- Presidential elections
- High-stakes financial predictions
- Viral trending markets

---

### 3. Shared Chain (Small Markets)
**Chain ID**: Same as Main Chain  
**App ID**: Same as Main Chain

**Kriteria**:
- Total stake < 10,000 AION
- Participants < 100 users
- Regular/standard markets

**Keuntungan**:
- Cost-efficient
- Simple deployment
- Shared security
- Easy management

**Contoh Use Cases**:
- Niche predictions
- New/experimental markets
- Low-volume categories
- Testing markets

---

## Chain Allocation Flow

```
Market Created
    ↓
Estimate Value & Volume
    ↓
    ├─→ High Value/Volume? → Create Dedicated Chain
    │                         ├─ Create new microchain
    │                         ├─ Deploy app instance
    │                         └─ Route all operations to it
    │
    └─→ Low Value/Volume? → Use Shared Chain
                            └─ Route to main chain
```

---

## Dynamic Migration

Markets can be **migrated** from Shared → Dedicated if they grow:

```python
# Automatic migration trigger
if current_stake >= 10000 or participants >= 100:
    migrate_to_dedicated_chain(market_id)
```

**Migration Process**:
1. Create new dedicated chain
2. Deploy app instance
3. Copy current state
4. Update routing
5. Redirect future operations

---

## Configuration

### Backend (.env)
```env
# Main chain
LINERA_MAIN_CHAIN_ID=default
LINERA_MAIN_APP_ID=<your-app-id>
LINERA_RPC_URL=http://localhost:8080

# Thresholds
HIGH_VALUE_THRESHOLD=10000
HIGH_VOLUME_THRESHOLD=100
```

### Frontend (linera-config.js)
```javascript
const LineraConfig = {
  mainChain: {
    chainId: 'default',
    appId: '<your-app-id>'
  },
  thresholds: {
    highValue: 10000,
    highVolume: 100
  }
};
```

---

## API Integration

### Create Market with Chain Allocation
```python
result = await linera_adapter.create_market(
    market_id="market-123",
    title="Bitcoin $100k by 2025?",
    description="...",
    category="Finance",
    event_date=1735689600,
    estimated_stake=50000,      # High value → dedicated chain
    estimated_participants=200   # High volume → dedicated chain
)

# Returns:
{
    "success": True,
    "chain_info": {
        "chain_id": "0xabc123...",
        "app_id": "0xdef456...",
        "type": "dedicated"
    }
}
```

### Stake on Market (Auto-Routing)
```python
result = await linera_adapter.stake(
    market_id="market-123",
    amount=1000,
    prediction=True,
    user_address="0x..."
)
# Automatically routes to correct chain
```

### Query Market State
```python
chain_info = linera_adapter.get_chain_info("market-123")
state = await linera_adapter.query_state(
    chain_id=chain_info["chain_id"],
    app_id=chain_info["app_id"]
)
```

---

## Benefits

### Scalability
- High-value markets don't congest shared resources
- Each dedicated chain can handle 1000+ TPS
- Parallel processing across chains

### Cost Efficiency
- Small markets share infrastructure
- No wasted resources on low-volume markets
- Pay for performance only when needed

### Flexibility
- Dynamic allocation based on real metrics
- Can migrate markets as they grow
- Manual override for special cases

### User Experience
- Fast transactions on all markets
- No gas fee spikes
- Predictable performance

---

## Monitoring

### Chain Health Dashboard
```javascript
// Get all active chains
GET /api/linera/chains

// Response:
{
  "main_chain": {
    "chain_id": "default",
    "markets": 45,
    "total_stake": 125000
  },
  "dedicated_chains": [
    {
      "chain_id": "0xabc...",
      "market_id": "market-123",
      "stake": 50000,
      "participants": 200
    }
  ]
}
```

---

## Best Practices

1. **Estimate Accurately**: Provide good estimates when creating markets
2. **Monitor Growth**: Track stake and participants for migration triggers
3. **Test Locally**: Use local Linera network for testing chain allocation
4. **Cache Chain Info**: Store chain mappings in database for fast lookup
5. **Handle Failures**: Fallback to shared chain if dedicated creation fails

---

## Future Enhancements

- **Auto-scaling**: Automatically create more shared chains when congested
- **Geographic Chains**: Allocate chains based on user location
- **Category Chains**: Dedicated chains per category (Finance, Sports, etc.)
- **Time-based**: Temporary dedicated chains for time-sensitive events

---

## Troubleshooting

### Market not found on chain
```bash
# Check chain mapping
linera_adapter.get_chain_info("market-123")

# Query state directly
linera client query --chain-id <chain-id> --application-id <app-id>
```

### Migration failed
```python
# Retry migration
await linera_adapter.migrate_to_dedicated_chain(
    market_id="market-123",
    current_stake=15000,
    participant_count=150
)
```

### Chain creation timeout
- Check Linera node is running
- Verify RPC connection
- Check system resources
- Review Linera logs

---

## Summary

Hybrid Chain Strategy memberikan **balance optimal** antara:
- ✅ Scalability (dedicated chains)
- ✅ Cost efficiency (shared chains)
- ✅ Flexibility (dynamic allocation)
- ✅ User experience (fast & predictable)

Perfect untuk AION prediction market! 🚀
