const pool = require('../config/db');

class TransactionRepository {
  // Generate unique invoice number with format INVDDMMYYYY-{running_number}
  async generateInvoiceNumber() {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    const datePrefix = `INV${day}${month}${year}`;
    
    // Get the latest invoice number for today
    const query = `
      SELECT invoice_number 
      FROM transactions 
      WHERE invoice_number LIKE $1 
      ORDER BY id DESC 
      LIMIT 1
    `;
    
    try {
      const result = await pool.query(query, [`${datePrefix}-%`]);
      
      let nextNumber = 1;
      if (result.rows.length > 0) {
        const lastInvoice = result.rows[0].invoice_number;
        // Extract the running number from format INVDDMMYYYY-{number}
        const lastNumber = parseInt(lastInvoice.split('-')[1]) || 0;
        nextNumber = lastNumber + 1;
      }
      
      return `${datePrefix}-${nextNumber.toString().padStart(3, '0')}`;
    } catch (error) {
      console.error('Error generating invoice number:', error);
      // Fallback to timestamp-based if query fails
      const fallback = Date.now().toString().slice(-6);
      return `${datePrefix}-${fallback}`;
    }
  }
  
  // Create top-up transaction
  async createTopUpTransaction(userId, amount, description = null) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const invoiceNumber = await this.generateInvoiceNumber();
      
      // Insert transaction record
      const transactionQuery = `
        INSERT INTO transactions (invoice_number, user_id, transaction_type, service_code, amount, description)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, invoice_number, transaction_type, amount, created_at
      `;
      
      const transactionResult = await client.query(transactionQuery, [
        invoiceNumber,
        userId,
        'TOPUP',
        null, // service_code is null for top-ups
        amount,
        description || 'Top Up Balance'
      ]);
      
      // Update wallet balance
      const walletQuery = `
        UPDATE wallets 
        SET balance = balance + $1, updated_at = NOW()
        WHERE user_id = $2
        RETURNING balance
      `;
      
      const walletResult = await client.query(walletQuery, [amount, userId]);
      
      if (walletResult.rows.length === 0) {
        throw new Error('Wallet not found');
      }
      
      await client.query('COMMIT');
      
      return {
        transaction: transactionResult.rows[0],
        balance: walletResult.rows[0].balance
      };
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  // Create payment transaction
  async createPaymentTransaction(userId, serviceCode, amount, description = null) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Check current balance first
      const balanceQuery = `
        SELECT balance 
        FROM wallets 
        WHERE user_id = $1
      `;
      const balanceResult = await client.query(balanceQuery, [userId]);
      
      if (balanceResult.rows.length === 0) {
        throw new Error('Wallet not found');
      }
      
      const currentBalance = parseInt(balanceResult.rows[0].balance);
      
      if (currentBalance < amount) {
        throw new Error('Insufficient balance');
      }
      
      const invoiceNumber = await this.generateInvoiceNumber();
      
      // Insert transaction record
      const transactionQuery = `
        INSERT INTO transactions (invoice_number, user_id, transaction_type, service_code, amount, description)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, invoice_number, transaction_type, service_code, amount, created_at
      `;
      
      const transactionResult = await client.query(transactionQuery, [
        invoiceNumber,
        userId,
        'PAYMENT',
        serviceCode,
        amount,
        description
      ]);
      
      // Deduct from wallet balance
      const walletQuery = `
        UPDATE wallets 
        SET balance = balance - $1, updated_at = NOW()
        WHERE user_id = $2
        RETURNING balance
      `;
      
      const walletResult = await client.query(walletQuery, [amount, userId]);
      
      await client.query('COMMIT');
      
      return {
        transaction: transactionResult.rows[0],
        balance: walletResult.rows[0].balance
      };
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  // Get transaction history with pagination
  async getTransactionHistory(userId, limit = 10, offset = 0) {
    const query = `
      SELECT 
        t.id,
        t.invoice_number,
        t.transaction_type,
        t.service_code,
        t.amount,
        t.description,
        t.created_at,
        s.service_name
      FROM transactions t
      LEFT JOIN services s ON t.service_code = s.service_code
      WHERE t.user_id = $1
      ORDER BY t.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result = await pool.query(query, [userId, limit, offset]);
    return result.rows;
  }
  
  // Get total transaction count for pagination
  async getTransactionCount(userId) {
    const query = `
      SELECT COUNT(*) as total
      FROM transactions
      WHERE user_id = $1
    `;
    
    const result = await pool.query(query, [userId]);
    return parseInt(result.rows[0].total);
  }
  
  // Get transaction by invoice number
  async getTransactionByInvoice(invoiceNumber, userId = null) {
    let query = `
      SELECT 
        t.id,
        t.invoice_number,
        t.user_id,
        t.transaction_type,
        t.service_code,
        t.amount,
        t.description,
        t.created_at,
        s.service_name
      FROM transactions t
      LEFT JOIN services s ON t.service_code = s.service_code
      WHERE t.invoice_number = $1
    `;
    
    const params = [invoiceNumber];
    
    if (userId) {
      query += ' AND t.user_id = $2';
      params.push(userId);
    }
    
    const result = await pool.query(query, params);
    return result.rows[0] || null;
  }
}

module.exports = new TransactionRepository();
