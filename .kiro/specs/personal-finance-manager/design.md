# Design Document

## Personal Finance Manager — Arxitektura va Dizayn

---

## Overview

Personal Finance Manager — React 19, React Router DOM 7, Context API va LocalStorage asosida qurilgan SPA (Single Page Application). Ilova foydalanuvchilarga daromad/xarajat kuzatuvi, moliyaviy statistika va admin panel imkoniyatlarini beradi.

**Tech Stack:**
- Frontend: React 19 + Vite 7
- Routing: React Router DOM 7
- State: React Context API
- Storage: Browser LocalStorage
- Charts: Recharts 3
- Icons: React Icons 5
- Styling: CSS Modules + CSS Custom Properties (variables)
- No TypeScript, No Tailwind

---

## Architecture

### Folder Structure

```
src/
├── assets/          # Static assets
├── components/      # Reusable UI components
├── context/         # React Context providers
│   ├── AuthContext.jsx        # Auth state + user management
│   ├── FinanceContext.jsx     # Income/Expense state
│   ├── ThemeContext.jsx       # Dark/Light theme
│   ├── NotificationContext.jsx # Notification settings
│   └── SettingsContext.jsx    # App settings
├── hooks/           # Custom React hooks
│   ├── useCountUp.js          # Animated counter
│   ├── useDebounce.js         # Search debounce
│   ├── useLocalStorage.js     # LocalStorage hook
│   └── usePagination.js       # Pagination logic
├── layouts/         # Page layout wrappers
│   ├── DashboardLayout/       # User dashboard layout (Sidebar + Navbar)
│   ├── AdminLayout/           # Admin panel layout
│   ├── AuthLayout/            # Auth pages layout
│   └── PublicLayout/          # Landing page layout
├── pages/           # Route-level page components
│   ├── LandingPage/
│   ├── LoginPage/
│   ├── RegisterPage/
│   ├── DashboardPage/
│   ├── IncomePage/
│   ├── ExpensePage/
│   ├── TransactionsPage/
│   ├── StatisticsPage/
│   ├── ProfilePage/
│   ├── SettingsPage/
│   └── admin/
│       ├── AdminDashboard/
│       ├── AdminUsers/
│       ├── AdminFinance/
│       └── AdminSettings/
├── routes/          # Route guard components
│   ├── ProtectedRoute.jsx     # Auth required
│   ├── PublicRoute.jsx        # Redirect if logged in
│   └── AdminRoute.jsx         # Admin role required
├── styles/          # Global styles
│   ├── variables.css          # CSS custom properties (theme tokens)
│   └── global.css             # Reset + utility classes
└── utils/           # Helper functions and constants
    ├── constants.js           # Categories, pagination config
    ├── dummyData.js           # Seed data for demo
    ├── formatters.js          # Number/date formatters
    ├── helpers.js             # Utility functions
    └── localStorage.js        # LocalStorage helpers
```

---

## Component Architecture

### Context Providers (Global State)

```
App
└── BrowserRouter
    └── ThemeProvider          → theme, toggleTheme
        └── AuthProvider       → user, users, login, register, logout, updateProfile...
            └── FinanceProvider → incomes, expenses, addIncome, deleteIncome...
                └── NotificationProvider → notifications, updateNotifications
                    └── Routes
```

### Data Flow

```
LocalStorage ←→ Context (AuthContext, FinanceContext, ThemeContext)
                    ↓
              Page Components
                    ↓
              UI Components (read-only props)
```

---

## Page Designs

### 1. Landing Page (`/`)

**Layout:** Full-width, no sidebar
**Sections:**
- Navbar: Logo + nav links + theme toggle + Login/Register CTAs
- Hero: Headline + description + CTA buttons + visual card mockup
- Services: 6-card grid with icons
- Statistics: 4 animated counters (IntersectionObserver)
- Testimonials: 4-card grid with star ratings
- CTA Banner: Register call-to-action
- Footer: Links + copyright

**Responsive:** Mobile-first, 3 breakpoints (320px, 768px, 1024px+)

---

### 2. Auth Pages (`/login`, `/register`)

**Layout:** Split-screen (left: form, right: feature showcase)
**Login features:**
- Email + password fields with icons
- Show/hide password toggle
- "Remember Me" checkbox → localStorage vs sessionStorage
- "Forgot Password" button (UI only)
- Role-based redirect: admin → `/admin`, user → `/dashboard`
- Demo credentials cards

**Register features:**
- Full Name, Email, Password, Confirm Password
- Password strength validation (min 8 chars)
- Password match validation
- Duplicate email check

---

### 3. Dashboard Layout (`/dashboard/*`)

**Layout:** Fixed sidebar (256px) + top navbar + main content area
**Sidebar:** Logo, nav links with icons, user info, logout
**Navbar:** Page title, search, notifications, user avatar dropdown
**Responsive:** Sidebar collapses to overlay on mobile (<1024px)

---

### 4. Dashboard Page (`/dashboard`)

**Components:**
- Greeting header with quick-add buttons
- `DashboardCards`: Balance, Monthly Income, Monthly Expense cards
- `ChartContainer` with `MonthlyBarChart` + `MonthlyLineChart`
- Recent transactions table (last 5)

**Data:** User-scoped (filtered by `user.id`)

---

### 5. Income Page (`/income`)

**Components:**
- Header with totals summary
- Toggle-able `IncomeForm` (title, amount, category, date, description)
- `SearchBar` with debounce
- `FilterPanel` (category + date range)
- `TransactionTable` with pagination
- `Pagination` component

**Sorting:** Date descending by default

---

### 6. Expense Page (`/expense`)

Same structure as Income Page but for expenses with `ExpenseForm`.

---

### 7. Transactions Page (`/transactions`)

