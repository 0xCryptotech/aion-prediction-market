# Railway Deployment Troubleshooting

## Common Errors & Solutions

### Error 1: "No Procfile or start command found"

**Solution**: Add start command in Railway settings
```
Settings → Deploy → Start Command:
uvicorn server:app --host 0.0.0.0 --port $PORT
```

---

### Error 2: "Module not found" or "Import Error"

**Cause**: Missing dependencies or wrong Python version

**Solution 1**: Check requirements.txt
```bash
# Make sure backend/requirements.txt exists and has all dependencies
cd backend
cat requirements.txt
```

**Solution 2**: Add runtime.txt
```bash
# Create backend/runtime.txt
echo "python-3.10" > backend/runtime.txt
```

**Solution 3**: Specify Python version in Railway
```
Settings → Environment → Python Version: 3.10
```

---

### Error 3: "Cannot find module 'server'"

**Cause**: Wrong root directory

**Solution**: Set correct root directory
```
Settings → General → Root Directory: backend
```

---

### Error 4: "Port already in use" or "Address in use"

**Cause**: Not using Railway's $PORT variable

**Solution**: Update start command
```
uvicorn server:app --host 0.0.0.0 --port $PORT
```

---

### Error 5: "MongoDB connection failed"

**Cause**: Wrong connection string or network access

**Solution 1**: Check MONGO_URL format
```
# Should be:
mongodb+srv://username:password@cluster.mongodb.net/dbname

# NOT:
mongodb://localhost:27017
```

**Solution 2**: MongoDB Atlas - Allow all IPs
```
1. Go to MongoDB Atlas
2. Network Access
3. Add IP: 0.0.0.0/0
4. Confirm
```

**Solution 3**: Use Railway MongoDB
```
1. In Railway project, click "New"
2. Select "Database" → "MongoDB"
3. Copy connection string
4. Update MONGO_URL variable
```

---

### Error 6: "Application failed to start"

**Cause**: Missing environment variables

**Solution**: Add all required variables
```
MONGO_URL=mongodb+srv://...
DB_NAME=aion_db
API_KEY=your-secret-key
CORS_ORIGINS=https://aion-static.vercel.app
LINERA_RPC_URL=http://localhost:8080
LINERA_MAIN_CHAIN_ID=default
LINERA_MAIN_APP_ID=
HIGH_VALUE_THRESHOLD=10000
HIGH_VOLUME_THRESHOLD=100
```

---

### Error 7: "Build failed" or "Deployment failed"

**Cause**: Build errors in code

**Solution**: Check Railway logs
```
1. Click on deployment
2. View "Build Logs"
3. Look for error message
4. Fix the error in code
5. Push to GitHub
6. Railway auto-redeploys
```

---

### Error 8: "CORS policy error"

**Cause**: Frontend URL not in CORS_ORIGINS

**Solution**: Update CORS_ORIGINS
```
CORS_ORIGINS=https://aion-static.vercel.app,http://localhost:3000
```

---

### Error 9: "502 Bad Gateway"

**Cause**: Application crashed or not responding

**Solution**: Check application logs
```
1. Railway Dashboard → Deployments
2. Click on latest deployment
3. View "Deploy Logs"
4. Look for crash reason
```

Common causes:
- MongoDB connection failed
- Missing dependencies
- Code error on startup

---

### Error 10: "Health check failed"

**Cause**: Application not responding on correct port

**Solution**: Ensure using $PORT
```python
# In server.py, should have:
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)
```

---

## Quick Fix Checklist

- [ ] Root directory set to `backend`
- [ ] Start command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
- [ ] All environment variables added
- [ ] MongoDB connection string correct
- [ ] MongoDB Atlas IP whitelist: 0.0.0.0/0
- [ ] Python version: 3.10+
- [ ] requirements.txt exists in backend/
- [ ] No syntax errors in code

---

## How to Check Logs

1. **Build Logs**
   ```
   Railway Dashboard → Service → Deployments → Build Logs
   ```
   Shows: Installation, dependencies, build process

2. **Deploy Logs**
   ```
   Railway Dashboard → Service → Deployments → Deploy Logs
   ```
   Shows: Application startup, runtime errors

3. **Application Logs**
   ```
   Railway Dashboard → Service → Logs (top right)
   ```
   Shows: Real-time application output

---

## Need More Help?

**Share these details**:
1. Error message from Railway logs
2. Which step failed (Build or Deploy)
3. Environment variables you set
4. MongoDB connection string format (hide password)

**Common log locations**:
- Build error: Build Logs tab
- Startup error: Deploy Logs tab
- Runtime error: Logs tab (top right)

---

## Alternative: Deploy with Railway CLI

If web UI has issues, try CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Deploy
cd backend
railway up

# View logs
railway logs
```

---

## Test Deployment

Once deployed, test:

```bash
# Get your Railway URL from dashboard
# Test health endpoint
curl https://your-app.railway.app/

# Test API
curl https://your-app.railway.app/api/statistics

# Test docs
open https://your-app.railway.app/docs
```

---

**What's the error message you're seeing?** 

Share the error and I'll help fix it! 🔧
