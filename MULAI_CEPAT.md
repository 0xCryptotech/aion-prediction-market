# ⚡ Mulai Cepat - AION Local

## 🎯 Cara Tercepat Menjalankan AION

### 1️⃣ Install Prerequisites (Sekali Saja)

**Python 3.10+**
```bash
# Download dari https://python.org
# Atau pakai Homebrew (macOS):
brew install python@3.10
```

**Node.js 18+**
```bash
# Download dari https://nodejs.org
# Atau pakai Homebrew (macOS):
brew install node
```

**MongoDB**
```bash
# Download dari https://mongodb.com
# Atau pakai Homebrew (macOS):
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### 2️⃣ Setup Project (Sekali Saja)

```bash
# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..

# Setup environment
cp .env.example backend/.env
```

### 3️⃣ Jalankan Aplikasi

**Cara 1: Pakai Script Otomatis (Recommended)**

macOS/Linux:
```bash
./start-local.sh
```

Windows:
```bash
start-local.bat
```

**Cara 2: Manual (2 Terminal)**

Terminal 1 - Backend:
```bash
cd backend
uvicorn server:app --reload --port 8001
```

Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

### 4️⃣ Buka Browser

Frontend: http://localhost:3000
Backend API: http://localhost:8001/docs

## ✅ Checklist Sebelum Mulai

- [ ] Python 3.10+ installed
- [ ] Node.js 18+ installed
- [ ] MongoDB running
- [ ] Dependencies installed (pip & npm)
- [ ] File backend/.env exists

## 🔥 Quick Commands

```bash
# Check Python version
python --version

# Check Node version
node --version

# Check MongoDB status
mongod --version

# Install backend deps
cd backend && pip install -r requirements.txt

# Install frontend deps
cd frontend && npm install

# Start backend only
cd backend && uvicorn server:app --reload --port 8001

# Start frontend only
cd frontend && npm start
```

## 🐛 Masalah Umum

**MongoDB tidak running**
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Port sudah dipakai**
```bash
# Kill process di port 8001
lsof -i :8001
kill -9 <PID>

# Kill process di port 3000
lsof -i :3000
kill -9 <PID>
```

**Dependencies error**
```bash
# Reinstall backend
cd backend
pip install -r requirements.txt --force-reinstall

# Reinstall frontend
cd frontend
rm -rf node_modules
npm install
```

## 📱 Test Fitur

1. **Dashboard** - http://localhost:3000
2. **Marketplace** - Klik "Marketplace" di navbar
3. **AI Models** - Klik "AI Models" di navbar
4. **DAO** - Klik "DAO" di navbar
5. **Wallet** - Klik "Connect Wallet" (perlu MetaMask)

## 🎓 Next Steps

Setelah aplikasi running:
- Explore dashboard dan lihat statistics
- Browse prediction markets
- Check AI models leaderboard
- Test wallet connection dengan MetaMask
- Vote pada DAO proposals

## 📚 Dokumentasi Lengkap

- [PANDUAN_LOKAL.md](PANDUAN_LOKAL.md) - Panduan detail
- [README.md](README.md) - Full documentation
- [TESTING.md](TESTING.md) - Testing guide

## 💡 Tips Pro

1. Gunakan MongoDB Compass untuk GUI database
2. Check browser console untuk debug frontend
3. Check terminal logs untuk debug backend
4. Gunakan API docs di /docs untuk test endpoints
5. Install React DevTools untuk debug React

---

**Butuh bantuan?** Buka issue di GitHub atau lihat dokumentasi lengkap.
