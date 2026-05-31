import { generateId } from '../utils/formatters.js';

// ===== DUMMY USERS =====
export const dummyUsers = [
  {
    id: 'user_1',
    fullName: 'Alisher Nazarov',
    email: 'alisher@example.com',
    password: 'password123',
    avatar: null,
    joinDate: '2024-01-15',
    phone: '+998 90 123 45 67',
    bio: 'Software developer & finance enthusiast',
  },
  {
    id: 'user_2',
    fullName: 'Malika Yusupova',
    email: 'malika@example.com',
    password: 'password123',
    avatar: null,
    joinDate: '2024-02-20',
    phone: '+998 91 234 56 78',
    bio: 'Entrepreneur & investor',
  },
];

// ===== DUMMY TRANSACTIONS =====
const now = new Date();
const y = now.getFullYear();
const m = now.getMonth();

function makeDate(monthOffset, day) {
  const d = new Date(y, m + monthOffset, day);
  return d.toISOString().split('T')[0];
}

export const dummyTransactions = [
  // Current month - Income
  { id: generateId(), type: 'income', title: 'Monthly Salary', amount: 3500, category: 'salary', date: makeDate(0, 1), description: 'Regular monthly salary from company', userId: 'user_1' },
  { id: generateId(), type: 'income', title: 'Freelance Project', amount: 850, category: 'freelance', date: makeDate(0, 5), description: 'Web development project for client', userId: 'user_1' },
  { id: generateId(), type: 'income', title: 'Stock Dividends', amount: 320, category: 'investment', date: makeDate(0, 8), description: 'Quarterly dividend payment', userId: 'user_1' },
  { id: generateId(), type: 'income', title: 'Rental Income', amount: 600, category: 'rental', date: makeDate(0, 10), description: 'Monthly apartment rental', userId: 'user_1' },

  // Current month - Expenses
  { id: generateId(), type: 'expense', title: 'Grocery Shopping', amount: 280, category: 'food', date: makeDate(0, 2), description: 'Weekly groceries from supermarket', userId: 'user_1' },
  { id: generateId(), type: 'expense', title: 'Electricity Bill', amount: 95, category: 'utilities', date: makeDate(0, 3), description: 'Monthly electricity payment', userId: 'user_1' },
  { id: generateId(), type: 'expense', title: 'Netflix Subscription', amount: 15, category: 'entertainment', date: makeDate(0, 4), description: 'Monthly streaming subscription', userId: 'user_1' },
  { id: generateId(), type: 'expense', title: 'Apartment Rent', amount: 900, category: 'rent', date: makeDate(0, 1), description: 'Monthly apartment rent', userId: 'user_1' },
  { id: generateId(), type: 'expense', title: 'Gym Membership', amount: 45, category: 'health', date: makeDate(0, 6), description: 'Monthly gym subscription', userId: 'user_1' },
  { id: generateId(), type: 'expense', title: 'Online Course', amount: 129, category: 'education', date: makeDate(0, 9), description: 'React advanced course on Udemy', userId: 'user_1' },
  { id: generateId(), type: 'expense', title: 'Taxi Rides', amount: 68, category: 'transport', date: makeDate(0, 11), description: 'Various taxi rides this month', userId: 'user_1' },
  { id: generateId(), type: 'expense', title: 'Clothes Shopping', amount: 210, category: 'shopping', date: makeDate(0, 13), description: 'New season wardrobe update', userId: 'user_1' },
  { id: generateId(), type: 'expense', title: 'Doctor Visit', amount: 80, category: 'health', date: makeDate(0, 14), description: 'Annual health checkup', userId: 'user_1' },
  { id: generateId(), type: 'expense', title: 'Internet Bill', amount: 40, category: 'utilities', date: makeDate(0, 15), description: 'Monthly internet subscription', userId: 'user_1' },

  // Last month - Income
  { id: generateId(), type: 'income', title: 'Monthly Salary', amount: 3500, category: 'salary', date: makeDate(-1, 1), description: 'Regular monthly salary', userId: 'user_1' },
  { id: generateId(), type: 'income', title: 'Freelance Design', amount: 450, category: 'freelance', date: makeDate(-1, 12), description: 'Logo design project', userId: 'user_1' },
  { id: generateId(), type: 'income', title: 'Birthday Gift', amount: 200, category: 'gift', date: makeDate(-1, 20), description: 'Birthday money from family', userId: 'user_1' },

  // Last month - Expenses
  { id: generateId(), type: 'expense', title: 'Grocery Shopping', amount: 310, category: 'food', date: makeDate(-1, 5), description: 'Monthly groceries', userId: 'user_1' },
  { id: generateId(), type: 'expense', title: 'Apartment Rent', amount: 900, category: 'rent', date: makeDate(-1, 1), description: 'Monthly apartment rent', userId: 'user_1' },
  { id: generateId(), type: 'expense', title: 'Car Insurance', amount: 150, category: 'insurance', date: makeDate(-1, 8), description: 'Quarterly car insurance', userId: 'user_1' },
  { id: generateId(), type: 'expense', title: 'Restaurant Dinner', amount: 95, category: 'food', date: makeDate(-1, 15), description: 'Family dinner at restaurant', userId: 'user_1' },
  { id: generateId(), type: 'expense', title: 'Phone Bill', amount: 35, category: 'utilities', date: makeDate(-1, 3), description: 'Monthly phone plan', userId: 'user_1' },
  { id: generateId(), type: 'expense', title: 'Movie Tickets', amount: 42, category: 'entertainment', date: makeDate(-1, 22), description: 'Cinema with friends', userId: 'user_1' },

  // 2 months ago - Income
  { id: generateId(), type: 'income', title: 'Monthly Salary', amount: 3500, category: 'salary', date: makeDate(-2, 1), description: 'Regular monthly salary', userId: 'user_1' },
  { id: generateId(), type: 'income', title: 'Investment Return', amount: 780, category: 'investment', date: makeDate(-2, 18), description: 'Crypto portfolio gains', userId: 'user_1' },
  { id: generateId(), type: 'income', title: 'Freelance App', amount: 1200, category: 'freelance', date: makeDate(-2, 25), description: 'Mobile app development', userId: 'user_1' },

  // 2 months ago - Expenses
  { id: generateId(), type: 'expense', title: 'Apartment Rent', amount: 900, category: 'rent', date: makeDate(-2, 1), description: 'Monthly apartment rent', userId: 'user_1' },
  { id: generateId(), type: 'expense', title: 'Grocery Shopping', amount: 265, category: 'food', date: makeDate(-2, 7), description: 'Monthly groceries', userId: 'user_1' },
  { id: generateId(), type: 'expense', title: 'New Laptop', amount: 1200, category: 'shopping', date: makeDate(-2, 14), description: 'Work laptop upgrade', userId: 'user_1' },
  { id: generateId(), type: 'expense', title: 'Electricity Bill', amount: 88, category: 'utilities', date: makeDate(-2, 4), description: 'Monthly electricity', userId: 'user_1' },
  { id: generateId(), type: 'expense', title: 'Gym Membership', amount: 45, category: 'health', date: makeDate(-2, 6), description: 'Monthly gym', userId: 'user_1' },

  // 3 months ago
  { id: generateId(), type: 'income', title: 'Monthly Salary', amount: 3200, category: 'salary', date: makeDate(-3, 1), description: 'Regular monthly salary', userId: 'user_1' },
  { id: generateId(), type: 'income', title: 'Rental Income', amount: 600, category: 'rental', date: makeDate(-3, 10), description: 'Monthly apartment rental', userId: 'user_1' },
  { id: generateId(), type: 'expense', title: 'Apartment Rent', amount: 900, category: 'rent', date: makeDate(-3, 1), description: 'Monthly apartment rent', userId: 'user_1' },
  { id: generateId(), type: 'expense', title: 'Grocery Shopping', amount: 290, category: 'food', date: makeDate(-3, 8), description: 'Monthly groceries', userId: 'user_1' },
  { id: generateId(), type: 'expense', title: 'Health Insurance', amount: 200, category: 'insurance', date: makeDate(-3, 5), description: 'Monthly health insurance', userId: 'user_1' },
  { id: generateId(), type: 'expense', title: 'Books', amount: 75, category: 'education', date: makeDate(-3, 20), description: 'Programming books', userId: 'user_1' },

  // 4 months ago
  { id: generateId(), type: 'income', title: 'Monthly Salary', amount: 3200, category: 'salary', date: makeDate(-4, 1), description: 'Regular monthly salary', userId: 'user_1' },
  { id: generateId(), type: 'income', title: 'Freelance Project', amount: 650, category: 'freelance', date: makeDate(-4, 15), description: 'Backend API development', userId: 'user_1' },
  { id: generateId(), type: 'expense', title: 'Apartment Rent', amount: 900, category: 'rent', date: makeDate(-4, 1), description: 'Monthly apartment rent', userId: 'user_1' },
  { id: generateId(), type: 'expense', title: 'Grocery Shopping', amount: 305, category: 'food', date: makeDate(-4, 6), description: 'Monthly groceries', userId: 'user_1' },
  { id: generateId(), type: 'expense', title: 'Vacation Trip', amount: 850, category: 'entertainment', date: makeDate(-4, 18), description: 'Weekend trip to mountains', userId: 'user_1' },

  // 5 months ago
  { id: generateId(), type: 'income', title: 'Monthly Salary', amount: 3200, category: 'salary', date: makeDate(-5, 1), description: 'Regular monthly salary', userId: 'user_1' },
  { id: generateId(), type: 'income', title: 'Stock Dividends', amount: 280, category: 'investment', date: makeDate(-5, 12), description: 'Quarterly dividend', userId: 'user_1' },
  { id: generateId(), type: 'expense', title: 'Apartment Rent', amount: 900, category: 'rent', date: makeDate(-5, 1), description: 'Monthly apartment rent', userId: 'user_1' },
  { id: generateId(), type: 'expense', title: 'Grocery Shopping', amount: 275, category: 'food', date: makeDate(-5, 5), description: 'Monthly groceries', userId: 'user_1' },
  { id: generateId(), type: 'expense', title: 'New Phone', amount: 699, category: 'shopping', date: makeDate(-5, 22), description: 'Smartphone upgrade', userId: 'user_1' },
];

