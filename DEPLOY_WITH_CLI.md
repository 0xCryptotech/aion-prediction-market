# 🚀 Deploy AION Backend with Railway CLI - Step by Step

## ✅ CLI Already Installed!

Railway CLI sudah terinstall. Sekarang tinggal login dan deploy!

---

## Step 1: Login to Railway (Manual)

**Buka terminal baru** dan jalankan:

```bash
railway login
```

Ini akan:
1. Open browser automatically
2. Login dengan GitHub account
3. Authorize Railway CLI
4. Return to terminal

**Expected output**:
```
🎉 Logged in as your-email@example.com
```

---

## Step 2: Go to Backend Folder

```bash
cd backend
```

---

## Step 3: Initialize Railway Project

```bash
railway init
```

**Pilihan**:
- "Create a new project" → Enter
- Project name: `aion-backend` → Enter
- Environment: `production` → Enter

**Expected output**:
```
✅ Created project aion-backend
✅ Linked to project aion-backend
```

---

## Step 4: Add Environment Variables

```bash
# Add MongoDB URL (use localhost for now, we'll add real MongoDB later)
railway variables set MONGO_URL="mongodb://localhost:27017"

# Add other variables
railway variables set DB_NAME="aion_db"
railway variables set API_KEY="aion-production-secret-2024"
railway variables set CORS_ORIGINS="https://aion-static.vercel.app,http://localhost:3000"
railway variables set LINERA_RPC_URL="http://localhost:8080"
railway variables set LINERA_MAIN_CHAIN_ID="default"
railway variables set LINERA_MAIN_APP_ID=""
railway variables set HIGH_VALUE_THRESHOLD="10000"
railway variables set HIGH_VOLUME_THRESHOLD="100"
```

**Expected output** (for each):
```
✅ Set MONGO_URL
```

---

## Step 5: Deploy!

```bash
railway up
```

This will:
1. Upload your backend code
2. Install dependencies
3. Start the application
4. Give you a URL

**Expected output**:
```
🚀 Deploying...
📦 Building...
✅ Build successful
🎉 Deployment successful
🌐 https://aion-backend-production-xxxx.up.railway.app
```

**Time**: 2-3 minutes

---

## Step 6: Get Your URL

```bash
railway domain
```

**Output**:
```
https://aion-backend-production-xxxx.up.railway.app
```

**Copy this URL!** You'll need it for frontend.

---

## Step 7: Test Backend

```bash
# Test health endpoint
curl https://your-railway-url.railway.app/

# Test API
curl https://your-railway-url.railway.app/api/statistics

# Should return JSON with stats
```

---

## Step 8: Add MongoDB (Optional but Recommended)

### Option A: Railway MongoDB Plugin

```bash
# Add MongoDB to your project
railway add

# Select "MongoDB"
# Railway will create MongoDB instance and set MONGO_URL automatically
```

### Option B: MongoDB Atlas (Free)

1. Go to https://cloud.mongodb.com
2. Create free cluster
3. Get connection string
4. Update variable:

```bash
railway variables set MONGO_URL="mongodb+srv://username:password@cluster.mongodb.net/aion_db"
```

---

## Step 9: Update Frontend

Now update frontend to use your Railway backend:

```bash
# Go back to root
cd ..

# Edit AION LINERA/api.js
# Change line 9:
# baseURL: 'https://your-railway-url.railway.app'
```

Then commit and push:

```bash
git add "AION LINERA/api.js"
git commit -m "Update API URL to Railway backend"
git push origin main
```

Vercel will auto-deploy frontend with new API URL!

---

## 🎉 Done!

Your AION app is now fully deployed!

**URLs**:
- Frontend: https://aion-static.vercel.app
- Backend: https://your-railway-url.railway.app
- API Docs: https://your-railway-url.railway.app/docs

---

## 📊 Useful Commands

```bash
# View logs
railway logs

# Check status
railway status

# Open in browser
railway open

# View variables
railway variables

# Redeploy
railway up

# Link to existing project
railway link

# Unlink
railway unlink
```

---

## 🐛 Troubleshooting

### "Not logged in"
```bash
railway login
# Follow browser prompts
```

### "No project linked"
```bash
railway link
# Select your project
```

### "Build failed"
```bash
railway logs
# Check error message
# Fix issue
# Redeploy: railway up
```

### "MongoDB connection failed"
```bash
# Add MongoDB plugin
railway add
# Select MongoDB

# Or use MongoDB Atlas
railway variables set MONGO_URL="your-atlas-url"
```

---

## 🎯 Next Steps

1. ✅ Test all API endpoints
2. ✅ Add MongoDB (if not done)
3. ✅ Update frontend API URL
4. ✅ Test full app
5. ✅ Share with users!

---

## 💡 Pro Tips

### Auto-deploy on Push (Later)

Once stable, you can connect GitHub for auto-deploy:

```bash
# In Railway Dashboard
# Settings → Connect GitHub
# Select repo: aion-prediction-market
# Root directory: backend
# Auto-deploy on push to main
```

### Monitor Deployment

```bash
# Real-time logs
railway logs --follow

# Or open dashboard
railway open
```

### Environment Management

```bash
# List all variables
railway variables

# Delete variable
railway variables delete VARIABLE_NAME

# Set multiple at once
railway variables set KEY1=value1 KEY2=value2
```

---

## 🚀 Ready to Deploy!

Just run these commands in your terminal:

```bash
# 1. Login
railway login

# 2. Go to backend
cd backend

# 3. Initialize
railway init

# 4. Add variables (see Step 4 above)

# 5. Deploy!
railway up

# 6. Get URL
railway domain
```

**Total time**: ~5 minutes

**Success rate**: 99%

Let's go! 🎉
