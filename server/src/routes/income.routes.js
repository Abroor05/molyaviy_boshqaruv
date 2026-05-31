const express = require('express');
const router  = express.Router();

const {
  getIncomes,
  createIncome,
  updateIncome,
  deleteIncome,
  getIncomeStats,
} = require('../controllers/income.controller');

const { authenticate } = require('../middlewares/auth.middleware');
const validate         = require('../middlewares/validate.middleware');
const { incomeSchema } = require('../validations/transaction.validation');

// All routes require authentication
router.use(authenticate);

router.get('/',         getIncomes);
router.get('/stats',    getIncomeStats);
router.post('/',        validate(incomeSchema), createIncome);
router.put('/:id',      validate(incomeSchema), updateIncome);
router.delete('/:id',   deleteIncome);

module.exports = router;
