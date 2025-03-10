const { db } = require('../config/firebase');
const { Ride } = require('../models/ride.model');
const { isValidLocation } = require('../utils/location.utils');

exports.getPreviousRides = async (req, res) => {
  try {
    const userId = req.user.uid;
    
    const ridesSnapshot = await db.collection('rides')
      .where('riderId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    const rides = ridesSnapshot.docs.map(doc => Ride.fromFirestore(doc));
    
    res.status(200).json({ rides });
  } catch (error) {
    console.error('Error getting previous rides:', error);
    res.status(500).json({ message: 'Failed to get previous rides', error: error.message });
  }
};

exports.createRideRequest = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { pickupLocation, dropoffLocation } = req.body;
    
    // Validate locations
    if (!isValidLocation(pickupLocation) || !isValidLocation(dropoffLocation)) {
      return res.status(400).json({ message: 'Invalid location provided' });
    }
    
    // Check operating hours (7pm - 2am)
    const currentHour = new Date().getHours();
    if (currentHour < 19 && currentHour > 2) {
      return res.status(400).json({ 
        message: 'Ride requests are only valid during operating hours (7pm - 2am)' 
      });
    }
    
    // Create new ride request
    const newRide = new Ride(null, {
      riderId: userId,
      pickupLocation,
      dropoffLocation,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    
    const rideRef = await db.collection('rides').add(newRide.toFirestore());
    
    res.status(201).json({ 
      message: 'Ride request created successfully',
      rideId: rideRef.id 
    });
  } catch (error) {
    console.error('Error creating ride request:', error);
    res.status(500).json({ message: 'Failed to create ride request', error: error.message });
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
    
    const ride = Ride.fromFirestore(ridesSnapshot.docs[0]);
    
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