const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const { registrationSchema, loginSchema, profileUpdateSchema } = require('../validations/authValidation');

class AuthController {
  // Registration endpoint
  async register(req, res) {
    try {
      // Validate input
      const { error, value } = registrationSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          status: 102,
          message: error.details[0].message,
          data: null
        });
      }
      
      const { email, password, first_name, last_name } = value;
      
      // Check if email already exists
      const emailExists = await userRepository.emailExists(email);
      if (emailExists) {
        return res.status(400).json({
          status: 102,
          message: 'Email sudah terdaftar',
          data: null
        });
      }
      
      // Create user
      const user = await userRepository.createUser({
        email,
        password,
        first_name,
        last_name
      });
      
      // Return success response
      res.status(200).json({
        status: 0,
        message: 'Registrasi berhasil silahkan login',
        data: null
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.code === '23505') { // PostgreSQL unique violation
        return res.status(400).json({
          status: 102,
          message: 'Email sudah terdaftar',
          data: null
        });
      }
      
      res.status(500).json({
        status: 500,
        message: 'Internal server error'
      });
    }
  }
  
  // Login endpoint
  async login(req, res) {
    try {
      // Validate input
      const { error, value } = loginSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          status: 102,
          message: error.details[0].message,
          data: null
        });
      }
      
      const { email, password } = value;
      
      // Find user by email
      const user = await userRepository.findUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({
          status: 103,
          message: 'Username atau password salah',
          data: null
        });
      }
      
      // Verify password
      const isPasswordValid = await userRepository.verifyPassword(password, user.password_hash);
      
      if (!isPasswordValid) {
        return res.status(401).json({
          status: 103,
          message: 'Username atau password salah',
          data: null
        });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          sub: user.id,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (60 * 60) // 60 minutes
        },
        process.env.JWT_SECRET
      );
      
      // Return success response
      res.status(200).json({
        status: 0,
        message: 'Login Sukses',
        data: {
          token: token
        }
      });
      
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        status: 500,
        message: 'Internal server error'
      });
    }
  }
  
  // Get profile endpoint
  async getProfile(req, res) {
    try {
      const user = req.user; // From auth middleware
      
      res.status(200).json({
        status: 0,
        message: 'Sukses',
        data: {
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          profile_image: user.profile_image || null
        }
      });
      
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        status: 500,
        message: 'Internal server error'
      });
    }
  }
  
  // Update profile endpoint
  async updateProfile(req, res) {
    try {
      // Validate input
      const { error, value } = profileUpdateSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          status: 102,
          message: error.details[0].message,
          data: null
        });
      }
      
      const { first_name, last_name } = value;
      const userId = req.user.id;
      
      // Update user profile
      const updatedUser = await userRepository.updateUserProfile(userId, {
        first_name,
        last_name
      });
      
      if (!updatedUser) {
        return res.status(404).json({
          status: 404,
          message: 'User tidak ditemukan',
          data: null
        });
      }
      
      res.status(200).json({
        status: 0,
        message: 'Update Profile berhasil',
        data: {
          email: updatedUser.email,
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          profile_image: updatedUser.profile_image || null
        }
      });
      
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        status: 500,
        message: 'Internal server error'
      });
    }
  }
  
  // Update profile image endpoint
  async updateProfileImage(req, res) {
    console.log('updateProfileImage', req);
    console.log('updateProfileImage', req.body);
    try {
      // For now, we'll implement a simple base64 image handler
      // In production, you might want to use multer for file uploads
      const { profile_image } = req.body;
      
      if (!profile_image) {
        return res.status(400).json({
          status: 102,
          message: 'Profile image tidak boleh kosong',
          data: null
        });
      }
      
      
      const userId = req.user.id;
      
      // Update profile image
      const updatedUser = await userRepository.updateProfileImage(userId, profile_image);
      
      if (!updatedUser) {
        return res.status(404).json({
          status: 404,
          message: 'User tidak ditemukan',
          data: null
        });
      }
      
      res.status(200).json({
        status: 0,
        message: 'Update Profile Image berhasil',
        data: {
          email: updatedUser.email,
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          profile_image: updatedUser.profile_image
        }
      });
      
    } catch (error) {
      console.error('Update profile image error:', error);
      res.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: null
      });
    }
  }
}

module.exports = new AuthController();
