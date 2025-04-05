const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

// Get all available drivers
// router.get('/available-drivers', verifyToken, verifyAdmin, adminController.getAvailableDrivers);
router.get('/available-vehicles', adminController.getAvailableVehicles)

// // Get detailed data about cars/riders/drivers
// router.get('/data', verifyToken, verifyAdmin, adminController.getDetailedData);
// router.get('/data', adminController.getDetailedData)

// // Assign rider to driver
// router.put('/assign', verifyToken, verifyAdmin, adminController.assignRideToDriver);
router.post('/assign', adminController.assignRideToVehicle)

// // Admin logout
// router.put('/logout', verifyToken, verifyAdmin, adminController.logout);

module.exports = router;