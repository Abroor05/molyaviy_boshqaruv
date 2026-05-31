const { verifyAccessToken } = require('../config/jwt');
const prisma = require('../config/prisma');

// ── Authenticate ──────────────────────────────────────────────────────────────
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Token topilmadi' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, fullName: true, email: true, role: true, status: true, avatar: true },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Foydalanuvchi topilmadi' });
    }
    if (user.status === 'INACTIVE') {
      return res.status(403).json({ success: false, message: 'Hisobingiz bloklangan' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token muddati tugagan', expired: true });
    }
    return res.status(401).json({ success: false, message: 'Token noto\'g\'ri' });
  }
};

// ── Admin only ────────────────────────────────────────────────────────────────
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Admin huquqi talab etiladi' });
  }
  next();
};

// ── Owner or Admin ────────────────────────────────────────────────────────────
const ownerOrAdmin = (paramName = 'userId') => (req, res, next) => {
  const targetId = req.params[paramName];
  if (req.user.role === 'ADMIN' || req.user.id === targetId) {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Ruxsat yo\'q' });
};

module.exports = { authenticate, adminOnly, ownerOrAdmin };
