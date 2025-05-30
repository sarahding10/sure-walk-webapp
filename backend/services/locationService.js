// services/locationService.js
require('dotenv').config();

// Pickup boundary (smaller, campus-focused area)
const PICKUP_BOUNDARY = [
  { lat: 30.31875, lng: -97.73085 }, // Southwest corner
  { lat: 30.30969, lng: -97.71073 }, // Southeast corner
  { lat: 30.2853, lng: -97.75324 }, // Northeast corner
  { lat: 30.27881, lng: -97.73066 }  // Northwest corner
];

// Dropoff boundary (wider area around campus)
const DROPOFF_BOUNDARY = [
  { lat: 30.31875, lng: -97.73085 }, // Southwest corner
  { lat: 30.30969, lng: -97.71073 }, // Southeast corner
  { lat: 30.2853, lng: -97.75324 }, // Northeast corner
  { lat: 30.27881, lng: -97.73066 }  // Northwest corner
];

/**
 * Validates and geocodes an address string using fetch instead of axios
 * @param {string} locationString - The address to validate and geocode
 * @returns {Promise<{latitude: number, longitude: number, formattedAddress: string}>}
 */
const geocodeLocation = async (locationString) => {
    try {
      const params = new URLSearchParams({
        address: locationString,
        key: process.env.GOOGLE_MAPS_API_KEY,
        components: 'locality:austin|administrative_area:tx'
      });
  
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?${params.toString()}`,
        { method: 'GET' }
      );
  
      if (!response.ok) {
        throw new Error(`Geocoding request failed with status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data.status !== 'OK' || !data.results.length) {
        throw new Error(`Unable to geocode the address: ${locationString}`);
      }
  
      const result = data.results[0];
      const location = result.geometry.location;
      
      return {
        latitude: location.lat,
        longitude: location.lng,
        formattedAddress: result.formatted_address,
        placeId: result.place_id,
        types: result.types || [] // Extract the types array from the result
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      throw new Error(`Location validation failed: ${error.message}`);
    }
  };

/**
 * Checks if a point is inside a polygon using ray casting algorithm
 * @param {Object} point - {lat, lng} 
 * @param {Array} polygon - Array of {lat, lng} points
 * @returns {boolean}
 */
const isPointInPolygon = (point, polygon) => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat;
    const yi = polygon[i].lng;
    const xj = polygon[j].lat;
    const yj = polygon[j].lng;
    
    const intersect = ((yi > point.lng) !== (yj > point.lng)) &&
      (point.lat < (xj - xi) * (point.lng - yi) / (yj - yi) + xi);
    
    if (intersect) inside = !inside;
  }
  return inside;
};

/**
 * Validates if a pickup location is within service boundaries
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {boolean}
 */
const isPickupWithinBoundary = (latitude, longitude) => {
  return isPointInPolygon({ lat: latitude, lng: longitude }, PICKUP_BOUNDARY);
};

/**
 * Validates if a dropoff location is within service boundaries
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {boolean}
 */
const isDropoffWithinBoundary = (latitude, longitude) => {
  return isPointInPolygon({ lat: latitude, lng: longitude }, DROPOFF_BOUNDARY);
};

/**
 * Validates and geocodes a pickup location, checks if it's within service boundaries
 * @param {string} locationString - The address to validate
 * @returns {Promise<Object>} - The validated and geocoded location
 */
const validatePickupLocation = async (locationString) => {
  // Geocode the location
  const geocodedLocation = await geocodeLocation(locationString);

  console.log("pickup geocodedLocation", geocodedLocation);
  
  // Check if the location is within the pickup service boundary
  if (!isPickupWithinBoundary(geocodedLocation.latitude, geocodedLocation.longitude)) {
    throw new Error(`Pickup location is outside of service area: ${geocodedLocation.formattedAddress}`);
  }
  
  return geocodedLocation;
};

/**
 * Validates and geocodes a dropoff location, checks if it's within service boundaries
 * and ensures it's not a restaurant
 * @param {string} locationString - The address to validate
 * @returns {Promise<Object>} - The validated and geocoded location
 */
const validateDropoffLocation = async (locationString) => {
    // Geocode the location
    const geocodedLocation = await geocodeLocation(locationString);

    console.log("dropoff geocodedLocation", geocodedLocation);
    
    // Check if the geocoded location has types information
    if (geocodedLocation.types && 
        (geocodedLocation.types.includes('restaurant') || 
         geocodedLocation.types.includes('food'))) {
      throw new Error(`Restaurants are not allowed as dropoff locations: ${geocodedLocation.formattedAddress}`);
    }
    
    // Check if the location is within the dropoff service boundary
    if (!isDropoffWithinBoundary(geocodedLocation.latitude, geocodedLocation.longitude)) {
      throw new Error(`Dropoff location is outside of service area: ${geocodedLocation.formattedAddress}`);
    }
    
    return geocodedLocation;
  };

/**
 * Get boundary coordinates for frontend use
 */
const getBoundaries = () => {
  return {
    pickupBoundary: PICKUP_BOUNDARY,
    dropoffBoundary: DROPOFF_BOUNDARY
  };
};

module.exports = {
  validatePickupLocation,
  validateDropoffLocation,
  geocodeLocation,
  isPickupWithinBoundary,
  isDropoffWithinBoundary,
  getBoundaries
};