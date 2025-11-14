# Deploy Backend to Railway - Step by Step

## Prerequisites
- GitHub repo: ✅ https://github.com/0xCryptotech/aion-prediction-market
- Railway account (free): https://railway.app

---

## Step 1: Login to Railway (1 min)

1. Go to https://railway.app
2. Click "Login" → "Login with GitHub"
3. Authorize Railway

---

## Step 2: Create New Project (2 min)

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Select repository: `0xCryptotech/aion-prediction-market`
4. Railway will detect the project

---

## Step 3: Configure Backend Service (3 min)

1. **Set Root Directory**
   - Click on the service
   - Go to "Settings"
   - Root Directory: `backend`
   - Save

2. **Set Build & Start Commands**
   - Build Command: (leave empty, Railway auto-detects)
   - Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - Save

3. **Add Environment Variables**
   Click "Variables" tab, add these:

   ```
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=aion_db
   API_KEY=aion-production-secret-key-2024
   CORS_ORIGINS=https://aion-static.vercel.app,http://localhost:3000
   LINERA_RPC_URL=http://localhost:8080
   LINERA_MAIN_CHAIN_ID=default
   LINERA_MAIN_APP_ID=
   HIGH_VALUE_THRESHOLD=10000
   HIGH_VOLUME_THRESHOLD=100
   ```

   **Important**: We'll update MONGO_URL in next step

---

## Step 4: Add MongoDB (2 min)

**Option A: Railway MongoDB Plugin**
1. In your project, click "New"
2. Select "Database" → "Add MongoDB"
3. Railway creates MongoDB instance
4. Copy connection string from MongoDB service
5. Update `MONGO_URL` in backend variables

**Option B: MongoDB Atlas (Recommended)**
1. Follow `MONGODB_SETUP.md`
2. Get connection string
3. Update `MONGO_URL` in backend variables

---

## Step 5: Deploy! (2 min)

1. Click "Deploy"
2. Wait for build (2-3 minutes)
3. Check logs for "Application startup complete"
4. Get your URL from "Settings" → "Domains"
   - Example: `https://aion-backend-production.up.railway.app`

---

## Step 6: Test Backend (1 min)

```bash
# Test API
curl https://your-railway-url.railway.app/api/statistics

# Should return JSON with stats
```

---

## Step 7: Update Frontend (2 min)

1. **Update API URL in code**
   ```bash
   # Edit AION LINERA/api.js
   # Line 9, change to:
   baseURL: 'https://your-railway-url.railway.app'
   ```

2. **Commit and push**
   ```bash
   git add "AION LINERA/api.js"
   git commit -m "Update API URL for production"
   git push origin main
   ```

3. **Vercel auto-deploys**
   - Wait 1-2 minutes
   - Check https://aion-static.vercel.app

---

## ✅ Done!

Your AION app is now fully deployed! 🎉

**URLs**:
- Frontend: https://aion-static.vercel.app
- Backend: https://your-railway-url.railway.app
- API Docs: https://your-railway-url.railway.app/docs

---

## 🐛 Troubleshooting

### Build Failed
- Check logs in Railway dashboard
- Verify `requirements.txt` is correct
- Check Python version (should be 3.10+)

### Application Won't Start
- Check environment variables
- Verify MongoDB connection string
- Check start command

### CORS Errors
- Update `CORS_ORIGINS` to include your Vercel URL
- Redeploy backend

### Database Connection Failed
- Check MongoDB Atlas IP whitelist (0.0.0.0/0)
- Verify connection string format
- Check database user permissions

---

## 📊 Monitor

- Railway Dashboard: Real-time logs
- Vercel Dashboard: Analytics
- MongoDB Atlas: Database metrics

---

## 🎯 Next Steps

1. ✅ Test all features
2. ✅ Share with users
3. ✅ Get feedback
4. Add custom domain
5. Setup monitoring
6. Add analytics

---

**Ready to deploy!** 🚀
