# 🚀 Deploy Linera Smart Contract - Options

## ⏱️ Estimasi Waktu

| Method | Time | Difficulty | Status |
|--------|------|------------|--------|
| **Build from Source** | 10-15 min | Medium | ⚠️ Requires compilation |
| **Docker** | 2-3 min | Easy | ✅ Fastest |
| **Pre-built Binary** | 1 min | Easy | ❌ Not available yet |
| **Linera Testnet** | 5 min | Easy | ⚠️ Need testnet access |

---

## 🎯 Recommended: Docker Method (Fastest)

### Step 1: Install Docker (if not installed)
```bash
# Check if Docker installed
docker --version

# If not, install from: https://www.docker.com/products/docker-desktop
```

### Step 2: Pull Linera Docker Image
```bash
docker pull ghcr.io/linera-io/linera:latest
```

### Step 3: Create Linera Alias
```bash
# Add to ~/.zshrc
alias linera='docker run --rm -v $(pwd):/workspace -w /workspace ghcr.io/linera-io/linera:latest linera'

# Reload
source ~/.zshrc

# Test
linera --version
```

### Step 4: Initialize Wallet
```bash
linera wallet init --with-new-chain
```

### Step 5: Build WASM Contract
```bash
cd linera
cargo build --release --target wasm32-unknown-unknown
```

### Step 6: Deploy Contract
```bash
# Get your chain ID
linera wallet show

# Deploy
linera publish-and-create \
  --bytecode-path target/wasm32-unknown-unknown/release/aion_prediction_market.wasm
```

---

## 🔧 Alternative: Build from Source

### Pros:
- ✅ Native performance
- ✅ No Docker dependency
- ✅ Full control

### Cons:
- ❌ Takes 10-15 minutes to compile
- ❌ Requires Rust toolchain
- ❌ Large disk space (~2GB)

### Steps:
```bash
# Run installation script
./install-linera.sh

# Add to PATH
export PATH="$(pwd)/linera-protocol/target/release:$PATH"

# Verify
linera --version
```

---

## ⚡ Quick Deploy Script

Saya akan buatkan script yang otomatis handle deployment:

```bash
./deploy-linera-contract.sh
```

Script ini akan:
1. ✅ Check prerequisites
2. ✅ Build WASM contract
3. ✅ Initialize wallet (if needed)
4. ✅ Deploy to testnet
5. ✅ Extract Chain ID & App ID
6. ✅ Update .env files automatically
7. ✅ Verify deployment

---

## 🎯 Current Status Check

### Prerequisites:
- [x] Rust installed (1.90.0)
- [x] Cargo installed
- [ ] Linera CLI installed
- [ ] Docker installed (optional)
- [x] WASM target (wasm32-unknown-unknown)

### Smart Contract:
- [x] Contract code complete (`linera/src/lib.rs`)
- [x] Tests written (`linera/src/tests.rs`)
- [x] Cargo.toml configured
- [ ] WASM binary built
- [ ] Deployed to chain

---

## 🚀 Fastest Path to Deploy (NOW)

### Option A: Use Docker (2-3 minutes)
```bash
# 1. Check Docker
docker --version

# 2. If Docker installed, run:
./deploy-with-docker.sh
```

### Option B: Build from Source (10-15 minutes)
```bash
# 1. Install Linera CLI
./install-linera.sh

# 2. Deploy contract
./deploy-linera-contract.sh
```

### Option C: Mock Deployment (Instant)
```bash
# Use mock mode for now
# Deploy to real Linera later
# All features work with mock
```

---

## 💡 Recommendation

**For immediate testing:**
→ Continue with **Mock Mode** (already working)

**For production:**
→ Use **Docker method** (fastest, easiest)

**For development:**
→ **Build from source** (best for iteration)

---

## 🎯 What Do You Want to Do?

### 1. Deploy NOW with Docker (Fast)
```bash
# I'll create the Docker deployment script
# Takes 2-3 minutes
# Requires Docker installed
```

### 2. Build from Source (Slower but Native)
```bash
# Run: ./install-linera.sh
# Takes 10-15 minutes
# No Docker needed
```

### 3. Continue with Mock Mode (Instant)
```bash
# Keep using current setup
# Deploy to Linera later
# All features work
```

---

**Which option do you prefer?** 🤔

1️⃣ Docker (fast, need Docker)
2️⃣ Build from source (slow, native)
3️⃣ Mock mode (instant, no blockchain)