// ===== TESTIMONIALS =====
export const testimonials = [
  {
    id: 1,
    name: 'Bobur Toshmatov',
    role: 'Software Engineer',
    avatar: null,
    initials: 'BT',
    rating: 5,
    text: 'This app completely changed how I manage my finances. The dashboard gives me a clear picture of where my money goes every month.',
  },
  {
    id: 2,
    name: 'Nilufar Rashidova',
    role: 'Business Owner',
    avatar: null,
    initials: 'NR',
    rating: 5,
    text: 'The statistics charts are incredibly helpful. I can now see my spending patterns and make smarter financial decisions.',
  },
  {
    id: 3,
    name: 'Jasur Mirzayev',
    role: 'Freelancer',
    avatar: null,
    initials: 'JM',
    rating: 5,
    text: 'As a freelancer with irregular income, tracking everything in one place is a game changer. Highly recommend!',
  },
  {
    id: 4,
    name: 'Zulfiya Karimova',
    role: 'Marketing Manager',
    avatar: null,
    initials: 'ZK',
    rating: 4,
    text: 'Clean interface, easy to use, and the dark mode is perfect for late-night budget reviews. Love it!',
  },
];

// ===== STATS FOR LANDING PAGE =====
export const landingStats = [
  { id: 1, value: 50000, suffix: '+', label: 'Active Users', icon: '👥' },
  { id: 2, value: 2, suffix: 'M+', label: 'Transactions Tracked', icon: '📊' },
  { id: 3, value: 98, suffix: '%', label: 'User Satisfaction', icon: '⭐' },
  { id: 4, value: 150, suffix: '+', label: 'Countries', icon: '🌍' },
];

// ===== SERVICES FOR LANDING PAGE =====
export const services = [
  {
    id: 1,
    icon: '📊',
    title: 'Smart Dashboard',
    description: 'Get a complete overview of your finances with real-time charts and statistics.',
    color: '#6366f1',
  },
  {
    id: 2,
    icon: '💰',
    title: 'Income Tracking',
    description: 'Track all your income sources and understand where your money comes from.',
    color: '#10b981',
  },
  {
    id: 3,
    icon: '💳',
    title: 'Expense Management',
    description: 'Monitor your spending habits and identify areas to save more money.',
    color: '#ef4444',
  },
  {
    id: 4,
    icon: '📈',
    title: 'Financial Analytics',
    description: 'Detailed reports and charts to help you make informed financial decisions.',
    color: '#f59e0b',
  },
  {
    id: 5,
    icon: '🔒',
    title: 'Secure & Private',
    description: 'Your financial data is stored locally and never shared with third parties.',
    color: '#3b82f6',
  },
  {
    id: 6,
    icon: '📱',
    title: 'Responsive Design',
    description: 'Access your finances from any device — desktop, tablet, or mobile.',
    color: '#8b5cf6',
  },
];
