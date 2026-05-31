const prisma = require('../config/prisma');

// ── User statistics ───────────────────────────────────────────────────────────
const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { months = 6 } = req.query;

    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - parseInt(months) + 1, 1);

    // Monthly income & expense
    const [incomes, expenses] = await Promise.all([
      prisma.income.findMany({
        where: { userId, date: { gte: startDate } },
        select: { amount: true, date: true, category: true },
      }),
      prisma.expense.findMany({
        where: { userId, date: { gte: startDate } },
        select: { amount: true, date: true, category: true },
      }),
    ]);

    // Group by month
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

    const monthly = Object.entries(monthlyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, ...data, net: data.income - data.expense }));

    // Category breakdown
    const expenseByCategory = {};
    expenses.forEach(e => {
      expenseByCategory[e.category] = (expenseByCategory[e.category] || 0) + e.amount;
    });

    // Totals
    const totalIncome  = incomes.reduce((s, i) => s + i.amount, 0);
    const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);

    res.json({
      success: true,
      data: {
        monthly,
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        expenseByCategory: Object.entries(expenseByCategory)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value),
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUserStats };
