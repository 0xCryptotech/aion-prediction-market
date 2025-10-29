# Install Requirements untuk AION

## Python dan Node.js tidak terdeteksi di sistem

### 1. Install Python 3.10+
- Download dari: https://www.python.org/downloads/
- Centang "Add Python to PATH" saat install
- Restart command prompt setelah install

### 2. Install Node.js 18+
- Download dari: https://nodejs.org/
- Pilih LTS version
- Restart command prompt setelah install

### 3. Jalankan AION
```bash
# Terminal 1 - Backend
cd backend
pip install -r requirements.txt
python -m uvicorn server:app --reload --port 8001

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

### 4. Buka Browser
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001/docs

## Status Saat Ini
❌ Python tidak terinstall
❌ Node.js tidak terinstall
✅ Kode aplikasi siap
✅ Database schema siap
✅ Frontend UI siap