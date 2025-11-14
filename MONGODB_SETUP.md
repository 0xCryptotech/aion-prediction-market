# MongoDB Atlas Setup (Free)

## Quick Setup (3 minutes)

1. **Go to MongoDB Atlas**
   - Visit: https://cloud.mongodb.com
   - Click "Try Free"
   - Sign up with Google/GitHub

2. **Create Cluster**
   - Choose "M0 Sandbox" (FREE)
   - Select region closest to you
   - Cluster Name: "aion-cluster"
   - Click "Create"

3. **Setup Database Access**
   - Click "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Username: `aion_admin`
   - Password: Generate secure password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Setup Network Access**
   - Click "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Click "Database" (left sidebar)
   - Click "Connect" on your cluster
   - Click "Connect your application"
   - Copy connection string:
   ```
   mongodb+srv://aion_admin:<password>@aion-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password

6. **Save Connection String**
   ```
   MONGO_URL=mongodb+srv://aion_admin:YOUR_PASSWORD@aion-cluster.xxxxx.mongodb.net/aion_db?retryWrites=true&w=majority
   ```

Done! ✅
