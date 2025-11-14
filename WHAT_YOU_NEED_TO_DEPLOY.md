# 🚀 Yang Dibutuhkan untuk Deploy AION

## TL;DR - Super Ringkas

### 1. Install Tools (5 menit)
```bash
# Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Linera CLI
cargo install linera-cli

# WASM target
rustup target add wasm32-unknown-unknown
```

### 2. Deploy (1 command)
```bash
./deploy.sh
```

### 3. Done! 🎉

---

## Penjelasan Lengkap

### 📦 Tools yang Dibutuhkan

| Tool | Fungsi | Install |
|------|--------|---------|
| **Rust** | Compile smart contract | `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \| sh` |
| **Linera CLI** | Deploy ke blockchain | `cargo install linera-cli` |
| **WASM Target** | Build ke WebAssembly | `rustup target add wasm32-unknown-unknown` |
| **MongoDB** | Database backend | Sudah running ✅ |
| **Python 3.10+** | Backend server | Sudah ada ✅ |
| **Node.js** | Frontend (optional) | Sudah ada ✅ |

### ⏱️ Estimasi Waktu

- **Install tools**: 5-10 menit
- **Build contract**: 2-3 menit
- **Deploy**: 1-2 menit
- **Configure**: 1 menit (otomatis via script)
- **Test**: 2-3 menit

**Total**: ~15-20 menit untuk first deployment

---

## 🎯 Deployment Flow

```
1. Install Tools
   ↓
2. Build Smart Contract (Rust → WASM)
   ↓
3. Start Linera Network (local atau testnet)
   ↓
4. Create Main Chain (untuk governance)
   ↓
5. Deploy Application ke Chain
   ↓
6. Get Chain ID & App ID
   ↓
7. Update Backend .env
   ↓
8. Update Frontend config
   ↓
9. Test API & Frontend
   ↓
10. Done! 🎉
```

---

## 🤖 Automated vs Manual

### Option A: Automated (Recommended) ⚡
```bash
# 1 command, semua otomatis
./deploy.sh
```

**Pros**:
- ✅ Cepat (5 menit)
- ✅ Tidak ada human error
- ✅ Auto-configure semua
- ✅ Save deployment info

**Cons**:
- ❌ Less control
- ❌ Perlu understand script

### Option B: Manual 🔧
```bash
# Step by step
cd linera
cargo build --release --target wasm32-unknown-unknown
linera create-chain
linera publish-and-create ...
# dst...
```

**Pros**:
- ✅ Full control
- ✅ Understand setiap step
- ✅ Easy to debug

**Cons**:
- ❌ Lebih lama (15-20 menit)
- ❌ Prone to typos
- ❌ Manual configuration

---

## 📋 Yang Akan Didapat Setelah Deploy

### 1. Chain IDs
```
Main Chain ID: e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65
Main App ID: e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65000000000000000000000000
```

### 2. Updated Configuration
- ✅ `backend/.env` - Chain IDs configured
- ✅ `AION LINERA/linera-config.js` - Frontend configured
- ✅ `deployment-info.txt` - Deployment details saved

### 3. Working System
- ✅ Smart contract deployed on Linera
- ✅ Backend can call contract
- ✅ Frontend can interact
- ✅ Hybrid chain strategy active

---

## 🧪 How to Test After Deploy

### 1. Test Backend API
```bash
# Get config
curl http://localhost:8001/api/linera/config

# Create test market
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

# View chains
curl http://localhost:8001/api/linera/chains
```

### 2. Test Frontend
```bash
open "AION LINERA/index.html"
```

Check:
- ✅ Page loads
- ✅ No console errors
- ✅ Markets display
- ✅ Wallet can connect

### 3. Test Linera Directly
```bash
# Query state
linera client query \
  --chain-id <MAIN_CHAIN_ID> \
  --application-id <MAIN_APP_ID>

# Check chain
linera client show-chain <MAIN_CHAIN_ID>
```

---

## 🌍 Production Deployment

### Backend Options

| Platform | Difficulty | Cost | Speed |
|----------|-----------|------|-------|
| **Railway** | Easy | Free tier | Fast |
| **Render** | Easy | Free tier | Medium |
| **Heroku** | Medium | Paid | Fast |
| **VPS** | Hard | $5-20/mo | Fast |

### Frontend Options

| Platform | Difficulty | Cost | Speed |
|----------|-----------|------|-------|
| **Vercel** | Very Easy | Free | Very Fast |
| **Netlify** | Very Easy | Free | Very Fast |
| **GitHub Pages** | Easy | Free | Medium |

---

## 💰 Cost Breakdown

### Development (Local)
- **Tools**: Free
- **Linera Local**: Free
- **MongoDB**: Free (local)
- **Total**: $0

### Testnet
- **Linera Testnet**: Free
- **Backend**: Free tier (Railway/Render)
- **Frontend**: Free (Vercel/Netlify)
- **Total**: $0

### Production (Mainnet)
- **Linera Mainnet**: Gas fees (very low)
- **Backend**: $5-20/month
- **Frontend**: Free or $20/month
- **MongoDB Atlas**: $0-57/month
- **Total**: ~$5-100/month

---

## 🆘 Common Issues & Solutions

### "Linera CLI not found"
```bash
# Add to PATH
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### "WASM build failed"
```bash
# Install target
rustup target add wasm32-unknown-unknown

# Clean and rebuild
cd linera
cargo clean
cargo build --release --target wasm32-unknown-unknown
```

### "Chain creation failed"
```bash
# Check Linera is running
linera service

# Check wallet
linera wallet show
```

### "Backend can't connect"
```bash
# Check .env file
cat backend/.env | grep LINERA

# Verify chain exists
linera client show-chain <CHAIN_ID>
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `DEPLOYMENT_GUIDE.md` | Complete deployment guide |
| `DEPLOYMENT_CHECKLIST.md` | Step-by-step checklist |
| `QUICK_START_HYBRID_CHAIN.md` | Quick reference |
| `HYBRID_CHAIN_IMPLEMENTATION.md` | Implementation details |
| `docs/HYBRID_CHAIN_STRATEGY.md` | Technical documentation |
| `deploy.sh` | Automated deployment script |

---

## 🎯 Next Steps After Deploy

1. **Test Everything**
   - Create markets
   - Test staking
   - Verify chain allocation
   - Check hybrid strategy

2. **Monitor**
   - Backend logs
   - Linera node status
   - Chain health
   - API usage

3. **Optimize**
   - Adjust thresholds
   - Monitor performance
   - Scale as needed

4. **Production**
   - Deploy to hosting
   - Setup monitoring
   - Configure backups
   - Update documentation

---

## ✅ Quick Checklist

Before deploying, make sure:
- [ ] Rust installed
- [ ] Linera CLI installed
- [ ] WASM target added
- [ ] MongoDB running
- [ ] Backend .env exists
- [ ] Ready to deploy!

Then just run:
```bash
./deploy.sh
```

---

## 🎉 Summary

**Yang dibutuhkan**:
1. ⚙️ Tools (Rust, Linera CLI, WASM)
2. 🏗️ Build contract
3. 🚀 Deploy ke Linera
4. ⚙️ Configure backend & frontend
5. 🧪 Test

**Waktu**: ~15-20 menit  
**Biaya**: $0 (development/testnet)  
**Difficulty**: Medium (Easy dengan script)

**Ready to deploy?** Run `./deploy.sh` 🚀
