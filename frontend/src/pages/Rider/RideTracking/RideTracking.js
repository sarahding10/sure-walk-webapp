import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase/config'; // Make sure this path matches your Firebase config
import './RideTrackingStyles.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function RideTracking() {
  const { rideId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rideData, setRideData] = useState(null);
  const [rideStatus, setRideStatus] = useState('confirmed'); // 'assigned', 'arrived', 'completed'

  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Initial fetch to get complete ride data
    async function fetchInitialRideData() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/rider/status`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${await currentUser.getIdToken()}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch ride data');
        }

        const data = await response.json();
        setRideData(data);
        
        // Set initial status based on ride data
        updateStatusFromData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching initial ride data:', error);
        setError('Failed to load ride information. Please try again.');
        setLoading(false);
      }
    }

    fetchInitialRideData();

    // Set up real-time listener for ride updates
    const rideRef = doc(db, "requests", rideId);
    const unsubscribe = onSnapshot(rideRef, 
      // OnNext handler - when document updates
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setRideData(data);
          updateStatusFromData(data);
        } else {
          // Document doesn't exist
          setError('Ride not found. It may have been canceled.');
        }
        setLoading(false);
      },
      // OnError handler
      (err) => {
        console.error('Error listening to ride updates:', err);
        setError('Failed to receive ride updates. Please refresh the page.');
        setLoading(false);
      }
    );

    // Clean up listener when component unmounts
    return () => unsubscribe();
  }, [rideId, currentUser, navigate]);

  // Helper function to update status based on ride data
  function updateStatusFromData(data) {
    if (data.status === 'confirmed') {
      setRideStatus('confirmed');
    } else if (data.status === 'driver_assigned') {
      setRideStatus('driver_sent');
    } else if (data.status === 'arrived') {
      setRideStatus('arrived');
    } else if (data.status === 'completed') {
      setRideStatus('completed');
      // Optional: Handle ride completion if needed
    }
  }

  const handleCancelRide = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rider/ride/${rideId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await currentUser.getIdToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to cancel ride');
      }

      // Redirect to home or ride request page
      navigate('/rider/request');
    } catch (error) {
      console.error('Error canceling ride:', error);
      setError('Failed to cancel ride. Please try again.');
    }
  };

  const handleGoHome = () => {
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading ride details...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button className="btn-primary" onClick={() => navigate('/rider/request')}>
          Request Another Ride
        </button>
      </div>
    );
  }

  // Default values in case the backend doesn't return complete data
  const pickupLocation = rideData?.pickupLocation || 'Unknown location';
  const dropoffLocation = rideData?.dropoffLocation || 'Unknown location';
  const queuePosition = rideData?.queuePosition || 5;
  const driverInfo = rideData?.driver || null;
  const vehicleInfo = rideData?.vehicle || { 
    description: 'White van with a UT Austin logo on the side'
  };

  return (
    <div className="tracking-container">
      <div className="status-card">
        <div className="progress-tracker">
          <div className={`status-point ${rideStatus === 'confirmed' || rideStatus === 'driver_sent' || rideStatus === 'arrived' ? 'active' : ''}`}>
            <div className="status-dot"></div>
            <span className="status-label">Confirmed</span>
          </div>
          <div className={`status-line ${rideStatus === 'driver_sent' || rideStatus === 'arrived' ? 'active' : ''}`}></div>
          <div className={`status-point ${rideStatus === 'driver_sent' || rideStatus === 'arrived' ? 'active' : ''}`}>
            <div className="status-dot"></div>
            <span className="status-label">Driver sent</span>
          </div>
          <div className={`status-line ${rideStatus === 'arrived' ? 'active' : ''}`}></div>
          <div className={`status-point ${rideStatus === 'arrived' ? 'active' : ''}`}>
            <div className="status-dot"></div>
            <span className="status-label">Arrived</span>
          </div>
        </div>

        <div className="status-message">
          {rideStatus === 'confirmed' && (
            <h2>Request Confirmed!</h2>
          )}
          {rideStatus === 'driver_sent' && (
            <h2>Driver is on their way!</h2>
          )}
          {rideStatus === 'arrived' && (
            <h2>Driver has arrived!</h2>
          )}
        </div>

        <div className="status-details">
          {rideStatus === 'confirmed' && (
            <p>You've been added to the queue list, 
               keep an eye on the number of people ahead!</p>
          )}
          {rideStatus === 'driver_sent' && (
            <p>Your driver is driving to meet you, 
               be alert for when they arrive.</p>
          )}
          {rideStatus === 'arrived' && (
            <p>Your driver is at the pick up location, 
               you have 2 minutes to get there!</p>
          )}
        </div>

        <div className="queue-status">
          {rideStatus === 'confirmed' && queuePosition > 0 && (
            <p className="queue-info">Queue: {queuePosition} people ahead of you</p>
          )}
          {(rideStatus === 'driver_sent' || rideStatus === 'arrived') && (
            <p className="queue-info">Queue: You're next in line!</p>
          )}
        </div>

        {(rideStatus === 'driver_sent' || rideStatus === 'arrived') && driverInfo && (
          <div className="vehicle-info">
            <div className="vehicle-image">
              <img src="/assets/vehicle-image.png" alt="SureWalk vehicle" />
            </div>
            <p className="vehicle-description">
              (Vehicle picking you up: {vehicleInfo.description})
            </p>
          </div>
        )}

        <div className="ride-details-section">
          <h3>Your request</h3>
          <div className="ride-details">
            <div className="detail-item">
              <div className="icon pickup-icon">👤</div>
              <div className="detail-content">
                <p className="detail-label">Pick up at</p>
                <p className="detail-value">{pickupLocation}</p>
              </div>
            </div>
            <div className="detail-item">
              <div className="icon dropoff-icon">📍</div>
              <div className="detail-content">
                <p className="detail-label">Drop off at</p>
                <p className="detail-value">{dropoffLocation}</p>
              </div>
            </div>
          </div>

          <div className="cancel-section">
            <p>Wish to cancel your ride?</p>
            {rideStatus !== 'arrived' ? (
              <p>
                {rideStatus === 'confirmed' ? 'Please cancel before the driver is sent' : 'Cancel'}
                <button className="cancel-link" onClick={handleCancelRide}> here</button>
                {rideStatus !== 'confirmed' && <span className="derogatory-text"> silly goose (derogatory)</span>}
              </p>
            ) : (
              <p>
                Cancel<button className="cancel-link" onClick={handleCancelRide}> here</button>
                <span className="derogatory-text"> silly goose (derogatory)</span>
              </p>
            )}
          </div>

          {rideStatus === 'arrived' && (
            <div className="home-button-container">
              <button className="btn-home" onClick={handleGoHome}>Home</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RideTracking;