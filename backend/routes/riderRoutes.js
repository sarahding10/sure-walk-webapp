const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const riderController = require('../controllers/riderController');

// Get previous rides for a user
router.get('/rides', verifyToken, riderController.getPreviousRides);

// Post a new ride request
router.post('/request', verifyToken, riderController.createRideRequest);

// Get rider status
router.get('/status', verifyToken, riderController.getRiderStatus);

// Get driver 
router.get('/assigned-driver', verifyToken, riderController.getAssignedDriver);

// Cancel a ride
router.delete('/cancel/:rideId', verifyToken, riderController.cancelRide);

module.exports = router;