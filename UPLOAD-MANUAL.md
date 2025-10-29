# Upload Manual ke GitHub via Browser

## Langkah-langkah:

### 1. Buat Repository Baru
- Go to: https://github.com/0xCryptotech
- Click "New repository"
- Repository name: `aion-prediction-market`
- Description: `Decentralized AI Prediction Market on Linera`
- Public
- **JANGAN** initialize with README
- Click "Create repository"

### 2. Upload via Browser
Karena repository sudah ada locally, gunakan GitHub Desktop atau command line dengan token.

### 3. Atau Gunakan GitHub Desktop
1. Download: https://desktop.github.com/
2. Install dan login
3. File > Add Local Repository
4. Browse ke: `d:\AION`
5. Click "Publish repository"
6. Uncheck "Keep this code private"
7. Click "Publish repository"

### 4. Atau Gunakan Personal Access Token
1. Go to: https://github.com/settings/tokens
2. Generate new token (classic)
3. Select: `repo` (full control)
4. Copy token
5. Run di command prompt:
```bash
cd d:\AION
git remote set-url origin https://YOUR_TOKEN@github.com/0xCryptotech/aion-prediction-market.git
git push -u origin master
```

## Files Ready to Upload
- 94 files
- Complete AION application
- Frontend + Backend
- All predictions (BTC, ETH, BNB, Aptos, Sui, Avalanche, Solana, Hyperliquid)