# Tasks

##Task 1: Backend — .env fayli va ma'lumotlar bazasini sozlash
**Status:** not_started

Server ishga tushirish uchun `.env` faylini to'ldirish va PostgreSQL ma'lumotlar bazasini sozlash.

### Sub-tasks:
- [ ] 1.1 `server/.env` faylida `DATABASE_URL` ni to'g'ri PostgreSQL URL bilan to'ldirish
- [ ] 1.2 `JWT_SECRET` va `JWT_REFRESH_SECRET` uchun kuchli random string qo'yish
- [ ] 1.3 `npx prisma migrate dev --name init` buyrug'i bilan migratsiya yaratish
- [ ] 1.4 `node src/prisma/seed.js` bilan demo ma'lumotlarni yuklash
- [ ] 1.5 `npm run dev` bilan serverni ishga tushirish va `/health` endpointni tekshirish

**Acceptance criteria:**
- Server `http://localhost:5000` da ishlamoqda
- `GET /health` → `{ success: true }` qaytaradi
- Ma'lumotlar bazasida jadvallar va demo ma'lumotlar mavjud

---

##Task 2: Backend — API endpointlarni test qilish
**Status:** not_started
**Depends on:** Task 1

Barcha API endpointlarni Postman yoki curl orqali tekshirish.

### Sub-tasks:
- [ ] 2.1 `POST /api/auth/register` — yangi user ro'yxatdan o'tkazish
- [ ] 2.2 `POST /api/auth/login` — admin va user bilan kirish, tokenlarni olish
- [ ] 2.3 `GET /api/auth/me` — Bearer token bilan joriy userni olish
- [ ] 2.4 `GET /api/incomes` — daromadlar ro'yxatini olish (auth required)
- [ ] 2.5 `POST /api/incomes` — yangi daromad qo'shish
- [ ] 2.6 `PUT /api/incomes/:id` — daromadni yangilash
- [ ] 2.7 `DELETE /api/incomes/:id` — daromadni o'chirish
- [ ] 2.8 `GET /api/expenses` — xarajatlar ro'yxati
- [ ] 2.9 `POST /api/expenses` — yangi xarajat qo'shish
- [ ] 2.10 `GET /api/stats` — statistika ma'lumotlari
- [ ] 2.11 `GET /api/admin/stats` — admin dashboard statistikasi
- [ ] 2.12 `GET /api/admin/users` — barcha userlar ro'yxati (admin only)

**Acceptance criteria:**
- Barcha endpointlar to'g'ri status code qaytaradi
- Auth middleware noto'g'ri token uchun 401 qaytaradi
- Admin endpointlar user uchun 403 qaytaradi

---

##Task 3: Frontend — API service layer yaratish
**Status:** not_started
**Depends on:** Task 1

Frontend uchun API bilan ishlash uchun `axios` yoki `fetch` asosida service layer yaratish.

### Sub-tasks:
- [x] 3.1 `src/services/api.js` — base axios instance yaratish (baseURL, interceptors)
- [x] 3.2 `src/services/auth.service.js` — login, register, logout, getMe funksiyalari
- [x] 3.3 `src/services/income.service.js` — CRUD + stats funksiyalari
- [x] 3.4 `src/services/expense.service.js` — CRUD + stats funksiyalari
- [x] 3.5 `src/services/stats.service.js` — getUserStats funksiyasi
- [x] 3.6 `src/services/admin.service.js` — admin CRUD funksiyalari
- [x] 3.7 Token refresh interceptor — 401 da avtomatik token yangilash

**Acceptance criteria:**
- API instance `Authorization: Bearer <token>` header qo'shadi
- Token muddati tugaganda avtomatik refresh qiladi
- Xato holatlarda tushunarli error message qaytaradi

---

# Task 4: Frontend — AuthContext ni API bilan ulash
**Status:** not_started
**Depends on:** Task 3

`AuthContext.jsx` ni LocalStorage o'rniga real API bilan ishlashga o'tkazish.

### Sub-tasks:
- [x] 4.1 `login()` funksiyasini `auth.service.login()` ga ulash
- [x] 4.2 `register()` funksiyasini `auth.service.register()` ga ulash
- [x] 4.3 `logout()` funksiyasini `auth.service.logout()` ga ulash
- [x] 4.4 App yuklanganda `auth.service.getMe()` bilan sessiyani tiklash
- [x] 4.5 `updateProfile()` va `changePassword()` ni API ga ulash
- [x] 4.6 Admin funksiyalarini (`adminCreateUser`, `adminUpdateUser`, `adminDeleteUser`) API ga ulash
- [x] 4.7 Loading state qo'shish (auth tekshirilayotganda spinner ko'rsatish)

**Acceptance criteria:**
- Login/register real API orqali ishlaydi
- Token localStorage da saqlanadi va sahifa yangilanishida sessiya tiklanadi
- Noto'g'ri credentials uchun server xato xabari ko'rsatiladi

