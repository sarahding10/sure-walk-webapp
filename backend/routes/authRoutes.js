const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Register a new user
router.post('/register', authController.register);

// Verify phone number
router.post('/verify-phone', authController.verifyPhone);

// Login with phone number
router.post('/login-phone', authController.loginWithPhone);

// Login with email
router.post('/login-email', authController.loginWithEmail);

module.exports = router;