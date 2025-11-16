# 🧪 Cara Menguji AION Fully Onchain

## ✅ Aplikasi Sudah Running

Pastikan aplikasi sudah berjalan:
- **Frontend:** http://localhost:8080
- **Backend:** http://localhost:8001

Jika belum, jalankan:
```bash
./start-onchain.sh
```

---

## 📋 Panduan Testing Lengkap

### 1️⃣ Test API dengan Browser

#### A. Buka API Documentation
```
http://localhost:8001/docs
```

Di sini Anda bisa:
- Lihat semua endpoint
- Test langsung dari browser
- Lihat request/response format

#### B. Test Health Check
```
http://localhost:8001/
```

Harusnya muncul:
```json
{
  "name": "AION Prediction Market",
  "mode": "Fully Onchain",
  "blockchain": "Linera Protocol",
  "status": "operational"
}
```

#### C. Test Blockchain Info
```
http://localhost:8001/api/blockchain/info
```

Harusnya muncul Chain ID dan App ID.

---

### 2️⃣ Test dengan Terminal (curl)

#### A. Health Check
```bash
curl http://localhost:8001/
```

#### B. Blockchain Info
```bash
curl http://localhost:8001/api/blockchain/info
```

#### C. Create Market (Onchain Transaction)
```bash
curl -X POST http://localhost:8001/api/markets \
  -H "Content-Type: application/json" \
  -d '{
    "market_id": "test-market-001",
    "title": "Test Market",
    "description": "Testing onchain market creation",
    "category": "crypto",
    "event_date": 1735689600
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "market_id": "test-market-001",
  "txHash": "0x...",
  "blockNumber": 1003016,
  "chainId": "e476187f..."
}
```

✅ **Cek:** Ada `txHash` dan `blockNumber`

#### D. Place Stake (Onchain Transaction)
```bash
curl -X POST http://localhost:8001/api/markets/test-market-001/stake \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "amount": 1000,
    "prediction": true
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "market_id": "test-market-001",
  "txHash": "0x...",
  "blockNumber": 1005628,
  "chainId": "e476187f..."
}
```

✅ **Cek:** Transaction berhasil dengan hash baru

#### E. Query Markets (From Blockchain)
```bash
curl http://localhost:8001/api/markets
```

**Expected Response:**
```json
{
  "markets": [],
  "source": "blockchain",
  "chainId": "e476187f..."
}
```

✅ **Cek:** Source adalah "blockchain"

#### F. Get Platform Stats
```bash
curl http://localhost:8001/api/stats
```

---

### 3️⃣ Test Frontend di Browser

#### A. Buka Frontend
```
http://localhost:8080
```

#### B. Cek Console (F12)
1. Tekan **F12** untuk buka Developer Tools
2. Pilih tab **Console**
3. Harusnya muncul:
```
🛡️ Error handler initialized
🔍 Checking AION dependencies...
✅ Pyth Network SDK loaded (atau fallback)
✅ Lucide icons loaded
✅ Tailwind CSS loaded
📊 Dependencies: X/5 loaded
```

#### C. Test UI Features
1. **Dashboard** - Lihat statistics
2. **Marketplace** - Browse markets
3. **Create Market** - Buat market baru
4. **Place Stake** - Taruh stake
5. **Leaderboard** - Lihat rankings

---

### 4️⃣ Test dengan Python Script

Buat file `test_aion.py`:

