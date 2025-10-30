const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 401,
        message: 'Token tidak valid atau kadaluwarsa'
      });
    }
    
    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      return res.status(401).json({
        status: 401,
        message: 'Token tidak valid atau kadaluwarsa'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await userRepository.findUserById(decoded.sub);
    
    if (!user) {
      return res.status(401).json({
        status: 401,
        message: 'Token tidak valid atau kadaluwarsa'
      });
    }
    
    // Attach user to request object
    req.user = user;
    next();
    
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 401,
        message: 'Token tidak valid atau kadaluwarsa'
      });
    }
    
    return res.status(500).json({
      status: 500,
      message: 'Internal server error'
    });
  }
};

module.exports = authMiddleware;