---

# Task 5: Frontend — FinanceContext ni API bilan ulash
**Status:** not_started
**Depends on:** Task 3

`FinanceContext.jsx` ni LocalStorage o'rniga real API bilan ishlashga o'tkazish.

### Sub-tasks:
- [x] 5.1 `getIncomesByUser()` → `income.service.getIncomes()` ga ulash
- [x] 5.2 `addIncome()` → `income.service.createIncome()` ga ulash
- [x] 5.3 `deleteIncome()` → `income.service.deleteIncome()` ga ulash
- [x] 5.4 `getExpensesByUser()` → `expense.service.getExpenses()` ga ulash
- [x] 5.5 `addExpense()` → `expense.service.createExpense()` ga ulash
- [x] 5.6 `deleteExpense()` → `expense.service.deleteExpense()` ga ulash
- [x] 5.7 Loading va error state larni qo'shish
- [x] 5.8 Ma'lumotlar o'zgarganda avtomatik qayta yuklash (refetch)

**Acceptance criteria:**
- Daromad/xarajat qo'shilganda real DB ga yoziladi
- O'chirilganda DB dan ham o'chiriladi
- Sahifa yangilanishida ma'lumotlar API dan yuklanadi

---

# Task 6: Frontend — Statistics sahifasini API ga ulash
**Status:** not_started
**Depends on:** Task 5

`StatisticsPage` ni `GET /api/stats` endpointiga ulash.

### Sub-tasks:
- [x] 6.1 `stats.service.getUserStats(months)` chaqirish
- [x] 6.2 API dan kelgan `monthly`, `expenseByCategory` ma'lumotlarini chartlarga uzatish
- [x] 6.3 Period o'zgarganda API ni qayta chaqirish
- [x] 6.4 Loading skeleton ko'rsatish

**Acceptance criteria:**
- Statistika real DB ma'lumotlari asosida ko'rsatiladi
- Period (3/6/12 oy) o'zgarganda API qayta chaqiriladi

---

# Task 7: Frontend — Admin panel ni API ga ulash
**Status:** not_started
**Depends on:** Task 4

Admin sahifalarini real API bilan ishlashga o'tkazish.

### Sub-tasks:
- [x] 7.1 `AdminDashboard` → `GET /api/admin/stats` ga ulash
- [x] 7.2 `AdminUsers` → `GET /api/admin/users` ga ulash
- [x] 7.3 User yaratish → `POST /api/admin/users`
- [x] 7.4 User tahrirlash → `PUT /api/admin/users/:id`
- [x] 7.5 User o'chirish → `DELETE /api/admin/users/:id`
- [x] 7.6 User bloklash/faollashtirish → `PATCH /api/admin/users/:id/status`
- [x] 7.7 `AdminFinance` → `GET /api/admin/stats` + user filter

**Acceptance criteria:**
- Admin barcha userlarga CRUD amallarini bajarishi mumkin
- Bloklangan user login qila olmaydi
- Admin o'zini o'chira olmaydi

---

# Task 8: Frontend — CSS fayllarini to'ldirish
**Status:** not_started

Barcha komponent va sahifalar uchun CSS fayllarini yozish.

### Sub-tasks:
- [x] 8.1 `LandingPage.css` — hero, services, stats, testimonials, CTA seksiyalari
- [x] 8.2 `LoginPage.css` / `RegisterPage.css` — split-screen auth layout
- [x] 8.3 `Sidebar.css` — fixed sidebar, mobile overlay, nav items
- [x] 8.4 `Navbar.css` — top navbar, mobile menu button
- [x] 8.5 `DashboardLayout.css` — layout grid (sidebar + main)
- [x] 8.6 `DashboardPage.css` — welcome, cards grid, charts grid
- [x] 8.7 `DashboardCards.css` — gradient stat cards
- [x] 8.8 `ChartContainer.css` — chart wrapper, tooltip
- [x] 8.9 `TransactionTable.css` — table, type dots, amount colors
- [x] 8.10 `IncomePage.css` / `ExpensePage.css` — list page layout
- [x] 8.11 `IncomeForm.css` / `ExpenseForm.css` — form layout
- [x] 8.12 `TransactionsPage.css` — summary cards, filters, table
- [x] 8.13 `StatisticsPage.css` — charts grid, monthly table, category bars
- [x] 8.14 `ProfilePage.css` — profile card, forms grid
- [x] 8.15 `SettingsPage.css` — sections, toggle switch, theme options
- [x] 8.16 `Modal.css` — overlay, modal box, animations
- [x] 8.17 `SearchBar.css` — search input with icon
- [x] 8.18 `FilterPanel.css` — filter controls
- [x] 8.19 `Pagination.css` — page buttons
- [x] 8.20 `AdminLayout.css` / `AdminDashboard.css` / `AdminUsers.css` — admin panel styles
- [x] 8.21 `Footer.css` — landing page footer