**Components:**
- Summary cards (Total Income, Total Expense, Balance)
- `SearchBar`
- Type filter tabs (All / Income / Expense)
- Sort dropdown (date asc/desc, amount asc/desc)
- `TransactionTable` with pagination
- Color coding: income = green, expense = red

---

### 8. Statistics Page (`/statistics`)

**Components:**
- Period selector (3/6/12 months)
- `MonthlyBarChart` (income vs expense)
- `ExpensePieChart` (expense by category)
- Monthly Report table (income, expense, net, status badge)
- Category Report with progress bars

---

### 9. Profile Page (`/profile`)

**Components:**
- Profile card: avatar (upload), name, email, stats
- Profile form: update name + email
- Password change form: current + new + confirm

---

### 10. Settings Page (`/settings`)

**Sections:**
- Theme Settings: Light/Dark mode toggle buttons
- Notification Settings: 3 toggles (app, sound, email)
- Account Settings: email update form + delete account (with confirmation modal)

---

### 11. Admin Panel (`/admin/*`)

**Layout:** AdminLayout with AdminSidebar + AdminNavbar

**Admin Dashboard (`/admin`):**
- 6 summary cards (users, income, expense, balance, transactions, new users)
- Monthly bar chart (all users)
- Top 5 users table

**Admin Users (`/admin/users`):**
- Search + status filter tabs
- Users table with stats per user
- CRUD: Create/Edit/Delete modals, block/unblock toggle

**Admin Finance (`/admin/finance`):**
- User filter dropdown
- Summary cards
- Bar chart + Pie chart
- Per-user financial summary table

**Admin Settings (`/admin/settings`):**
- Theme toggle
- Notification toggles
- Admin profile update form

---

## Theming System

### CSS Custom Properties

All colors defined in `src/styles/variables.css`:

```css
:root {
  /* Light mode defaults */
  --color-bg, --color-bg-secondary, --color-bg-tertiary
  --color-sidebar, --color-sidebar-hover
  --color-text-primary, --color-text-secondary, --color-text-muted
  --color-border, --color-border-light
  --color-primary, --color-secondary
  --color-success, --color-danger, --color-warning, --color-info
  /* Card gradients, shadows, radius, layout, transitions */
}

[data-theme='dark'] {
  /* Dark mode overrides */
}
```

Theme applied via `document.documentElement.setAttribute('data-theme', theme)` in ThemeContext.

---

## Data Models

### User
```js
{
  id: string,
  fullName: string,
  email: string,
  password: string,       // plain text (demo only)
  role: 'admin' | 'user',
  avatar: string | null,  // base64 data URL
  createdAt: string,      // ISO date
  status: 'active' | 'inactive',
}
```

### Income / Expense (Transaction)
```js
{
  id: string,
  userId: string,
  title: string,
  amount: number,
  category: string,
  date: string,           // ISO date YYYY-MM-DD
  description: string,
  type?: 'income' | 'expense',  // added at runtime
}
```

---

## LocalStorage Keys

| Key             | Content                        |
|-----------------|--------------------------------|
| `pfm_users`     | Array of User objects          |
| `pfm_user`      | Current logged-in user (remember me) |
| `pfm_incomes`   | Array of Income objects        |
| `pfm_expenses`  | Array of Expense objects       |
| `pfm_theme`     | `'light'` or `'dark'`          |
| `pfm_notifications` | Notification settings object |

---

## Routing Structure

```
/                    → LandingPage (public)
/login               → LoginPage (PublicRoute — redirect if logged in)
/register            → RegisterPage (PublicRoute)
/dashboard           → DashboardPage (ProtectedRoute)
/income              → IncomePage (ProtectedRoute)
/expense             → ExpensePage (ProtectedRoute)
/transactions        → TransactionsPage (ProtectedRoute)
/statistics          → StatisticsPage (ProtectedRoute)
/profile             → ProfilePage (ProtectedRoute)
/settings            → SettingsPage (ProtectedRoute)
/admin               → AdminDashboard (AdminRoute)
/admin/users         → AdminUsers (AdminRoute)
/admin/finance       → AdminFinance (AdminRoute)
/admin/settings      → AdminSettings (AdminRoute)
*                    → NotFound (404)
```

---

## Responsive Breakpoints

| Breakpoint | Width    | Layout Change                          |
|------------|----------|----------------------------------------|
| Mobile     | < 768px  | Single column, hamburger menu          |
| Tablet     | 768px+   | 2-column grids, collapsible sidebar    |
| Desktop    | 1024px+  | Fixed sidebar (256px), full layout     |

---

## Component Inventory

### Shared Components
| Component         | Purpose                                      |
|-------------------|----------------------------------------------|
| `DashboardCards`  | Balance/Income/Expense summary cards         |
| `TransactionTable`| Sortable table with delete action            |
| `ChartContainer`  | Wrapper + MonthlyBarChart + MonthlyLineChart + ExpensePieChart |
| `IncomeForm`      | Add income form                              |
| `ExpenseForm`     | Add expense form                             |
| `FilterPanel`     | Category + date range filters                |
| `SearchBar`       | Debounced search input                       |
| `Pagination`      | Page navigation                              |
| `Modal`           | Accessible modal dialog                      |
| `Loader`          | Loading spinner                              |
| `Sidebar`         | User dashboard navigation                    |
| `Navbar`          | Top navigation bar                           |
| `AdminSidebar`    | Admin panel navigation                       |
| `AdminNavbar`     | Admin top bar                                |
| `Footer`          | Landing page footer                          |
| `ProfileCard`     | User profile display card                    |
| `SettingsPanel`   | Settings section wrapper                     |
| `StatisticsCard`  | Statistics metric card                       |
