# BCS Schema Documentation

## AION Prediction Market - Linera Operations

### Operation Types

#### 1. CreateMarket
```rust
CreateMarket {
    title: String,
    description: String,
    category: String,
    event_date: u64
}
```

**BCS Encoding Example:**
```python
import bcs

operation = {
    "CreateMarket": {
        "title": "BTC will reach $150k by 2025",
        "description": "Bitcoin price prediction",
        "category": "Finance",
        "event_date": 1735689600  # Unix timestamp
    }
}
```

#### 2. Stake
```rust
Stake {
    market_id: u64,
    amount: u128,
    prediction: bool  // true = YES, false = NO
}
```

**BCS Encoding Example:**
```python
operation = {
    "Stake": {
        "market_id": 1,
        "amount": 1000000000,  # 1000 AION (assuming 6 decimals)
        "prediction": True
    }
}
```

#### 3. ResolveMarket
```rust
ResolveMarket {
    market_id: u64,
    outcome: bool
}
```

**BCS Encoding Example:**
```python
operation = {
    "ResolveMarket": {
        "market_id": 1,
        "outcome": True
    }
}
```

#### 4. ClaimRewards
```rust
ClaimRewards {
    market_id: u64
}
```

**BCS Encoding Example:**
```python
operation = {
    "ClaimRewards": {
        "market_id": 1
    }
}
```

## State Structure

### Market
```rust
struct Market {
    id: u64,
    title: String,
    description: String,
    category: String,
    event_date: u64,
    total_stake_yes: u128,
    total_stake_no: u128,
    resolved: bool,
    outcome: Option<bool>
}
```

### AionState
```rust
struct AionState {
    markets: Vec<Market>,
    next_market_id: u64
}
```

## Query Responses

All queries return the full `AionState` serialized with BCS.

## Error Codes

- `0x01` - Market not found
- `0x02` - Insufficient balance
- `0x03` - Market already resolved
- `0x04` - Unauthorized operation
- `0x05` - Invalid parameters
