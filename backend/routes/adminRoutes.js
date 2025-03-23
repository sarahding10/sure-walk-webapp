const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

// Get all available drivers
// router.get('/available-drivers', verifyToken, verifyAdmin, adminController.getAvailableDrivers);

// // Get unhandled ride requests
// router.get('/unhandled-rides', verifyToken, verifyAdmin, adminController.getUnhandledRides);

// // Get detailed data about cars/riders/drivers
// router.get('/data', verifyToken, verifyAdmin, adminController.getDetailedData);

// // Assign rider to driver
// router.put('/assign', verifyToken, verifyAdmin, adminController.assignRideToDriver);

// // Admin logout
// router.put('/logout', verifyToken, verifyAdmin, adminController.logout);

module.exports = router;