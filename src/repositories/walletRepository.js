const pool = require('../config/db');

class WalletRepository {
  // Get user balance
  async getBalanceByUserId(userId) {
    const query = `
      SELECT balance 
      FROM wallets 
      WHERE user_id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0] || null;
  }
  
  // Update balance (for top-up)
  async updateBalance(userId, amount) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Update wallet balance
      const updateQuery = `
        UPDATE wallets 
        SET balance = balance + $1, updated_at = NOW()
        WHERE user_id = $2
        RETURNING balance
      `;
      const result = await client.query(updateQuery, [amount, userId]);
      
      if (result.rows.length === 0) {
        throw new Error('Wallet not found');
      }
      
      await client.query('COMMIT');
      return result.rows[0];
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  // Deduct balance (for payments) - with balance check
  async deductBalance(userId, amount) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Check current balance first
      const checkQuery = `
        SELECT balance 
        FROM wallets 
        WHERE user_id = $1
      `;
      const checkResult = await client.query(checkQuery, [userId]);
      
      if (checkResult.rows.length === 0) {
        throw new Error('Wallet not found');
      }
      
      const currentBalance = parseInt(checkResult.rows[0].balance);
      
      if (currentBalance < amount) {
        throw new Error('Insufficient balance');
      }
      
      // Deduct balance
      const updateQuery = `
        UPDATE wallets 
        SET balance = balance - $1, updated_at = NOW()
        WHERE user_id = $2
        RETURNING balance
      `;
      const result = await client.query(updateQuery, [amount, userId]);
      
      await client.query('COMMIT');
      return result.rows[0];
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  // Create wallet for new user (used in user registration)
  async createWallet(userId) {
    const query = `
      INSERT INTO wallets (user_id, balance)
      VALUES ($1, 0)
      RETURNING user_id, balance
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }
}

module.exports = new WalletRepository();
