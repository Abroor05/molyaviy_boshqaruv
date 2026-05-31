require('dotenv').config();

const express = require('express');
const cors    = require('cors');

const authRoutes    = require('./routes/auth.routes');
const incomeRoutes  = require('./routes/income.routes');
const expenseRoutes = require('./routes/expense.routes');
const statsRoutes   = require('./routes/stats.routes');
const adminRoutes   = require('./routes/admin.routes');

const { errorHandler, notFound } = require('./middlewares/error.middleware');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middlewares ───────────────────────────────────────────────────────────────
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server ishlayapti', timestamp: new Date().toISOString() });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/incomes',  incomeRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/stats',    statsRoutes);
app.use('/api/admin',    adminRoutes);

// ── 404 & Error handlers ──────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server http://localhost:${PORT} da ishlamoqda`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