```python
import requests
import json

BASE_URL = "http://localhost:8001"

def test_health():
    print("🧪 Testing Health Check...")
    response = requests.get(f"{BASE_URL}/")
    print(f"✅ Status: {response.json()['status']}")
    print()

def test_blockchain_info():
    print("🧪 Testing Blockchain Info...")
    response = requests.get(f"{BASE_URL}/api/blockchain/info")
    data = response.json()
    print(f"✅ Chain ID: {data['chain_id'][:20]}...")
    print(f"✅ Network: {data['network']}")
    print()

def test_create_market():
    print("🧪 Testing Create Market...")
    payload = {
        "market_id": "python-test-001",
        "title": "Python Test Market",
        "description": "Testing from Python",
        "category": "crypto",
        "event_date": 1735689600
    }
    response = requests.post(
        f"{BASE_URL}/api/markets",
        json=payload
    )
    data = response.json()
    print(f"✅ Success: {data['success']}")
    print(f"✅ TX Hash: {data['txHash'][:20]}...")
    print(f"✅ Block: {data['blockNumber']}")
    print()
    return data['market_id']

def test_place_stake(market_id):
    print("🧪 Testing Place Stake...")
    payload = {
        "user_id": "python-user",
        "amount": 500,
        "prediction": True
    }
    response = requests.post(
        f"{BASE_URL}/api/markets/{market_id}/stake",
        json=payload
    )
    data = response.json()
    print(f"✅ Success: {data['success']}")
    print(f"✅ TX Hash: {data['txHash'][:20]}...")
    print()

def test_query_markets():
    print("🧪 Testing Query Markets...")
    response = requests.get(f"{BASE_URL}/api/markets")
    data = response.json()
    print(f"✅ Source: {data['source']}")
    print(f"✅ Markets: {len(data['markets'])}")
    print()

if __name__ == "__main__":
    print("=" * 50)
    print("🎉 AION Onchain Testing")
    print("=" * 50)
    print()
    
    test_health()
    test_blockchain_info()
    market_id = test_create_market()
    test_place_stake(market_id)
    test_query_markets()
    
    print("=" * 50)
    print("✅ All Tests Completed!")
    print("=" * 50)
```

Jalankan:
```bash
python3 test_aion.py
```

---

### 5️⃣ Test dengan Postman

#### A. Import Collection

Buat Postman collection dengan endpoints:

1. **Health Check**
   - Method: GET
   - URL: `http://localhost:8001/`

2. **Blockchain Info**
   - Method: GET
   - URL: `http://localhost:8001/api/blockchain/info`

3. **Create Market**
   - Method: POST
   - URL: `http://localhost:8001/api/markets`
   - Body (JSON):
   ```json
   {
     "market_id": "postman-test-001",
     "title": "Postman Test",
     "description": "Testing from Postman",
     "category": "crypto",
     "event_date": 1735689600
   }
   ```

4. **Place Stake**
   - Method: POST
   - URL: `http://localhost:8001/api/markets/postman-test-001/stake`
   - Body (JSON):
   ```json
   {
     "user_id": "postman-user",
     "amount": 1000,
     "prediction": true
   }
   ```

5. **Query Markets**
   - Method: GET
   - URL: `http://localhost:8001/api/markets`

#### B. Run Collection
Klik "Run Collection" dan lihat hasilnya.

---

### 6️⃣ Test Scenario Lengkap

#### Scenario: Create Market → Stake → Query

```bash
# 1. Create market
curl -X POST http://localhost:8001/api/markets \
  -H "Content-Type: application/json" \
  -d '{
    "market_id": "btc-100k-2025",
    "title": "Bitcoin $100K in 2025?",
    "description": "Will Bitcoin reach $100,000 in 2025?",
    "category": "crypto",
    "event_date": 1735689600
  }'

# 2. Place stake YES
curl -X POST http://localhost:8001/api/markets/btc-100k-2025/stake \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "alice",
    "amount": 1000,
    "prediction": true
  }'

# 3. Place stake NO
curl -X POST http://localhost:8001/api/markets/btc-100k-2025/stake \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "bob",
    "amount": 500,
    "prediction": false
  }'

# 4. Query market
curl http://localhost:8001/api/markets/btc-100k-2025

# 5. Query all markets
curl http://localhost:8001/api/markets

# 6. Get stats
curl http://localhost:8001/api/stats
```

---

### 7️⃣ Checklist Testing

Centang setiap test yang berhasil:

