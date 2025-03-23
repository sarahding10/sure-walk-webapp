const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const driverController = require('../controllers/driverController');

// Get available cars/drivers
// router.get('/available-cars', verifyToken, driverController.getAvailableCars);

// // Get current ride requests/rides
// router.get('/rides', verifyToken, verifyDriver, driverController.getCurrentRides);

// // Car route??

// // Update driver status (active, inactive)
// router.put('/status', verifyToken, verifyDriver, driverController.updateDriverStatus);

// // Update ride status (arrived, completed)
// router.put('/ride/:rideId/status', verifyToken, verifyDriver, driverController.updateRideStatus);

// // Driver logout
// router.put('/logout', verifyToken, verifyDriver, driverController.logout);

module.exports = router;