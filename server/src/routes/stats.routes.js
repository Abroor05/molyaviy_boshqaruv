const express = require('express');
const router  = express.Router();

const { getUserStats }  = require('../controllers/stats.controller');
const { authenticate }  = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/', getUserStats);

module.exports = router;