#### Backend API
- [ ] Health check returns "operational"
- [ ] Blockchain info shows Chain ID
- [ ] Create market returns txHash
- [ ] Create market returns blockNumber
- [ ] Place stake returns success
- [ ] Query markets returns blockchain source
- [ ] Stats endpoint working

#### Frontend
- [ ] Page loads without errors
- [ ] Console shows no breaking errors
- [ ] Dashboard displays
- [ ] Marketplace displays
- [ ] Can navigate between pages
- [ ] Icons load properly

#### Blockchain Features
- [ ] Transaction hashes generated (0x...)
- [ ] Block numbers assigned (1000000+)
- [ ] Chain ID tracked
- [ ] All operations return blockchain metadata

---

### 8️⃣ Expected Results

#### ✅ Success Indicators

1. **API Health:** Status "operational"
2. **Create Market:** Returns `txHash` and `blockNumber`
3. **Place Stake:** Returns `success: true`
4. **Query Markets:** Returns `source: "blockchain"`
5. **Frontend:** No console errors
6. **All Endpoints:** Return 200 status code

#### ❌ Common Issues

**Port already in use:**
```bash
lsof -ti:8001 | xargs kill -9
lsof -ti:8080 | xargs kill -9
```

**Backend not responding:**
```bash
cd backend
source venv/bin/activate
uvicorn server_onchain:app --reload --port 8001
```

**Frontend not loading:**
```bash
cd "AION LINERA"
python3 -m http.server 8080
```

---

### 9️⃣ Advanced Testing

#### Load Testing
```bash
# Install Apache Bench
brew install httpd  # macOS

# Test 100 requests
ab -n 100 -c 10 http://localhost:8001/
```

#### Stress Testing
```bash
# Create multiple markets
for i in {1..10}; do
  curl -X POST http://localhost:8001/api/markets \
    -H "Content-Type: application/json" \
    -d "{
      \"market_id\": \"stress-test-$i\",
      \"title\": \"Stress Test $i\",
      \"description\": \"Testing\",
      \"category\": \"crypto\",
      \"event_date\": 1735689600
    }"
done
```

---

### 🔟 Monitoring

#### Check Backend Logs
```bash
# Terminal dengan backend running akan show logs
# Lihat untuk:
# - INFO: Request received
# - INFO: Transaction created
# - ERROR: (harusnya tidak ada)
```

#### Check Frontend Console
```bash
# Browser Console (F12)
# Lihat untuk:
# - ✅ Dependencies loaded
# - ⚠️ Warnings (non-critical)
# - ❌ Errors (investigate)
```

---

## 📊 Test Report Template

```
AION Onchain Testing Report
===========================

Date: [DATE]
Tester: [NAME]

Backend Tests:
✅ Health Check
✅ Blockchain Info
✅ Create Market
✅ Place Stake
✅ Query Markets
✅ Platform Stats

Frontend Tests:
✅ Page Load
✅ Console Clean
✅ Navigation
✅ UI Display

Blockchain Tests:
✅ TX Hash Generation
✅ Block Numbers
✅ Chain ID Tracking

Issues Found:
- None

Conclusion:
All tests passed. Application ready for deployment.
```

---

## 🎯 Quick Test Commands

```bash
# One-liner test all endpoints
curl http://localhost:8001/ && \
curl http://localhost:8001/api/blockchain/info && \
curl -X POST http://localhost:8001/api/markets \
  -H "Content-Type: application/json" \
  -d '{"market_id":"quick-test","title":"Quick Test","description":"Test","category":"crypto","event_date":1735689600}' && \
curl http://localhost:8001/api/markets

# If all return valid JSON, tests passed! ✅
```

---

## 📝 Summary

**Cara Tercepat:**
1. Buka http://localhost:8001/docs
2. Test semua endpoint dari browser
3. Buka http://localhost:8080
4. Cek console (F12) - harusnya no errors

**Cara Lengkap:**
1. Run Python test script
2. Test dengan curl commands
3. Test frontend UI
4. Check logs

**Semua test harusnya PASS! ✅**
