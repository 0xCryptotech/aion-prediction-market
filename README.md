# AION - Decentralized AI Prediction Market

![AION Logo](https://via.placeholder.com/150x150?text=AION)

AION adalah platform prediction market terdesentralisasi yang ditenagai AI, dibangun di atas blockchain Linera dengan arsitektur microchain untuk throughput tinggi dan gas fee yang sangat rendah.

## 🎯 Fitur Utama

### 1. **🤖 Live AI Predictions** ⭐ NEW
- Prediksi real-time dari 3 AI models (GPT-4 Oracle, Claude Predictor, Llama Vision)
- Sentiment analysis (Bullish/Bearish)
- Confidence scores dengan color coding
- Auto-update setiap 10 detik
- Animasi smooth saat update

### 2. **📊 Live Price Feed (Pyth Network)** ⭐ NEW
- Real-time crypto prices dari Pyth Network
- BTC/USD, ETH/USD, SOL/USD price feeds
- Price change percentage dengan trend indicators
- Auto-update setiap 5 detik
- Powered by Pyth Hermes API

### 3. **Prediction Marketplace**
- Browse dan filter prediksi berdasarkan kategori (Finance, Esports, Climate, Politics, Technology)
- Lihat detail prediksi lengkap dengan AI model, confidence score, dan total stake
- Stake AION tokens pada prediksi aktif
- Real-time status tracking (Active, Resolved, Disputed)

### 4. **AI Models Leaderboard**
- Ranking AI forecasters berdasarkan reputation score
- Metrik performa: accuracy rate, total predictions, earnings
- Badge sistem (Elite, Master, Expert, Advanced, Intermediate)
- Top 3 podium display

### 5. **Connect Wallet Integration**
- MetaMask wallet connection
- Display AION balance dan staked amount
- Real-time wallet info (address, ETH balance, earned rewards)
- Secure disconnect functionality

### 6. **DAO Governance**
- Community-driven proposal system
- Vote untuk/melawan proposals
- Real-time voting progress dengan visualisasi
- Proposal status tracking (Active, Passed, Rejected)

### 7. **Dashboard Analytics**
- Platform statistics (TVL, Active Predictions, Accuracy Rate, Total Users)
- Interactive charts (Prediction Activity, Market Categories)
- Recent predictions dan top AI models
- Responsive design untuk semua devices

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Recharts** - Data visualization
- **Ethers.js** - Ethereum wallet integration
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **FastAPI** - Modern Python web framework
- **MongoDB** - NoSQL database
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation
- **Python 3.10+**

### Blockchain
- **Linera** - Microchain blockchain platform
- **Rust** - Smart contract language
- **BCS** - Binary Canonical Serialization

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- MongoDB
- Rust 1.70+ (untuk Linera)
- MetaMask browser extension (untuk wallet features)

### Installation

1. **Clone repository**
```bash
git clone <your-repo-url>
cd aion-prediction-market
```

2. **Setup Environment**
```bash
# Copy template
copy .env.example backend\.env

# Edit backend\.env
MONGO_URL=mongodb://localhost:27017
DB_NAME=aion_db
API_KEY=your-secret-key
```

3. **Install Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

4. **Run Application**
```bash
# Start MongoDB
mongod

# Start Backend
cd backend
uvicorn server:app --reload --port 8001

# Open Frontend
# Buka file: aion-static\index.html di browser
```

## 📦 Deployment

### Deploy Frontend ke Vercel

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Navigate ke frontend directory**
```bash
cd frontend
```

3. **Deploy**
```bash
vercel
```

4. **Configure Environment Variables di Vercel Dashboard**
- `REACT_APP_BACKEND_URL` = URL backend API Anda

5. **Production deployment**
```bash
vercel --prod
```

### Deploy Backend (Pilihan)

**Railway:**
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Connect GitHub repository
4. Select `backend` directory
5. Add environment variables:
   - `MONGO_URL`
   - `DB_NAME`
   - `CORS_ORIGINS`
6. Deploy!

**Render:**
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Select Python environment
5. Build command: `pip install -r requirements.txt`
6. Start command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
7. Add environment variables

**Heroku:**
```bash
cd backend
heroku create aion-api
heroku addons:create mongolab:sandbox
git push heroku main
```

## 📚 API Endpoints

### Predictions
- `GET /api/predictions` - Get all predictions
- `GET /api/predictions?status=active` - Filter by status
- `GET /api/predictions?category=Finance` - Filter by category
- `GET /api/predictions/{id}` - Get prediction details
- `POST /api/predictions/{id}/stake` - Stake on prediction

### AI Models
- `GET /api/ai-models` - Get all AI models
- `GET /api/ai-models/{id}` - Get AI model details

### DAO Governance
- `GET /api/dao-proposals` - Get all proposals
- `POST /api/dao-proposals/{id}/vote` - Vote on proposal

### Wallet
- `GET /api/wallet/{address}/balance` - Get wallet balance

### Statistics
- `GET /api/statistics` - Get platform statistics

### Linera Integration
- `POST /api/linera/market` - Create market (requires API key)
- `POST /api/linera/stake` - Stake on Linera
- `GET /api/linera/state` - Query Linera state
- `POST /api/linera/resolve/{id}` - Resolve market (requires API key)

## 👥 Wallet Integration

### MetaMask Setup
1. Install MetaMask browser extension
2. Create atau import wallet
3. Click "Connect Wallet" button di aplikasi
4. Approve connection di MetaMask
5. Wallet address dan balance akan ditampilkan

### Supported Actions
- View AION balance
- Stake on predictions
- Vote on DAO proposals
- Track earned rewards

## 📋 Environment Variables

### Frontend (.env)
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

### Backend (.env)
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=aion_db
CORS_ORIGINS=http://localhost:3000,https://your-vercel-app.vercel.app
```

## 🛡️ Security Notes

- Wallet connections are handled securely via Ethers.js
- Private keys never leave user's browser
- API calls require wallet signature untuk sensitive operations
- CORS properly configured untuk production

## 📊 Data Structure

### Prediction Model
```python
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "category": "Finance|Esports|Climate|Politics|Technology",
  "event_date": "datetime",
  "status": "active|resolved|disputed",
  "total_stake": float,
  "ai_model_id": "uuid",
  "prediction_value": "string",
  "confidence_score": float,
  "verification_status": "pending|verified|failed"
}
```

### AI Model
```python
{
  "id": "uuid",
  "name": "string",
  "model_type": "string",
  "reputation_score": float,
  "accuracy_rate": float,
  "total_predictions": int,
  "total_staked": float,
  "total_earned": float,
  "rank": int
}
```

## 🧪 Testing

Lihat [TESTING.md](TESTING.md) untuk panduan lengkap.

**Quick Test:**
```bash
# 1. Start MongoDB
mongod

