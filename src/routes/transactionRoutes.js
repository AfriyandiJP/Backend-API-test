const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');

// All transaction routes require authentication
router.use(authMiddleware);

// Wallet/Balance routes
router.get('/balance', transactionController.getBalance);
router.post('/topup', transactionController.topUp);

// Transaction routes
router.post('/transaction', transactionController.createTransaction);
router.get('/transaction/history', transactionController.getTransactionHistory);

module.exports = router;
