# 🛒 MySupermarket — Nidaamka Maamulka Dukaanka

Barnaamij buuxa oo loogu talagalay maamulka dukaanada yar-yar iyo kuwa dhexdhexaadka ah.

---

## 📁 Qaab-dhismeedka Mashruuca

```
mysupermarket/
├── frontend/     ← React + Vite (18 files)
└── backend/      ← Node.js + Express + MongoDB (24 files)
```

---

## 🚀 Sida Loo Shaqeeyo

### Backend
```bash
cd backend
npm install
# .env wax ka beddel (MongoDB URI)
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Akoonka Admin-ka Kowaad

Ka abuuri MongoDB ama isticmaal script-kan:
```js
// Ku run-garee Node.js
const mongoose = require('mongoose')
const User = require('./backend/models/User')
mongoose.connect('mongodb://localhost:27017/mysupermarket')
User.create({ name: 'Admin', email: 'admin@supermarket.so', password: 'admin123', role: 'admin' })
```

---

## 🌐 API Endpoints

| Method | URL | Sharaxaad |
|--------|-----|-----------|
| POST | /api/auth/login | Gal |
| GET | /api/auth/me | Xogta isticmaalaha |
| GET | /api/products | Dhammaan badeecadaha |
| POST | /api/products | Ku dar badeecad |
| PUT | /api/products/:id | Wax ka beddel |
| DELETE | /api/products/:id | Tirtir |
| GET | /api/sales | Iibka |
| POST | /api/sales | Iib cusub |
| GET | /api/reports/dashboard | Dashboard stats |
| GET | /api/reports | Warbixinnada |
| GET | /api/users | Shaqaalaha (admin) |
| GET | /api/categories | Noocyada |
| GET | /api/suppliers | Keenayaasha |

---

## 👥 Doorashada (Roles)

| Door | Awoodaha |
|------|----------|
| **admin** | Dhammaan wax |
| **manager** | Badeecadaha, iibka, warbixinnada |
| **cashier** | Iibka oo kaliya |

---

## 🛠️ Teknoolajiyada

**Frontend:** React 18, Vite, React Router, Recharts, Axios  
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt

---

## 📊 Waxa Barnaamijku Samayn Karo

- ✅ Gal/Ka bax nidaamka (JWT)
- ✅ Maamul badeecadaha + raadinta
- ✅ Iib cusub abuur + kaydka si otomaatig ah u jar
- ✅ Warbixinnada iyo charts-yada
- ✅ Maamul shaqaalaha (admin)
- ✅ Noocyada (categories) iyo keenayaasha (suppliers)
- ✅ Xaaladda kaydka + digniinta badeecadaha yar
"# mysupermarket" 
"# mysupermarket" 
