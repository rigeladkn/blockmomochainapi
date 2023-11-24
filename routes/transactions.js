const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const authMiddleware = require('../middlewares/authMiddleware');
router.post('/',[authMiddleware.checkAuthenticated],transactionController.sendTransaction);
router.get('/',[authMiddleware.checkAuthenticated],transactionController.getUserTransactions);

module.exports = router;
 