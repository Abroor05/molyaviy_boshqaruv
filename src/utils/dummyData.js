import { generateId } from './helpers';

// ─── Users (role: 'admin' | 'user') ───────────────────────────────────────────
export const dummyUsers = [
  {
    id: 'admin-1',
    fullName: 'Super Admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    avatar: null,
    createdAt: '2024-01-01',
    status: 'active',
  },
  {
    id: 'user-1',
    fullName: 'Alisher Karimov',
    email: 'alisher@example.com',
    password: 'password123',
    role: 'user',
    avatar: null,
    createdAt: '2024-02-15',
    status: 'active',
  },
  {
    id: 'user-2',
    fullName: 'Malika Yusupova',
    email: 'malika@example.com',
    password: 'password123',
    role: 'user',
    avatar: null,
    createdAt: '2024-03-10',
    status: 'active',
  },
  {
    id: 'user-3',
    fullName: 'Bobur Rahimov',
    email: 'bobur@example.com',
    password: 'password123',
    role: 'user',
    avatar: null,
    createdAt: '2024-04-05',
    status: 'inactive',
  },
  {
    id: 'user-4',
    fullName: 'Nilufar Karimova',
    email: 'nilufar@example.com',
    password: 'password123',
    role: 'user',
    avatar: null,
    createdAt: '2024-05-20',
    status: 'active',
  },
];

// ─── Date helpers ──────────────────────────────────────────────────────────────
const today = new Date();
const y = today.getFullYear();
const m = today.getMonth();

const d = (offsetDays) => {
  const date = new Date(y, m, today.getDate() - offsetDays);
  return date.toISOString().split('T')[0];
};

// ─── Incomes (userId tagged) ───────────────────────────────────────────────────
export const dummyIncomes = [
  { id: generateId(), userId: 'user-1', title: 'Oylik maosh',      amount: 5000000, category: 'Maosh',       date: d(1),  description: 'Iyun oyi maoshi' },
  { id: generateId(), userId: 'user-1', title: 'Freelance loyiha', amount: 1500000, category: 'Freelance',   date: d(3),  description: 'Web sayt loyihasi' },
  { id: generateId(), userId: 'user-1', title: 'Ijara daromadi',   amount: 800000,  category: 'Ijara',       date: d(5),  description: 'Kvartira ijarasi' },
  { id: generateId(), userId: 'user-1', title: 'Investitsiya',     amount: 300000,  category: 'Investitsiya',date: d(8),  description: 'Aksiya dividendi' },
  { id: generateId(), userId: 'user-1', title: 'Biznes daromadi',  amount: 2000000, category: 'Biznes',      date: d(10), description: "Do'kon savdosi" },
  { id: generateId(), userId: 'user-1', title: 'Oylik maosh',      amount: 5000000, category: 'Maosh',       date: new Date(y, m-1, 1).toISOString().split('T')[0],  description: 'May maoshi' },
  { id: generateId(), userId: 'user-1', title: 'Freelance',        amount: 1200000, category: 'Freelance',   date: new Date(y, m-1, 10).toISOString().split('T')[0], description: 'Mobile app' },
  { id: generateId(), userId: 'user-1', title: 'Oylik maosh',      amount: 4800000, category: 'Maosh',       date: new Date(y, m-2, 1).toISOString().split('T')[0],  description: 'Aprel maoshi' },

  { id: generateId(), userId: 'user-2', title: 'Oylik maosh',      amount: 4500000, category: 'Maosh',       date: d(2),  description: 'Iyun maoshi' },
  { id: generateId(), userId: 'user-2', title: 'Freelance',        amount: 900000,  category: 'Freelance',   date: d(6),  description: 'Dizayn ishi' },
  { id: generateId(), userId: 'user-2', title: 'Biznes',           amount: 1200000, category: 'Biznes',      date: d(12), description: 'Savdo' },

  { id: generateId(), userId: 'user-3', title: 'Maosh',            amount: 3800000, category: 'Maosh',       date: d(1),  description: 'Iyun' },
  { id: generateId(), userId: 'user-3', title: 'Qo\'shimcha ish',  amount: 600000,  category: 'Freelance',   date: d(7),  description: 'Tarjima' },

  { id: generateId(), userId: 'user-4', title: 'Oylik maosh',      amount: 6000000, category: 'Maosh',       date: d(1),  description: 'Iyun' },
  { id: generateId(), userId: 'user-4', title: 'Investitsiya',     amount: 500000,  category: 'Investitsiya',date: d(4),  description: 'Fond' },
];

// ─── Expenses (userId tagged) ──────────────────────────────────────────────────
export const dummyExpenses = [
  { id: generateId(), userId: 'user-1', title: 'Oziq-ovqat',       amount: 800000,  category: 'Oziq-ovqat', date: d(1),  description: 'Supermarket' },
  { id: generateId(), userId: 'user-1', title: 'Transport',        amount: 200000,  category: 'Transport',  date: d(2),  description: 'Taksi' },
  { id: generateId(), userId: 'user-1', title: 'Kommunal',         amount: 350000,  category: 'Kommunal',   date: d(4),  description: 'Gaz, suv, elektr' },
  { id: generateId(), userId: 'user-1', title: 'Internet',         amount: 120000,  category: 'Internet',   date: d(6),  description: 'Uy interneti' },
  { id: generateId(), userId: 'user-1', title: 'Kiyim',            amount: 600000,  category: 'Kiyim',      date: d(7),  description: 'Yozgi kiyimlar' },
  { id: generateId(), userId: 'user-1', title: 'Restoran',         amount: 250000,  category: "Ko'ngilochar",date: d(9), description: 'Tushlik' },
  { id: generateId(), userId: 'user-1', title: 'Oziq-ovqat',       amount: 750000,  category: 'Oziq-ovqat', date: new Date(y, m-1, 3).toISOString().split('T')[0],  description: 'Bozor' },
  { id: generateId(), userId: 'user-1', title: 'Kommunal',         amount: 320000,  category: 'Kommunal',   date: new Date(y, m-1, 12).toISOString().split('T')[0], description: "To'lovlar" },

  { id: generateId(), userId: 'user-2', title: 'Oziq-ovqat',       amount: 650000,  category: 'Oziq-ovqat', date: d(1),  description: 'Supermarket' },
  { id: generateId(), userId: 'user-2', title: 'Transport',        amount: 180000,  category: 'Transport',  date: d(3),  description: 'Avtobus' },
  { id: generateId(), userId: 'user-2', title: 'Kiyim',            amount: 900000,  category: 'Kiyim',      date: d(8),  description: 'Yangi kiyim' },

  { id: generateId(), userId: 'user-3', title: 'Oziq-ovqat',       amount: 500000,  category: 'Oziq-ovqat', date: d(2),  description: 'Bozor' },
  { id: generateId(), userId: 'user-3', title: 'Kommunal',         amount: 280000,  category: 'Kommunal',   date: d(5),  description: "To'lovlar" },

  { id: generateId(), userId: 'user-4', title: "Ta'lim",           amount: 800000,  category: "Ta'lim",     date: d(1),  description: 'Kurs' },
  { id: generateId(), userId: 'user-4', title: 'Oziq-ovqat',       amount: 700000,  category: 'Oziq-ovqat', date: d(3),  description: 'Supermarket' },
];