**Acceptance criteria:**
- Barcha sahifalar light va dark modeda to'g'ri ko'rinadi
- Responsive: 320px, 768px, 1024px+ da to'g'ri ishlaydi
- CSS custom properties (variables) ishlatilgan

---

#  Task 9: Frontend — ExpensePage va IncomeForm/ExpenseForm komponentlarini to'ldirish
**Status:** not_started

`ExpensePage.jsx`, `IncomeForm.jsx`, `ExpenseForm.jsx` komponentlarini yozish.

### Sub-tasks:
- [x] 9.1 `ExpensePage.jsx` — IncomePage bilan bir xil struktura, expense uchun
- [x] 9.2 `IncomeForm.jsx` — title, amount, category (select), date, description maydonlari
- [x] 9.3 `ExpenseForm.jsx` — IncomeForm bilan bir xil, expense kategoriyalari bilan
- [x] 9.4 `RegisterPage.jsx` — fullName, email, password, confirmPassword, validatsiya
- [x] 9.5 `Modal.jsx` — isOpen, onClose, title, size props bilan accessible modal
- [x] 9.6 `SearchBar.jsx` — value, onChange, placeholder props
- [x] 9.7 `FilterPanel.jsx` — categories, filters, onFilterChange, onReset props
- [x] 9.8 `Pagination.jsx` — currentPage, totalPages, onPageChange props
- [x] 9.9 `Footer.jsx` — landing page footer (links, copyright)
- [x] 9.10 `Loader.jsx` — loading spinner komponenti

**Acceptance criteria:**
- Formlar validatsiya bilan ishlaydi
- Modal ESC tugmasi va overlay click bilan yopiladi
- Pagination to'g'ri sahifalarni ko'rsatadi

---

# Task 10: Frontend — AdminLayout va AdminSidebar komponentlarini to'ldirish
**Status:** not_started

Admin panel layout komponentlarini yozish.

### Sub-tasks:
- [x] 10.1 `AdminLayout.jsx` — AdminSidebar + AdminNavbar + Outlet
- [x] 10.2 `AdminSidebar.jsx` — admin nav links (Dashboard, Users, Finance, Settings)
- [x] 10.3 `AdminNavbar.jsx` — admin top bar (title, theme toggle, user info)
- [x] 10.4 `AdminRoute.jsx` — faqat admin role uchun route guard
- [x] 10.5 `PublicRoute.jsx` — login bo'lgan user uchun redirect (role asosida)

**Acceptance criteria:**
- Admin panel faqat admin role bilan kirish mumkin
- User `/admin` ga kirmoqchi bo'lsa `/dashboard` ga redirect qilinadi
- Admin sidebar barcha admin sahifalariga navigatsiya qiladi

---

# Task 11: Integratsiya va yakuniy test
**Status:** not_started
**Depends on:** Task 4, Task 5, Task 7, Task 8, Task 9, Task 10

Butun ilovani end-to-end test qilish.

### Sub-tasks:
- [ ] 11.1 Landing page → Register → Dashboard oqimini test qilish
- [ ] 11.2 Login (user) → Dashboard → Income qo'shish → Statistics ko'rish
- [ ] 11.3 Login (admin) → Admin Dashboard → User bloklash → Bloklangan user login qila olmasligini tekshirish
- [x] 11.4 Dark/Light mode toggle barcha sahifalarda ishlashini tekshirish
- [~] 11.5 Mobile (320px) da responsive ko'rinishni tekshirish
- [~] 11.6 Token muddati tugaganda avtomatik refresh ishlashini tekshirish
- [x] 11.7 `npm run build` bilan production build muvaffaqiyatli yakunlanishini tekshirish

**Acceptance criteria:**
- Barcha asosiy oqimlar xatosiz ishlaydi
- Production build muvaffaqiyatli yakunlanadi
- Console da kritik xatolar yo'q

---

# Task 12: README.md yangilash
**Status:** not_started
**Depends on:** Task 11

Loyiha README faylini to'liq ma'lumotlar bilan yangilash.

### Sub-tasks:
- [x] 12.1 Loyiha tavsifi va funksiyalar ro'yxati
- [x] 12.2 Frontend ishga tushirish (`npm run dev`)
- [x] 12.3 Backend ishga tushirish (`cd server && npm run dev`)
- [x] 12.4 Ma'lumotlar bazasi sozlash (`prisma migrate dev`, `seed`)
- [x] 12.5 Demo login ma'lumotlari
- [x] 12.6 API endpointlar ro'yxati
- [x] 12.7 Loyiha strukturasi

**Acceptance criteria:**
- README o'qib, loyihani ishga tushirish mumkin
- Barcha muhim ma'lumotlar mavjud
