# 💰 Shahsiy Moliya Boshqaruvi

Foydalanuvchilarga daromad va xarajatlarini kuzatish, moliyaviy statistikani ko'rish va shaxsiy moliyaviy maqsadlarini boshqarish imkonini beruvchi zamonaviy web-ilova.

---

## 🚀 Texnologiyalar

### Frontend
| Texnologiya | Versiya |
|---|---|
| React | 19 |
| React Router DOM | 7 |
| Recharts | 3 |
| React Icons | 5 |
| Vite | 7 |

### Backend
| Texnologiya | Versiya |
|---|---|
| Node.js + Express | 5 |
| Prisma ORM | 6 |
| PostgreSQL | — |
| JWT (access + refresh) | — |
| bcryptjs | — |
| Joi (validation) | — |

---

## 📁 Loyiha Strukturasi

```
shahsiy-moliya-boshqaruvi/
├── src/                        # Frontend (React)
│   ├── components/             # Qayta ishlatiladigan komponentlar
│   ├── context/                # React Context (Auth, Finance, Theme)
│   ├── hooks/                  # Custom hooks
│   ├── layouts/                # Sahifa layoutlari
│   ├── pages/                  # Route sahifalari
│   │   └── admin/              # Admin panel sahifalari
│   ├── routes/                 # Route guardlar
│   ├── services/               # API service layer
│   │   ├── api.js              # Base fetch wrapper + token refresh
│   │   ├── auth.service.js
│   │   ├── income.service.js
│   │   ├── expense.service.js
│   │   ├── stats.service.js
│   │   └── admin.service.js
│   ├── styles/                 # Global CSS + variables
│   └── utils/                  # Helper funksiyalar
│
└── server/                     # Backend (Express + Prisma)
    ├── src/
    │   ├── config/             # JWT, Prisma konfiguratsiya
    │   ├── controllers/        # Route handlerlari
    │   ├── middlewares/        # Auth, error, validation
    │   ├── routes/             # API routelari
    │   ├── validations/        # Joi schemalar
    │   └── prisma/             # Seed fayl
    └── prisma/
        └── schema.prisma       # Ma'lumotlar bazasi sxemasi
```

---

## ⚡ Ishga Tushirish

### 1. Frontend (Demo rejim — DB kerak emas)

```bash
# Dependencylarni o'rnatish
npm install

# .env faylini yaratish
cp .env.example .env
# .env da VITE_USE_API=false qoldiring

# Development server
npm run dev
```

Frontend `http://localhost:5173` da ochiladi.

---

### 2. Backend (Real API rejim)

#### a) PostgreSQL ma'lumotlar bazasini sozlash

```bash
cd server
npm install
```

`server/.env` faylini to'ldiring:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
JWT_SECRET="your-strong-random-secret-here"
JWT_REFRESH_SECRET="another-strong-random-secret"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
CLIENT_URL="http://localhost:5173"
```

#### b) Migratsiya va seed

```bash
cd server

# Migratsiya yaratish
npx prisma migrate dev --name init

# Demo ma'lumotlarni yuklash
node src/prisma/seed.js

# Serverni ishga tushirish
npm run dev
```

Backend `http://localhost:5000` da ochiladi.

#### c) Frontend ni API rejimga o'tkazish

`.env` faylida:
```env
VITE_USE_API=true
VITE_API_URL=http://localhost:5000/api
```

---

## 🔑 Demo Login Ma'lumotlari

| Rol | Email | Parol |
|---|---|---|
| **Admin** | admin@example.com | admin123 |
| **User 1** | alisher@example.com | password123 |
| **User 2** | malika@example.com | password123 |
| **User 3** | bobur@example.com | password123 (bloklangan) |
| **User 4** | nilufar@example.com | password123 |

---

## 🌐 API Endpointlar

### Auth
| Method | Endpoint | Tavsif |
|---|---|---|
| POST | `/api/auth/register` | Ro'yxatdan o'tish |
| POST | `/api/auth/login` | Kirish |
| POST | `/api/auth/refresh` | Token yangilash |
| POST | `/api/auth/logout` | Chiqish |
| GET | `/api/auth/me` | Joriy user |
| PUT | `/api/auth/profile` | Profil yangilash |
| PUT | `/api/auth/change-password` | Parol o'zgartirish |

### Daromadlar
| Method | Endpoint | Tavsif |
|---|---|---|
| GET | `/api/incomes` | Daromadlar ro'yxati |
| GET | `/api/incomes/stats` | Statistika |
| POST | `/api/incomes` | Yangi daromad |
| PUT | `/api/incomes/:id` | Yangilash |
| DELETE | `/api/incomes/:id` | O'chirish |

### Xarajatlar
| Method | Endpoint | Tavsif |
|---|---|---|
| GET | `/api/expenses` | Xarajatlar ro'yxati |
| GET | `/api/expenses/stats` | Statistika |
| POST | `/api/expenses` | Yangi xarajat |
| PUT | `/api/expenses/:id` | Yangilash |
| DELETE | `/api/expenses/:id` | O'chirish |

### Statistika
| Method | Endpoint | Tavsif |
|---|---|---|
| GET | `/api/stats?months=6` | Oylik statistika |

### Admin (Admin role talab qilinadi)
| Method | Endpoint | Tavsif |
|---|---|---|
| GET | `/api/admin/stats` | Dashboard statistikasi |
| GET | `/api/admin/users` | Barcha userlar |
| GET | `/api/admin/users/:id` | User ma'lumotlari |
| POST | `/api/admin/users` | User yaratish |
| PUT | `/api/admin/users/:id` | User yangilash |
| DELETE | `/api/admin/users/:id` | User o'chirish |
| PATCH | `/api/admin/users/:id/status` | Bloklash/faollashtirish |

---

## ✨ Funksiyalar

- 🔐 **Autentifikatsiya** — JWT access/refresh token, "Meni eslab qol"
- 👤 **Rol asosida kirish** — User va Admin panellari
- 💵 **Daromad boshqaruvi** — CRUD, kategoriya, sana filtri, qidiruv
- 💸 **Xarajat boshqaruvi** — CRUD, kategoriya, sana filtri, qidiruv
- 📊 **Dashboard** — Balans, oylik daromad/xarajat, grafiklar, oxirgi tranzaksiyalar
- 📈 **Statistika** — Pie chart, Bar chart, oylik hisobot, kategoriya hisoboti
- 🔍 **Tranzaksiyalar** — Unified jadval, saralash, filtrlash, pagination
- 👤 **Profil** — Avatar yuklash, ma'lumot yangilash, parol o'zgartirish
- ⚙️ **Sozlamalar** — Dark/Light mode, bildirishnomalar, hisob boshqaruvi
- 🛡️ **Admin panel** — Foydalanuvchilar CRUD, moliyaviy hisobot, statistika
- 🌙 **Dark/Light mode** — CSS custom properties bilan
- 📱 **Responsive** — 320px, 768px, 1024px+ breakpointlar

---

## 🏗️ Build

```bash
# Frontend production build
npm run build

# Preview
npm run preview
```

---

## 📝 Muhit O'zgaruvchilari

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_USE_API=false   # true = real backend, false = LocalStorage demo
```

### Backend (`server/.env`)
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
JWT_REFRESH_SECRET="..."
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
CLIENT_URL="http://localhost:5173"
```
