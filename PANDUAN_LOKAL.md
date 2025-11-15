# 🚀 Panduan Menjalankan AION di Local

## Prasyarat yang Harus Diinstall

1. **Python 3.10+** - Download dari https://python.org
2. **Node.js 18+** - Download dari https://nodejs.org  
3. **MongoDB** - Download dari https://mongodb.com/try/download/community
4. **Git** - Download dari https://git-scm.com

## Langkah 1: Clone Repository

```bash
git clone https://github.com/0xCryptotech/aion-prediction-market
cd aion-prediction-market
```

## Langkah 2: Setup MongoDB

### Opsi A: MongoDB Local
```bash
# Install MongoDB Community Edition
# Jalankan MongoDB service
mongod
```

### Opsi B: MongoDB Atlas (Cloud - Gratis)
1. Buat akun di https://mongodb.com/cloud/atlas
2. Buat cluster gratis
3. Dapatkan connection string
4. Gunakan connection string di file .env

## Langkah 3: Setup Backend

```bash
# Masuk ke folder backend
cd backend

# Install dependencies Python
pip install -r requirements.txt

# Buat file .env dari template
cp ../.env.example .env

# Edit file .env (gunakan text editor)
# Minimal yang perlu diubah:
# MONGODB_URL=mongodb://localhost:27017
# DB_NAME=aion_db
```

## Langkah 4: Setup Frontend

```bash
# Masuk ke folder frontend (dari root project)
cd frontend

# Install dependencies Node.js
npm install
# atau jika pakai yarn:
yarn install
```

## Langkah 5: Jalankan Aplikasi

### Terminal 1 - Backend
```bash
cd backend
uvicorn server:app --reload --port 8001
```

Backend akan berjalan di: http://localhost:8001
API Docs: http://localhost:8001/docs

### Terminal 2 - Frontend
```bash
cd frontend
npm start
# atau:
yarn start
```

Frontend akan berjalan di: http://localhost:3000

## Langkah 6: Buka Aplikasi

Buka browser dan akses: **http://localhost:3000**

## 🎯 Fitur yang Bisa Dicoba

1. **Dashboard** - Lihat statistik platform
2. **Marketplace** - Browse prediction markets
3. **AI Models** - Lihat leaderboard AI forecasters
4. **DAO Governance** - Vote pada proposals
5. **Connect Wallet** - Hubungkan MetaMask wallet

## 🔧 Troubleshooting

### Backend tidak bisa start
```bash
# Pastikan MongoDB running
mongod

# Check port 8001 tidak dipakai
lsof -i :8001

# Install ulang dependencies
pip install -r requirements.txt --force-reinstall
```

### Frontend tidak bisa start
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules
npm install

# Clear cache
npm cache clean --force
```

### MongoDB connection error
- Pastikan MongoDB service running
- Check connection string di backend/.env
- Untuk MongoDB Atlas, pastikan IP address di-whitelist

### Port sudah dipakai
```bash
# Ganti port backend di backend/.env
BACKEND_PORT=8002

# Jalankan dengan port baru
uvicorn server:app --reload --port 8002

# Update REACT_APP_BACKEND_URL di frontend
REACT_APP_BACKEND_URL=http://localhost:8002
```

## 📱 Testing dengan MetaMask

1. Install MetaMask extension di browser
2. Buat atau import wallet
3. Klik "Connect Wallet" di aplikasi
4. Approve connection di MetaMask
5. Wallet balance akan muncul

## 🛠️ Development Tools

### Backend API Documentation
http://localhost:8001/docs - Swagger UI interaktif

### Database GUI (Optional)
- MongoDB Compass - https://mongodb.com/products/compass
- Robo 3T - https://robomongo.org

## 📊 Struktur Project

```
aion-prediction-market/
├── backend/              # FastAPI backend
│   ├── server.py        # Main API server
│   ├── requirements.txt # Python dependencies
│   └── .env            # Environment variables
├── frontend/            # React frontend
│   ├── src/            # Source code
│   ├── public/         # Static files
│   └── package.json    # Node dependencies
└── AION LINERA/        # Static HTML version (alternative)
```

## 🚀 Next Steps

Setelah aplikasi berjalan:
1. Explore semua fitur di dashboard
2. Test wallet connection dengan MetaMask
3. Coba create prediction di marketplace
4. Vote pada DAO proposals
5. Lihat AI models leaderboard

## 💡 Tips

- Gunakan 2 terminal terpisah untuk backend dan frontend
- Backend harus running sebelum frontend
- MongoDB harus running sebelum backend
- Check console browser untuk error messages
- Check terminal untuk server logs

## 📞 Butuh Bantuan?

- GitHub Issues: https://github.com/0xCryptotech/aion-prediction-market/issues
- Documentation: Lihat file README.md untuk detail lengkap
