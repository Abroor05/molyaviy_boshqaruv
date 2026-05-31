const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');

// ── Get all users ─────────────────────────────────────────────────────────────
const getAllUsers = async (req, res, next) => {
  try {
    const { search, status, role, page = 1, limit = 20 } = req.query;

    const where = {};
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email:    { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) where.status = status.toUpperCase();
    if (role)   where.role   = role.toUpperCase();

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true, fullName: true, email: true, role: true,
          status: true, avatar: true, createdAt: true,
          _count: { select: { incomes: true, expenses: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: { users, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    next(err);
  }
};

// ── Get user by ID ────────────────────────────────────────────────────────────
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true, fullName: true, email: true, role: true,
        status: true, avatar: true, createdAt: true,
        incomes:  { orderBy: { date: 'desc' }, take: 10 },
        expenses: { orderBy: { date: 'desc' }, take: 10 },
        _count: { select: { incomes: true, expenses: true } },
      },
    });

    if (!user) return res.status(404).json({ success: false, message: 'Foydalanuvchi topilmadi' });

    // Totals
    const [incomeAgg, expenseAgg] = await Promise.all([
      prisma.income.aggregate({ where: { userId: id }, _sum: { amount: true } }),
      prisma.expense.aggregate({ where: { userId: id }, _sum: { amount: true } }),
    ]);

    res.json({
      success: true,
      data: {
        user,
        stats: {
          totalIncome:  incomeAgg._sum.amount  || 0,
          totalExpense: expenseAgg._sum.amount || 0,
          balance: (incomeAgg._sum.amount || 0) - (expenseAgg._sum.amount || 0),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── Create user ───────────────────────────────────────────────────────────────
const createUser = async (req, res, next) => {
  try {
    const { fullName, email, password, role = 'USER' } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ success: false, message: 'Bu email allaqachon mavjud' });

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { fullName, email, password: hashed, role: role.toUpperCase(), status: 'ACTIVE' },
      select: { id: true, fullName: true, email: true, role: true, status: true, createdAt: true },
    });

    res.status(201).json({ success: true, message: 'Foydalanuvchi yaratildi', data: { user } });
  } catch (err) {
    next(err);
  }
};

// ── Update user ───────────────────────────────────────────────────────────────
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullName, email, role, status, password } = req.body;

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email)    updateData.email    = email;
    if (role)     updateData.role     = role.toUpperCase();
    if (status)   updateData.status   = status.toUpperCase();
    if (password) updateData.password = await bcrypt.hash(password, 12);

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, fullName: true, email: true, role: true, status: true, createdAt: true },
    });

    res.json({ success: true, message: 'Foydalanuvchi yangilandi', data: { user } });
  } catch (err) {
    next(err);
  }
};

// ── Delete user ───────────────────────────────────────────────────────────────
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({ success: false, message: 'O\'zingizni o\'chira olmaysiz' });
    }

    await prisma.user.delete({ where: { id } });
    res.json({ success: true, message: 'Foydalanuvchi o\'chirildi' });
  } catch (err) {
    next(err);
  }
};

// ── Toggle user status ────────────────────────────────────────────────────────
const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ success: false, message: 'Foydalanuvchi topilmadi' });

    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const updated = await prisma.user.update({
      where: { id },
      data: { status: newStatus },
      select: { id: true, fullName: true, status: true },
    });

    res.json({
      success: true,
      message: `Foydalanuvchi ${newStatus === 'ACTIVE' ? 'faollashtirildi' : 'bloklandi'}`,
      data: { user: updated },
    });
  } catch (err) {
    next(err);
  }
};

// ── Admin dashboard stats ─────────────────────────────────────────────────────
const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers, activeUsers, newUsersThisMonth,
      totalIncomeAgg, totalExpenseAgg,
      monthlyIncomeAgg, monthlyExpenseAgg,
      totalTransactions,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.user.count({ where: { role: 'USER', status: 'ACTIVE' } }),
      prisma.user.count({ where: { role: 'USER', createdAt: { gte: startOfMonth } } }),
      prisma.income.aggregate({ _sum: { amount: true } }),
      prisma.expense.aggregate({ _sum: { amount: true } }),
      prisma.income.aggregate({ where: { date: { gte: startOfMonth } }, _sum: { amount: true } }),
      prisma.expense.aggregate({ where: { date: { gte: startOfMonth } }, _sum: { amount: true } }),
      prisma.income.count().then(i => prisma.expense.count().then(e => i + e)),
    ]);

    // Monthly chart data (last 6 months)
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const [incomes, expenses] = await Promise.all([
      prisma.income.findMany({ where: { date: { gte: sixMonthsAgo } }, select: { amount: true, date: true } }),
      prisma.expense.findMany({ where: { date: { gte: sixMonthsAgo } }, select: { amount: true, date: true } }),
    ]);

    const monthlyMap = {};
    incomes.forEach(i => {
      const key = `${i.date.getFullYear()}-${String(i.date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyMap[key]) monthlyMap[key] = { income: 0, expense: 0 };
      monthlyMap[key].income += i.amount;
    });
    expenses.forEach(e => {
      const key = `${e.date.getFullYear()}-${String(e.date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyMap[key]) monthlyMap[key] = { income: 0, expense: 0 };
      monthlyMap[key].expense += e.amount;
    });

    const monthlyChart = Object.entries(monthlyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, ...data }));

    res.json({
      success: true,
      data: {
        users: { total: totalUsers, active: activeUsers, newThisMonth: newUsersThisMonth },
        finance: {
          totalIncome:   totalIncomeAgg._sum.amount  || 0,
          totalExpense:  totalExpenseAgg._sum.amount || 0,
          balance: (totalIncomeAgg._sum.amount || 0) - (totalExpenseAgg._sum.amount || 0),
          monthlyIncome:  monthlyIncomeAgg._sum.amount  || 0,
          monthlyExpense: monthlyExpenseAgg._sum.amount || 0,
          totalTransactions,
        },
        monthlyChart,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── Get all transactions (admin) ──────────────────────────────────────────────
const getAllTransactions = async (req, res, next) => {
  try {
    const { userId, limit = 500 } = req.query;

    const where = userId ? { userId } : {};

    const [incomes, expenses] = await Promise.all([
      prisma.income.findMany({
        where,
        orderBy: { date: 'desc' },
        take: parseInt(limit),
        select: {
          id: true, title: true, amount: true, category: true,
          date: true, description: true, userId: true,
        },
      }),
      prisma.expense.findMany({
        where,
        orderBy: { date: 'desc' },
        take: parseInt(limit),
        select: {
          id: true, title: true, amount: true, category: true,
          date: true, description: true, userId: true,
        },
      }),
    ]);

    res.json({
      success: true,
      data: { incomes, expenses },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser, toggleUserStatus, getDashboardStats, getAllTransactions };
