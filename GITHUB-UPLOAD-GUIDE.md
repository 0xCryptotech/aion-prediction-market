# Upload AION ke GitHub Repository

## Manual Upload Steps

### 1. Buat Repository Baru
- Go to https://github.com/0xCryptotech
- Click "New repository"
- Name: `aion-prediction-market`
- Description: `Decentralized AI Prediction Market on Linera`
- Set to Public
- Don't initialize with README (sudah ada)

### 2. Upload Files
**Option A - GitHub Web Interface:**
- Click "uploading an existing file"
- Drag semua folder/files dari d:\AION
- Commit message: "Initial AION prediction market MVP"

**Option B - Git Commands (jika Git terinstall):**
```bash
cd d:\AION
git init
git add .
git commit -m "Initial AION prediction market MVP"
git branch -M main
git remote add origin https://github.com/0xCryptotech/aion-prediction-market.git
git push -u origin main
```

### 3. Repository Structure
```
aion-prediction-market/
├── backend/           # FastAPI server
├── frontend/          # React app
├── README.md          # Project documentation
├── .gitignore         # Git ignore rules
└── *.md files         # Setup guides
```

### 4. After Upload
- Update repository description
- Add topics: `blockchain`, `ai`, `prediction-market`, `linera`
- Enable GitHub Pages untuk demo (optional)

## Files Ready for Upload
✅ Complete application code
✅ Documentation files
✅ Setup instructions
✅ .gitignore configured