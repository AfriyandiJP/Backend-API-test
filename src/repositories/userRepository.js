const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class UserRepository {
  // Create new user with wallet
  async createUser(userData) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const { email, password, first_name, last_name } = userData;
      
      // Hash password
      const saltRounds = 12;
      const password_hash = await bcrypt.hash(password, saltRounds);
      
      // Insert user
      const userQuery = `
        INSERT INTO users (email, password_hash, first_name, last_name)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, first_name, last_name, created_at
      `;
      const userResult = await client.query(userQuery, [email, password_hash, first_name, last_name]);
      const user = userResult.rows[0];
      
      // Create wallet for new user
      const walletQuery = `
        INSERT INTO wallets (user_id, balance)
        VALUES ($1, $2)
      `;
      await client.query(walletQuery, [user.id, 0]);
      
      await client.query('COMMIT');
      return user;
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  // Find user by email
  async findUserByEmail(email) {
    const query = `
      SELECT id, email, password_hash, first_name, last_name, profile_image, created_at
      FROM users 
      WHERE email = $1
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }
  
  // Find user by ID
  async findUserById(userId) {
    const query = `
      SELECT id, email, first_name, last_name, profile_image, created_at
      FROM users 
      WHERE id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0] || null;
  }
  
  // Update user profile
  async updateUserProfile(userId, updateData) {
    const { first_name, last_name } = updateData;
    
    const query = `
      UPDATE users 
      SET first_name = $2, last_name = $3, updated_at = NOW()
      WHERE id = $1
      RETURNING id, email, first_name, last_name, profile_image
    `;
    
    const result = await pool.query(query, [userId, first_name, last_name]);
    return result.rows[0] || null;
  }
  
  // Update profile image
  async updateProfileImage(userId, profileImage) {
    const query = `
      UPDATE users 
      SET profile_image = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING id, email, first_name, last_name, profile_image
    `;
    
    const result = await pool.query(query, [userId, profileImage]);
    return result.rows[0] || null;
  }
  
  // Verify password
  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
  
  // Check if email exists
  async emailExists(email) {
    const query = `SELECT id FROM users WHERE email = $1`;
    const result = await pool.query(query, [email]);
    return result.rows.length > 0;
  }
}

module.exports = new UserRepository();
