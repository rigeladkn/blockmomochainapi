const express = require('express');
const router = express.Router();
const balanceController = require('../controllers/balance.controller');
// const authMiddleware = require('../middlewares/authMiddleware');
router.get('/:userId',balanceController.getUserBalance);

module.exports = router;