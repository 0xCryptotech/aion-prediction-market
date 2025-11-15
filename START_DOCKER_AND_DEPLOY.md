# 🐳 Start Docker & Deploy Linera

## ⚠️ Docker Daemon Not Running

Docker Desktop perlu di-start terlebih dahulu.

## 🚀 Steps to Deploy:

### 1. Start Docker Desktop

**Manual:**
- Buka **Docker Desktop** dari Applications
- Tunggu sampai Docker icon di menu bar menunjukkan "Docker Desktop is running"
- Biasanya butuh 30-60 detik

**Via Command:**
```bash
open -a Docker
```

### 2. Wait for Docker to Start

Check status dengan:
```bash
docker ps
```

Jika berhasil, akan muncul list containers (bisa kosong).
Jika error "Cannot connect to Docker daemon", tunggu sebentar lagi.

### 3. Run Deployment Script

Setelah Docker running:
```bash
./deploy-linera-docker.sh
```

---

## 🔄 Alternative: Build from Source (No Docker)

Jika Docker bermasalah, bisa build Linera CLI dari source:

```bash
# Install Linera CLI (takes 10-15 minutes)
./install-linera.sh

# Then deploy
linera wallet init --with-new-chain
cd linera
cargo build --release --target wasm32-unknown-unknown
linera publish-and-create \
  --bytecode-path target/wasm32-unknown-unknown/release/aion_prediction_market.wasm
```

---

## 📝 Current Status

- ✅ Docker installed
- ❌ Docker daemon not running
- ✅ Deployment script ready
- ✅ Smart contract ready

**Next:** Start Docker Desktop, then run `./deploy-linera-docker.sh`

---

## 💡 Quick Commands

```bash
# Check Docker status
docker ps

# Start Docker Desktop
open -a Docker

# Wait 30 seconds, then deploy
sleep 30 && ./deploy-linera-docker.sh
```
