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
    const { pickupLocation, dropoffLocation, passengerCount, displayName } = req.body;

    const rideRequest = await riderService.createRideRequest(
      userId,
      displayName,
      pickupLocation,
      dropoffLocation,
      passengerCount
    );

    res.status(201).json({
      message: 'Ride request created successfully',
      rideId: rideRequest.rideId
    });
  } catch (err) {
    console.error(err);
    // validation errors → 400
    if (err.message.startsWith('Pickup') ||
        err.message.startsWith('Dropoff') ||
        err.message.startsWith('Invalid location')) {
      return res.status(400).json({ message: err.message });
    }
    // fallback → 500
    return res.status(500).json({ message: 'Server error', detail: err.message });
  }
};

exports.getRiderStatus = async (req, res) => {
  try {
    const userId = req.user.uid;
    
    // Get the most recent active ride request for this user
    const ridesSnapshot = await db.collection('requests')
      .where('riderId', '==', userId)
      .where('status', 'in', ['pending', 'assigned', 'arrived', 'completed', 'cancelled'])
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
    
    // If ride has a driver assigned, get driver info
    let driverInfo = null;
    let vehicleInfo = null;
    
    if (ride.driverId && (ride.status === 'driver_assigned' || ride.status === 'arrived')) {
      // Get driver information
      const driverSnapshot = await db.collection('users').doc(ride.driverId).get();
      if (driverSnapshot.exists) {
        const driver = driverSnapshot.data();
        driverInfo = {
          firstName: driver.firstName,
          lastName: driver.lastName,
          phoneNumber: driver.phoneNumber
        };
      }
      
      // If driver has a vehicle assigned, get vehicle info
      if (ride.vehicleId) {
        const vehicleSnapshot = await db.collection('vehicles').doc(ride.vehicleId).get();
        if (vehicleSnapshot.exists) {
          const vehicle = vehicleSnapshot.data();
          vehicleInfo = {
            description: `${vehicle.color} ${vehicle.make} ${vehicle.model}`
          };
        }
      } else {
        // Default vehicle description if no vehicle ID is available
        vehicleInfo = {
          description: 'White van with a UT Austin logo on the side'
        };
      }
    }
    
    // Format the response to match frontend expectations
    res.status(200).json({
      hasActiveRide: true,
      ride: {
        ...ride,
        queuePosition: ride.queuePosition || 0
      },
      driver: driverInfo,
      vehicle: vehicleInfo
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