const express = require('express');
const router  = express.Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getDashboardStats,
} = require('../controllers/admin.controller');

const { authenticate, adminOnly } = require('../middlewares/auth.middleware');

// All admin routes require authentication + admin role
router.use(authenticate, adminOnly);

router.get('/stats',              getDashboardStats);
router.get('/users',              getAllUsers);
router.get('/users/:id',          getUserById);
router.post('/users',             createUser);
router.put('/users/:id',          updateUser);
router.delete('/users/:id',       deleteUser);
router.patch('/users/:id/status', toggleUserStatus);

module.exports = router;
