const { db } = require('../config/db');
const riderService = require('../services/riderService');

exports.getPreviousRides = async (req, res) => {
  try {
    const userId = req.user.uid;

    const ridesSnapshot = await db.collection('rides')
      .where('riderId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const rides = ridesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json({ rides });
  } catch (error) {
    console.error('Error getting previous rides:', error);
    res.status(500).json({ message: 'Failed to get previous rides', error: error.message });
  }
};

exports.createRideRequest = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { pickupLocation, dropoffLocation, passengerCount } = req.body;

    const rideRequest = await riderService.createRideRequest(
      userId,
      pickupLocation,
      dropoffLocation,
      passengerCount
    );

    res.status(201).json({
      message: 'Ride request created successfully',
      rideId: rideRequest.rideId
    });
  } catch (error) {
    console.error('Error creating ride request:', error);

    // Handle specific errors with appropriate status codes
    if (error.message.includes('Invalid location')) {
      return res.status(400).json({ message: error.message });
    } else if (error.message.includes('operating hours')) {
      return res.status(400).json({ message: error.message });
    }

    // Generic server error
    res.status(500).json({
      message: 'Failed to create ride request',
      error: error.message
    });
  }
};

exports.getRiderStatus = async (req, res) => {
  try {
    const userId = req.user.uid;

    // Get the most recent active ride request for this user
    const ridesSnapshot = await db.collection('rides')
      .where('riderId', '==', userId)
      .where('status', 'in', ['pending', 'approved', 'assigned', 'inProgress', 'arrived'])
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (ridesSnapshot.empty) {
      return res.status(200).json({ hasActiveRide: false });
    }

    const rideDoc = ridesSnapshot.docs[0];
    const ride = {
      id: rideDoc.id,
      ...rideDoc.data()
    };

    // If ride is assigned, get driver info
    let driverInfo = null;
    if (ride.driverId && (ride.status === 'assigned' || ride.status === 'inProgress' || ride.status === 'arrived')) {
      const driverSnapshot = await db.collection('users').doc(ride.driverId).get();
      if (driverSnapshot.exists) {
        const driver = driverSnapshot.data();
        driverInfo = {
          firstName: driver.firstName,
          lastName: driver.lastName,
          phoneNumber: driver.phoneNumber
        };
      }
    }

    res.status(200).json({
      hasActiveRide: true,
      ride,
      driverInfo
    });
  } catch (error) {
    console.error('Error getting rider status:', error);
    res.status(500).json({ message: 'Failed to get rider status', error: error.message });
  }
};

exports.getAssignedDriver = async (req, res) => {
  try {
    const userId = req.user.uid;

    // Get the most recent active ride request for this user that has a driver assigned
    const ridesSnapshot = await db.collection('rides')
      .where('riderId', '==', userId)
      .where('status', 'in', ['assigned', 'inProgress', 'arrived'])
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (ridesSnapshot.empty) {
      return res.status(404).json({ message: 'No assigned driver found' });
    }

    const rideDoc = ridesSnapshot.docs[0];
    const ride = {
      id: rideDoc.id,
      ...rideDoc.data()
    };

    if (!ride.driverId) {
      return res.status(404).json({ message: 'No driver assigned to this ride' });
    }

    // Get driver information
    const driverSnapshot = await db.collection('users').doc(ride.driverId).get();

    if (!driverSnapshot.exists) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    const driver = driverSnapshot.data();

    const driverInfo = {
      id: driverSnapshot.id,
      firstName: driver.firstName,
      lastName: driver.lastName,
      phoneNumber: driver.phoneNumber,
      profilePicture: driver.profilePicture || null
    };

    // Get vehicle information if available
    let vehicleInfo = null;
    if (driver.vehicleId) {
      const vehicleSnapshot = await db.collection('vehicles').doc(driver.vehicleId).get();
      if (vehicleSnapshot.exists) {
        const vehicle = vehicleSnapshot.data();
        vehicleInfo = {
          id: vehicleSnapshot.id,
          make: vehicle.make,
          model: vehicle.model,
          color: vehicle.color,
          licensePlate: vehicle.licensePlate
        };
      }
    }

    // Current location of driver if available
    let currentLocation = null;
    if (ride.driverLocation) {
      currentLocation = ride.driverLocation;
    }

    res.status(200).json({
      driver: driverInfo,
      vehicle: vehicleInfo,
      currentLocation,
      rideId: ride.id,
      rideStatus: ride.status,
      estimatedArrival: ride.estimatedArrival || null
    });
  } catch (error) {
    console.error('Error getting assigned driver:', error);
    res.status(500).json({ message: 'Failed to get assigned driver', error: error.message });
  }
};

exports.cancelRide = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { rideId } = req.params;

    // Check if ride exists and belongs to user
    const rideRef = db.collection('rides').doc(rideId);
    const rideDoc = await rideRef.get();

    if (!rideDoc.exists) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    const ride = rideDoc.data();

    if (ride.riderId !== userId) {
      return res.status(403).json({ message: 'Unauthorized to cancel this ride' });
    }

    if (['completed', 'cancelled'].includes(ride.status)) {
      return res.status(400).json({ message: `Cannot cancel a ride that is already ${ride.status}` });
    }

    // Update ride status to cancelled
    await rideRef.update({
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    res.status(200).json({ message: 'Ride cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling ride:', error);
    res.status(500).json({ message: 'Failed to cancel ride', error: error.message });
  }
};