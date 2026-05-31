const express = require('express');
const router  = express.Router();

const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats,
} = require('../controllers/expense.controller');

const { authenticate }  = require('../middlewares/auth.middleware');
const validate          = require('../middlewares/validate.middleware');
const { expenseSchema } = require('../validations/transaction.validation');

// All routes require authentication
router.use(authenticate);

router.get('/',        getExpenses);
router.get('/stats',   getExpenseStats);
router.post('/',       validate(expenseSchema), createExpense);
router.put('/:id',     validate(expenseSchema), updateExpense);
router.delete('/:id',  deleteExpense);

module.exports = router;
