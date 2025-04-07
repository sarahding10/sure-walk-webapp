// services/riderService.js
const { db } = require('../config/db');
const locationService = require('./locationService');

exports.createRideRequest = async (userId, displayName, pickupLocation, dropoffLocation, passengerCount = 1) => {
  // Validate operating hours (7pm - 2am)
  const currentHour = new Date().getHours();
  if (currentHour < 19 && currentHour > 2) {
    throw new Error('Ride requests are only valid during operating hours (7pm - 2am)');
  }

  try {
    // Validate and geocode pickup location with pickup-specific validation
    const validatedPickup = await locationService.validatePickupLocation(pickupLocation);
    
    // Validate and geocode dropoff location with dropoff-specific validation
    const validatedDropoff = await locationService.validateDropoffLocation(dropoffLocation);

    // Create new ride request with validated locations
    const rideRequest = {
      riderId: userId,
      displayName: displayName,
      pickupLocation: {
        address: validatedPickup.formattedAddress,
        latitude: validatedPickup.latitude,
        longitude: validatedPickup.longitude,
        placeId: validatedPickup.placeId
      },
      dropoffLocation: {
        address: validatedDropoff.formattedAddress,
        latitude: validatedDropoff.latitude,
        longitude: validatedDropoff.longitude,
        placeId: validatedDropoff.placeId
      },
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
  } catch (error) {
    if (error.message.includes('Pickup location is outside of service area')) {
      throw new Error('Invalid pickup location: Location is outside of the SureWalk pickup service area');
    }
    if (error.message.includes('Dropoff location is outside of service area')) {
      throw new Error('Invalid dropoff location: Location is outside of the SureWalk dropoff service area');
    }
    if (error.message.includes('Location validation failed')) {
      throw new Error('Invalid location: Could not validate the address provided');
    }
    throw error;
  }
};