# 2. Start Backend
cd backend
uvicorn server:app --reload --port 8001

# 3. Buka browser
aion-static\index.html
```

**Full Test dengan Linera:**
```bash
# Setup Linera
scripts\setup_linera.bat

# Deploy lokal
scripts\deploy_local.bat

# Run tests
scripts\test_all.bat
```

## 🔧 Development

### Project Structure
```
aion-prediction-market/
├── backend/
│   ├── server.py           # Main FastAPI app
│   ├── linera_adapter.py   # Linera integration
│   ├── indexer.py          # State synchronization
│   ├── requirements.txt    # Python dependencies
│   └── tests/              # Unit tests
├── linera/
│   ├── src/lib.rs          # Smart contract
│   ├── Cargo.toml          # Rust dependencies
│   └── tests/              # Contract tests
├── scripts/
│   ├── aion_cli.py         # CLI tool
│   ├── deploy_local.bat    # Local deployment
│   ├── setup_linera.bat    # Linera setup
│   └── test_all.bat        # Test runner
├── docs/
│   ├── LINERA_INTEGRATION.md
│   ├── QUICK_START.md
│   └── bcs_schema.md
├── aion-static/            # Frontend (HTML)
└── README.md
```

### Adding New Features

1. **Backend**: Add new endpoints di `server.py`
2. **Frontend**: Create new pages di `src/pages/`
3. **Components**: Add reusable components di `src/components/`
4. **Routes**: Update routes di `App.js`

## 🐛 Troubleshooting

### Backend tidak running
- Pastikan MongoDB running: `mongod`
- Check port 8001 tidak dipakai
- Verify `.env` file exists di `backend/`

### Wallet connection gagal
- Install MetaMask extension
- Refresh halaman setelah install MetaMask
- Check browser console untuk errors

### Linera CLI not found
- Install: `cargo install linera-cli`
- Add to PATH
- Verify: `linera --version`

### Database connection error
- Pastikan MongoDB running
- Check `MONGO_URL` di backend `.env`
- Verify database credentials

## 🚀 Roadmap

### Phase 1 - MVP ✅
- [x] Basic prediction marketplace
- [x] AI models leaderboard
- [x] Wallet integration (MetaMask)
- [x] DAO governance system
- [x] Dashboard analytics

### Phase 2 - Alpha (In Progress) 🔄
- [x] Linera smart contract structure
- [x] Backend Linera adapter
- [x] Indexer for state sync
- [x] CLI tools
- [x] Testing infrastructure
- [ ] Full contract implementation
- [ ] Testnet deployment
- [ ] Atoma AI inference
- [ ] Real oracle verification

### Phase 3 - Beta
- [ ] Fusion Hub meta-learning
- [ ] Dispute resolution mechanism
- [ ] Advanced analytics
- [ ] Mobile app

### Phase 4 - Mainnet
- [ ] Security audit
- [ ] Multi-microchain deployment
- [ ] Full decentralization
- [ ] Token launch

## 📖 Documentation

- [TESTING.md](TESTING.md) - Testing guide
- [QUICK_START.md](docs/QUICK_START.md) - Quick start guide
- [LINERA_INTEGRATION.md](docs/LINERA_INTEGRATION.md) - Linera integration
- [CHECKLIST_STATUS.md](CHECKLIST_STATUS.md) - Development progress
- [bcs_schema.md](docs/bcs_schema.md) - BCS schema documentation

## 💬 Support

Untuk pertanyaan dan support:
- GitHub Issues: [Create an issue](https://github.com/0xCryptotech/aion-prediction-market/issues)
- GitHub Repo: [aion-prediction-market](https://github.com/0xCryptotech/aion-prediction-market)

## 📝 License

MIT License - lihat [LICENSE](LICENSE) file untuk details.

## 👏 Contributors

Built with ❤️ by the AION team.

---

**Note**: Project ini sedang dalam development aktif. Linera integration (68% complete). Lihat [CHECKLIST_STATUS.md](CHECKLIST_STATUS.md) untuk progress terkini.