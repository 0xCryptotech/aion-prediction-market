# AION - Deployment Guide

## Deploy Frontend ke Vercel

### Option 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login ke Vercel**
```bash
vercel login
```

3. **Navigate ke frontend directory**
```bash
cd frontend
```

4. **Deploy**
```bash
vercel
```

5. **Follow prompts:**
- Set up and deploy: Yes
- Which scope: Select your account
- Link to existing project: No
- Project name: aion-prediction-market (atau nama lain)
- In which directory is your code located: ./
- Want to override settings: No

6. **Set Environment Variable di Vercel Dashboard**
- Go to: https://vercel.com/dashboard
- Select your project
- Go to Settings > Environment Variables
- Add: `REACT_APP_BACKEND_URL` = `<your-backend-url>`

7. **Deploy to Production**
```bash
vercel --prod
```

### Option 2: Vercel GitHub Integration

1. **Push code ke GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Connect to Vercel**
- Go to https://vercel.com
- Click "New Project"
- Import your GitHub repository
- Framework Preset: Create React App
- Root Directory: `frontend`
- Build Command: `yarn build`
- Output Directory: `build`

3. **Add Environment Variables**
- `REACT_APP_BACKEND_URL` = Your backend URL

4. **Deploy**
- Click "Deploy"
- Wait for deployment to complete
- Your app will be live at: `https://your-project.vercel.app`

### Option 3: Vercel Dashboard Upload

1. **Build lokally**
```bash
cd frontend
yarn build
```

2. **Go to Vercel Dashboard**
- https://vercel.com/dashboard

3. **Click "Add New" > "Project"**

4. **Upload `build` folder**

5. **Configure Environment Variables**

6. **Deploy**

## Deploy Backend

### Option 1: Railway (Recommended)

1. **Go to https://railway.app**

2. **Create New Project**
- Click "New Project"
- Select "Deploy from GitHub repo"
- Select your repository

3. **Configure Service**
- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`

4. **Add MongoDB**
- Click "New" > "Database" > "Add MongoDB"
- Copy connection string

5. **Add Environment Variables**
```
MONGO_URL=<mongodb-connection-string-from-railway>
DB_NAME=aion_db
CORS_ORIGINS=https://your-vercel-app.vercel.app,http://localhost:3000
```

6. **Deploy**
- Railway will auto-deploy
- Copy your backend URL (e.g., `https://your-app.up.railway.app`)

7. **Update Frontend Environment Variable**
- Go back to Vercel dashboard
- Update `REACT_APP_BACKEND_URL` with Railway URL
- Redeploy frontend

### Option 2: Render

1. **Go to https://render.com**

2. **Create Web Service**
- Click "New" > "Web Service"
- Connect GitHub repository

3. **Configure**
- Name: aion-backend
- Environment: Python 3
- Region: Choose closest to users
- Branch: main
- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`

4. **Add Environment Variables**
```
MONGO_URL=<your-mongodb-url>
DB_NAME=aion_db
CORS_ORIGINS=https://your-vercel-app.vercel.app
```

5. **Create MongoDB Database**
- Use MongoDB Atlas (free tier available)
- Or add as Render addon

6. **Deploy**

### Option 3: Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login**
```bash
heroku login
```

3. **Create app**
```bash
cd backend
heroku create aion-backend
```

4. **Add MongoDB**
```bash
heroku addons:create mongolab:sandbox
```

5. **Set Environment Variables**
```bash
heroku config:set DB_NAME=aion_db
heroku config:set CORS_ORIGINS=https://your-vercel-app.vercel.app
```

6. **Create Procfile**
```bash
echo "web: uvicorn server:app --host 0.0.0.0 --port \$PORT" > Procfile
```

7. **Deploy**
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

## Complete Deployment Checklist

- [ ] Backend deployed dan running
- [ ] MongoDB database created dan connected
- [ ] Backend URL noted
- [ ] Frontend deployed ke Vercel
- [ ] `REACT_APP_BACKEND_URL` set di Vercel
- [ ] CORS configured di backend untuk Vercel URL
- [ ] Test wallet connection
- [ ] Test API endpoints
- [ ] Verify all pages working

## Post-Deployment Testing

1. **Test Backend**
```bash
curl https://your-backend-url.com/api/statistics
```

2. **Test Frontend**
- Open: `https://your-vercel-app.vercel.app`
- Check all pages load
- Test wallet connection
- Test API calls (check browser console)

3. **Test Features**
- [ ] Dashboard loads with statistics
- [ ] Marketplace shows predictions
- [ ] Leaderboard displays AI models
- [ ] Governance shows proposals
- [ ] Wallet connects successfully
- [ ] Staking works
- [ ] Voting works

## Custom Domain (Optional)

### Vercel
1. Go to Project Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Backend
1. Configure custom domain in Railway/Render dashboard
2. Update CORS_ORIGINS
3. Update frontend REACT_APP_BACKEND_URL

## Environment Variables Summary

### Frontend (Vercel)
```
REACT_APP_BACKEND_URL=https://your-backend-url.com
```

### Backend (Railway/Render/Heroku)
```
MONGO_URL=mongodb://...
DB_NAME=aion_db
CORS_ORIGINS=https://your-vercel-app.vercel.app,https://www.your-domain.com
```

## Troubleshooting

### Issue: Frontend tidak bisa connect ke backend
**Solution:**
- Check REACT_APP_BACKEND_URL correct
- Verify CORS_ORIGINS includes Vercel URL
- Check backend logs

### Issue: Database connection error
**Solution:**
- Verify MONGO_URL correct
- Check database is running
- Verify IP whitelist (MongoDB Atlas)

### Issue: Vercel build fails
**Solution:**
- Check package.json scripts
- Verify all dependencies installed
- Check build logs in Vercel dashboard

## Support

Jika ada masalah saat deployment:
1. Check deployment logs
2. Verify environment variables
3. Test API endpoints manually
4. Check browser console for errors

## Quick Commands Reference

```bash
# Vercel
vercel                 # Deploy to preview
vercel --prod         # Deploy to production
vercel env pull       # Pull environment variables
vercel logs           # View deployment logs

# Railway
railway login
railway link
railway up

# Heroku
heroku logs --tail
heroku ps:scale web=1
heroku restart
```