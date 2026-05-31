const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../config/jwt');

// ── Register ──────────────────────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: "Bu email allaqachon ro'yxatdan o'tgan" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { fullName, email, password: hashedPassword, role: 'USER', status: 'ACTIVE' },
      select: { id: true, fullName: true, email: true, role: true, status: true, avatar: true, createdAt: true },
    });

    const accessToken  = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

    res.status(201).json({
      success: true,
      message: "Ro'yxatdan o'tish muvaffaqiyatli",
      data: { user, accessToken, refreshToken },
    });
  } catch (err) {
    next(err);
  }
};

// ── Login ─────────────────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: "Email yoki parol noto'g'ri" });
    }
    if (user.status === 'INACTIVE') {
      return res.status(403).json({ success: false, message: "Hisobingiz bloklangan. Admin bilan bog'laning." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Email yoki parol noto'g'ri" });
    }

    const accessToken  = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

    const { password: _, refreshToken: __, ...safeUser } = user;

    res.json({
      success: true,
      message: 'Kirish muvaffaqiyatli',
      data: { user: safeUser, accessToken, refreshToken },
    });
  } catch (err) {
    next(err);
  }
};

// ── Refresh Token ─────────────────────────────────────────────────────────────
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Refresh token topilmadi' });
    }

    const decoded = verifyRefreshToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ success: false, message: 'Token noto\'g\'ri' });
    }

    const newAccessToken  = generateAccessToken({ id: user.id, role: user.role });
    const newRefreshToken = generateRefreshToken({ id: user.id });

    await prisma.user.update({ where: { id: user.id }, data: { refreshToken: newRefreshToken } });

    res.json({
      success: true,
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Refresh token muddati tugagan, qayta kiring' });
    }
    next(err);
  }
};

// ── Logout ────────────────────────────────────────────────────────────────────
const logout = async (req, res, next) => {
  try {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { refreshToken: null },
    });
    res.json({ success: true, message: 'Chiqish muvaffaqiyatli' });
  } catch (err) {
    next(err);
  }
};

// ── Get Me ────────────────────────────────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, fullName: true, email: true, role: true, status: true, avatar: true, createdAt: true },
    });
    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
};

// ── Update Profile ────────────────────────────────────────────────────────────
const updateProfile = async (req, res, next) => {
  try {
    const { fullName, email, avatar } = req.body;
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email)    updateData.email    = email;
    if (avatar !== undefined) updateData.avatar = avatar;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: { id: true, fullName: true, email: true, role: true, status: true, avatar: true, createdAt: true },
    });

    res.json({ success: true, message: 'Profil yangilandi', data: { user } });
  } catch (err) {
    next(err);
  }
};

// ── Change Password ───────────────────────────────────────────────────────────
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Joriy parol noto'g'ri" });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: req.user.id }, data: { password: hashed } });

    res.json({ success: true, message: 'Parol muvaffaqiyatli o\'zgartirildi' });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, refreshToken, logout, getMe, updateProfile, changePassword };
