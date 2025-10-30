const walletRepository = require('../repositories/walletRepository');
const transactionRepository = require('../repositories/transactionRepository');
const referenceRepository = require('../repositories/referenceRepository');
const { topUpSchema, transactionSchema, transactionHistorySchema } = require('../validations/transactionValidation');

class TransactionController {
  // Get balance endpoint
  async getBalance(req, res) {
    try {
      const userId = req.user.id;
      
      const wallet = await walletRepository.getBalanceByUserId(userId);
      
      if (!wallet) {
        return res.status(404).json({
          status: 404,
          message: 'Wallet not found'
        });
      }
      
      res.status(200).json({
        status: 0,
        message: 'Get Balance Berhasil',
        data: {
          balance: parseInt(wallet.balance)
        }
      });
      
    } catch (error) {
      console.error('Get balance error:', error);
      res.status(500).json({
        status: 500,
        message: 'Internal server error'
      });
    }
  }
  
  // Top-up endpoint
  async topUp(req, res) {
    try {
      // Validate input
      const { error, value } = topUpSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          status: 400,
          message: error.details[0].message
        });
      }
      
      const { top_up_amount } = value;
      const userId = req.user.id;
      
      // Create top-up transaction
      const result = await transactionRepository.createTopUpTransaction(
        userId, 
        top_up_amount,
        `Top Up balance`
      );
      
      res.status(200).json({
        status: 0,
        message: 'Top Up Balance berhasil',
        data: {
          balance: parseInt(result.balance)
        }
      });
      
    } catch (error) {
      console.error('Top-up error:', error);
      
      if (error.message === 'Wallet not found') {
        return res.status(404).json({
          status: 404,
          message: 'Wallet tidak ditemukan'
        });
      }
      
      res.status(500).json({
        status: 500,
        message: 'Internal server error'
      });
    }
  }
  
  // Transaction/Payment endpoint
  async createTransaction(req, res) {
    try {
      // Validate input
      const { error, value } = transactionSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          status: 400,
          message: error.details[0].message
        });
      }
      
      const { service_code } = value;
      const userId = req.user.id;
      
      // Get service details
      const service = await referenceRepository.getServiceByCode(service_code);
      
      if (!service) {
        return res.status(400).json({
          status: 400,
          message: 'Service atau Layanan tidak ditemukan'
        });
      }
      
      const amount = parseInt(service.service_tariff);
      
      // Create payment transaction
      const result = await transactionRepository.createPaymentTransaction(
        userId,
        service_code,
        amount,
        `${service.service_name}`
      );
      
      res.status(200).json({
        status: 0,
        message: 'Transaksi berhasil',
        data: {
          invoice_number: result.transaction.invoice_number,
          service_code: service_code,
          service_name: service.service_name,
          transaction_type: 'PAYMENT',
          total_amount: amount,
          created_on: result.transaction.created_at
        }
      });
      
    } catch (error) {
      console.error('Transaction error:', error);
      
      if (error.message === 'Insufficient balance') {
        return res.status(400).json({
          status: 400,
          message: 'Balance tidak mencukupi'
        });
      }
      
      if (error.message === 'Wallet not found') {
        return res.status(404).json({
          status: 404,
          message: 'Wallet tidak ditemukan'
        });
      }
      
      res.status(500).json({
        status: 500,
        message: 'Internal server error'
      });
    }
  }
  
  // Transaction history endpoint
  async getTransactionHistory(req, res) {
    try {
      // Validate query parameters
      const { error, value } = transactionHistorySchema.validate(req.query);
      
      if (error) {
        return res.status(400).json({
          status: 400,
          message: error.details[0].message
        });
      }
      
      const { offset, limit } = value;
      const userId = req.user.id;
      
      // Get transaction history
      const transactions = await transactionRepository.getTransactionHistory(userId, limit, offset);
      
      // Format response data
      const formattedTransactions = transactions.map(transaction => ({
        invoice_number: transaction.invoice_number,
        transaction_type: transaction.transaction_type,
        description: transaction.description,
        total_amount: parseInt(transaction.amount),
        created_on: transaction.created_at
      }));
      
      res.status(200).json({
        status: 0,
        message: 'Get History Berhasil',
        data: {
          offset: offset,
          limit: limit,
          records: formattedTransactions
        }
      });
      
    } catch (error) {
      console.error('Transaction history error:', error);
      res.status(500).json({
        status: 500,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new TransactionController();
