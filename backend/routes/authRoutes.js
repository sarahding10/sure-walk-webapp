const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');

// Register a new user
// router.post('/register', authController.register);

// // Verify phone number
// router.post('/verify-phone', authController.verifyPhone);

// // Login with phone number
// router.post('/login-phone', authController.loginWithPhone);

// // Login with email
// router.post('/login-email', authController.loginWithEmail);

// Get user profile
router.get('/profile', verifyToken, authController.getUserProfile);

// Create or update user profile
router.post('/profile', verifyToken, authController.createOrUpdateUserProfile);

module.exports = router;