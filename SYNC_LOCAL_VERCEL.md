# 🔄 Sync Local dengan Vercel Deployment

## 📊 Status Deployment

**Production (Vercel):** https://aion-static.vercel.app/
**Local Development:** http://localhost:8080
**Backend Local:** http://localhost:8001

---

## 🎯 Versi Yang Sama

Kedua versi (local & Vercel) menggunakan file yang sama dari folder:
```
AION LINERA/
├── index.html
├── api.js
└── linera-config.js
```

---

## 🔧 Konfigurasi API

### Current Setup (api.js):

```javascript
const API_CONFIG = {
    baseURL: 'http://localhost:8001',  // Local backend
    // baseURL: 'https://aion-backend-production.up.railway.app',  // Production
    timeout: 10000,
};
```

### Masalah:
- ❌ Vercel deployment masih pointing ke `localhost:8001`
- ❌ Tidak bisa akses backend dari production
- ⚠️ Perlu backend production URL

---

## ✅ Solusi: Auto-detect Environment

Mari kita update `api.js` untuk auto-detect local vs production:

<function_calls>
<invoke name="strReplace">
<parameter name="path">AION LINERA/api.js