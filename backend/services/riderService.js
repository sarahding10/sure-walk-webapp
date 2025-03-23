const { db } = require('../config/db'); 

exports.createRideRequest = async (userId, pickupLocation, dropoffLocation, passengerCount = 1) => {
  // Validate locations
//   if (!pickupLocation || !dropoffLocation || 
//       !pickupLocation.latitude || !pickupLocation.longitude ||
//       !dropoffLocation.latitude || !dropoffLocation.longitude) {
//     throw new Error('Invalid location provided');
//   }
  
  // Check operating hours (7pm - 2am)
  const currentHour = new Date().getHours();
  if (currentHour < 19 && currentHour > 2) {
    throw new Error('Ride requests are only valid during operating hours (7pm - 2am)');
  }
  
  // Create new ride request
  const rideRequest = {
    riderId: userId,
    pickupLocation,
    dropoffLocation,
    passengerCount: passengerCount || 1,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Save to database
  const rideRef = await db.collection('requests').add(rideRequest);
  
  return { 
    rideId: rideRef.id,
    ...rideRequest
  };
};