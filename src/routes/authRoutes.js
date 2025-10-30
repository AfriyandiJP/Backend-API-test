const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });


// Public routes
router.post('/registration', authController.register);
router.post('/login', authController.login);

// Protected routes (require authentication)
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile/update', authMiddleware, authController.updateProfile);
router.put('/profile/image', authMiddleware, upload.single('profile_image'), authController.updateProfileImage);

module.exports = router;
