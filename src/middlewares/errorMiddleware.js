// Centralized error handling middleware

const errorMiddleware = (err, req, res, next) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Default error response
  let status = 500;
  let message = 'Internal server error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    status = 400;
    message = err.message;
  } else if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Token tidak valid atau kadaluwarsa';
  } else if (err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Token tidak valid atau kadaluwarsa';
  } else if (err.code === '23505') { // PostgreSQL unique violation
    status = 400;
    if (err.constraint && err.constraint.includes('email')) {
      message = 'Email sudah terdaftar';
    } else {
      message = 'Data sudah ada';
    }
  } else if (err.code === '23503') { // PostgreSQL foreign key violation
    status = 400;
    message = 'Data referensi tidak ditemukan';
  } else if (err.code === '23514') { // PostgreSQL check constraint violation
    status = 400;
    message = 'Data tidak valid';
  } else if (err.message === 'Insufficient balance') {
    status = 400;
    message = 'Balance tidak mencukupi';
  } else if (err.message === 'Wallet not found') {
    status = 404;
    message = 'Wallet tidak ditemukan';
  } else if (err.message === 'User not found') {
    status = 404;
    message = 'User tidak ditemukan';
  }

  // Send error response
  res.status(status).json({
    status: status,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { 
      error: err.message,
      stack: err.stack 
    })
  });
};

module.exports = errorMiddleware;
