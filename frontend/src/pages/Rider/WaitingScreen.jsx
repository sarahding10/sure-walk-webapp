// src/components/rider/WaitingScreen.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase';
import MapComponent from './MapComponent';

const WaitingScreen = () => {
  const [rideRequest, setRideRequest] = useState(null);
  const [driverInfo, setDriverInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const auth = getAuth();
  
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Find the latest ride request for this user
    const fetchLatestRideRequest = async () => {
      try {
        // This would normally query the database for the most recent request
        // For now, we'll simulate this functionality
        
        // In a real implementation, you'd use a query like this:
        // const q = query(
        //   collection(db, 'rideRequests'), 
        //   where('riderId', '==', user.uid), 
        //   orderBy('createdAt', 'desc'), 
        //   limit(1)
        // );
        // const querySnapshot = await getDocs(q);
        // if (!querySnapshot.empty) {
        //   const requestData = querySnapshot.docs[0].data();
        //   setRideRequest({ id: querySnapshot.docs[0].id, ...requestData });
        // }
        
        // Simulate finding a request
        setRideRequest({
          id: 'simulated-request-id',
          status: 'pending',
          pickupLocation: 'Jester West Dormitory',
          dropoffLocation: 'University Teaching Center (UTC)',
          createdAt: new Date().toISOString()
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching ride request:', err);
        setError('Failed to load your ride request. Please try again.');
        setIsLoading(false);
      }
    };
    
    fetchLatestRideRequest();
    
    // Set up real-time listener for the ride request
    // This would be implemented with Firebase onSnapshot in a real app
    const rideRequestListener = setTimeout(() => {
      // Simulate a driver being assigned after 5 seconds
      setRideRequest(prev => ({
        ...prev,
        status: 'assigned',
        driverId: 'simulated-driver-id'
      }));
      
      // Simulate driver information
      setDriverInfo({
        id: 'simulated-driver-id',
        name: 'Jane Smith',
        phone: '(555) 123-4567',
        photo: 'https://via.placeholder.com/50',
        vehicle: 'University Vehicle #42'
      });
    }, 5000);
    
    return () => {
      clearTimeout(rideRequestListener);
      // In a real implementation, you'd unsubscribe from the onSnapshot listener
    };
  }, [auth, navigate]);
  
  const renderPendingState = () => {
    return (
      <div className="waiting-screen pending">
        <h2>Waiting for a driver...</h2>
        <p>We're finding you a safe walk back to {rideRequest.dropoffLocation}</p>
        
        <div className="waiting-animation">
          {/* This would be a loading animation in the real app */}
          <div className="loading-spinner"></div>
        </div>
        
        <p className="wait-time">Estimated wait time: 5-10 minutes</p>
        
        <div className="ride-details">
          <div className="location-detail">
            <strong>Pick up:</strong> {rideRequest.pickupLocation}
          </div>
          <div className="location-detail">
            <strong>Drop off:</strong> {rideRequest.dropoffLocation}
          </div>
        </div>
        
        <button className="cancel-button">Cancel Request</button>
      </div>
    );
  };
  
  const renderAssignedState = () => {
    return (
      <div className="waiting-screen assigned">
        <h2>Driver Assigned!</h2>
        
        <div className="driver-info">
          <div className="driver-photo">
            <img src={driverInfo.photo} alt="Driver" />
          </div>
          <div className="driver-details">
            <h3>{driverInfo.name}</h3>
            <p>{driverInfo.phone}</p>
            <p>{driverInfo.vehicle}</p>
          </div>
        </div>
        
        <div className="eta">
          <h3>Driver is on the way!</h3>
          <p>ETA: 5 minutes</p>
        </div>
        
        <MapComponent 
          pickupLocation={rideRequest.pickupLocation}
          dropoffLocation={rideRequest.dropoffLocation}
          driverLocation="Near PCL Library" // This would be dynamic in a real app
        />
        
        <div className="ride-details">
          <div className="location-detail">
            <strong>Pick up:</strong> {rideRequest.pickupLocation}
          </div>
          <div className="location-detail">
            <strong>Drop off:</strong> {rideRequest.dropoffLocation}
          </div>
        </div>
        
        <button className="contact-button">Contact Driver</button>
        <button className="cancel-button">Cancel Ride</button>
      </div>
    );
  };
  
  if (isLoading) {
    return <div className="loading">Loading your ride request...</div>;
  }
  
  if (error) {
    return <div className="error-screen">{error}</div>;
  }
  
  if (!rideRequest) {
    return <div className="no-request">No active ride request found. <button onClick={() => navigate('/rider/request')}>Request a ride</button></div>;
  }
  
  // Render different states based on the ride status
  switch (rideRequest.status) {
    case 'pending':
      return renderPendingState();
    case 'assigned':
      return renderAssignedState();
    default:
      return <div className="unknown-status">Unknown ride status. Please try again.</div>;
  }
};

export default WaitingScreen;