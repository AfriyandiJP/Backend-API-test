const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
const pool = require('./src/config/db');
(async () => {
    try {
      await pool.query('SELECT 1');
      console.log('Database connection verified');
    } catch (err) {
      console.error('Database connection failed:', err.message);
    }
  })();

// Routes
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 0,
    message: 'Server is running',
    data: {
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  });
});

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const referenceRoutes = require('./src/routes/referenceRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');

// Use routes
app.use('/api/v1', authRoutes);
app.use('/api/v1', referenceRoutes);
app.use('/api/v1', transactionRoutes);

// Error handling middleware
const errorMiddleware = require('./src/middlewares/errorMiddleware');
app.use(errorMiddleware);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/v1/health`);
});

module.exports = app;
