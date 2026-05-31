const express = require('express');
const router  = express.Router();

const {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  updateProfile,
  changePassword,
} = require('../controllers/auth.controller');

const { authenticate }       = require('../middlewares/auth.middleware');
const validate               = require('../middlewares/validate.middleware');
const {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} = require('../validations/auth.validation');

// Public
router.post('/register', validate(registerSchema), register);
router.post('/login',    validate(loginSchema),    login);
router.post('/refresh',  refreshToken);

// Protected
router.post('/logout',          authenticate, logout);
router.get('/me',               authenticate, getMe);
router.put('/profile',          authenticate, updateProfile);
router.put('/change-password',  authenticate, validate(changePasswordSchema), changePassword);

module.exports = router;
