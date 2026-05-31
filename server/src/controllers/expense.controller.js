const prisma = require('../config/prisma');

// ── Get all expenses ──────────────────────────────────────────────────────────
const getExpenses = async (req, res, next) => {
  try {
    const { category, dateFrom, dateTo, search, page = 1, limit = 50, sort = 'date', order = 'desc' } = req.query;

    const where = { userId: req.user.id };

    if (category) where.category = category;
    if (search)   where.title = { contains: search, mode: 'insensitive' };
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo)   where.date.lte = new Date(dateTo + 'T23:59:59');
    }

    const orderBy = { [sort === 'amount' ? 'amount' : 'date']: order };

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        orderBy,
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.expense.count({ where }),
    ]);

    const totalAmount = await prisma.expense.aggregate({
      where: { userId: req.user.id },
      _sum: { amount: true },
    });

    res.json({
      success: true,
      data: {
        expenses,
        total,
        totalAmount: totalAmount._sum.amount || 0,
        page: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── Create expense ────────────────────────────────────────────────────────────
const createExpense = async (req, res, next) => {
  try {
    const { title, amount, category, date, description } = req.body;

    const expense = await prisma.expense.create({
      data: {
        title,
        amount: parseFloat(amount),
        category,
        date: new Date(date),
        description: description || null,
        userId: req.user.id,
      },
    });

    res.status(201).json({ success: true, message: 'Xarajat qo\'shildi', data: { expense } });
  } catch (err) {
    next(err);
  }
};

// ── Update expense ────────────────────────────────────────────────────────────
const updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.expense.findFirst({ where: { id, userId: req.user.id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Xarajat topilmadi' });
    }

    const { title, amount, category, date, description } = req.body;
    const expense = await prisma.expense.update({
      where: { id },
      data: {
        title,
        amount: parseFloat(amount),
        category,
        date: new Date(date),
        description: description || null,
      },
    });

    res.json({ success: true, message: 'Xarajat yangilandi', data: { expense } });
  } catch (err) {
    next(err);
  }
};

// ── Delete expense ────────────────────────────────────────────────────────────
const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.expense.findFirst({ where: { id, userId: req.user.id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Xarajat topilmadi' });
    }

    await prisma.expense.delete({ where: { id } });
    res.json({ success: true, message: 'Xarajat o\'chirildi' });
  } catch (err) {
    next(err);
  }
};

// ── Get expense stats ─────────────────────────────────────────────────────────
const getExpenseStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const [total, monthly, byCategory] = await Promise.all([
      prisma.expense.aggregate({ where: { userId }, _sum: { amount: true }, _count: true }),
      prisma.expense.aggregate({
        where: { userId, date: { gte: startOfMonth, lte: endOfMonth } },
        _sum: { amount: true },
      }),
      prisma.expense.groupBy({
        by: ['category'],
        where: { userId },
        _sum: { amount: true },
        _count: true,
        orderBy: { _sum: { amount: 'desc' } },
      }),
    ]);

    res.json({
      success: true,
      data: {
        total:   total._sum.amount || 0,
        count:   total._count,
        monthly: monthly._sum.amount || 0,
        byCategory: byCategory.map(c => ({
          category: c.category,
          total: c._sum.amount,
          count: c._count,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getExpenses, createExpense, updateExpense, deleteExpense, getExpenseStats };
