import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import './RideRequestStyles.css';

function RideRequestMap() {
  const { currentUser, getUserProfile } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('pickup'); // 'pickup', 'dropoff', 'confirm'
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [queueSize, setQueueSize] = useState(5);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [suggestions, setSuggestions] = useState([
    'Jester West Dormitory',
    'Belmont Hall',
    'University Teaching Center (UTC)',
    'Gates-Dell Complex (GDC)',
    'Texas Union',
    'NRG Stadium',
    'Perry-Castaneda Library (PCL)',
    'Parlin Hall (PAR)'
  ]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [passengerCount, setPassengerCount] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setLoading(false);
      }
    }

    if (currentUser) {
      loadUserProfile();
    }
  }, [currentUser, getUserProfile]);

  useEffect(() => {
    // Filter suggestions based on input
    if (step === 'pickup') {
      const filtered = suggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(pickup.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 3));
    } else if (step === 'dropoff') {
      const filtered = suggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(dropoff.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 3));
    }
  }, [pickup, dropoff, step, suggestions]);

  const handlePickupChange = (e) => {
    setPickup(e.target.value);
    setShowSuggestions(true);
  };

  const handleDropoffChange = (e) => {
    setDropoff(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    if (step === 'pickup') {
      setPickup(suggestion);
      setShowSuggestions(false);
    } else if (step === 'dropoff') {
      setDropoff(suggestion);
      setShowSuggestions(false);
    }
  };

  const handleNextClick = () => {
    if (step === 'pickup' && pickup) {
      setStep('dropoff');
    } else if (step === 'dropoff' && dropoff) {
      setStep('confirm');
    }
  };

  const handleBackClick = () => {
    if (step === 'dropoff') {
      setStep('pickup');
    } else if (step === 'confirm') {
      setStep('dropoff');
    }
  };

  const handleRequestRide = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Create ride request payload
      const rideRequest = {
        userId: currentUser.uid,
        pickupLocation: pickup,
        dropoffLocation: dropoff,
        passengerCount: passengerCount,
        requestTime: new Date().toISOString(),
        status: 'pending'
      };
      
      // Send request to backend
      const response = await fetch('http://localhost:5000/api/rider/request-ride', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await currentUser.getIdToken()}`
        },
        body: JSON.stringify(rideRequest),
        // Set a timeout to prevent long-hanging requests
        timeout: 10000
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create ride request');
      }
      
      const data = await response.json();
      
      // Navigate to tracking page with the ride ID
      navigate(`/rider/tracking/${data.rideId}`);
    } catch (error) {
      console.error('Error creating ride request:', error);
      setError('Failed to create ride request. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const firstName = userProfile?.firstName || '';

  return (
    <div className="map-container">
      <div className="map-placeholder">
        <iframe
            src="https://www.google.com/maps/d/embed?mid=1fUaCTxWyvSzQkq_0kWWDe-eeim6pS_CA&ehbc=2E312F"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
        ></iframe>
      </div>
      
      <div className="ride-request-panel">
        {step === 'pickup' && (
          <>
            <div className="panel-header">
              <div className="queue-info">Queue: {queueSize} people ahead of you</div>
            </div>
            
            <div className="greeting">
              <p>Hello, {firstName}!</p>
              <h2>Where would you like to be picked up?</h2>
              <p className="helper-text">(Tip: Has to be within the boundary map above)</p>
            </div>
            
            <div className="location-input-container">
              <input
                type="text"
                value={pickup}
                onChange={handlePickupChange}
                placeholder="Pick up location..."
                className="location-input"
              />
              <span className="search-icon">🔍</span>
            </div>
            
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="suggestions-container">
                <div className="suggestions-header">
                  <span>Suggestions</span>
                  <button className="see-more-btn">see more?</button>
                </div>
                
                {filteredSuggestions.map((suggestion, index) => (
                  <div key={index} className="suggestion-item" onClick={() => handleSuggestionClick(suggestion)}>
                    <span className="location-pin">📍</span>
                    <span>{suggestion}</span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="navigation-buttons">
              <button className="btn-next" onClick={handleNextClick} disabled={!pickup}>
                Next
              </button>
            </div>
          </>
        )}
        
        {step === 'dropoff' && (
          <>
            <div className="panel-header">
              <div className="queue-info">Queue: {queueSize} people ahead of you</div>
            </div>
            
            <div className="greeting">
              <p>Hello, {firstName}!</p>
              <h2>Where would you like to go?</h2>
              <p className="helper-text">(Tip: Has to be within the boundary map above)</p>
            </div>
            
            <div className="location-input-container">
              <input
                type="text"
                value={dropoff}
                onChange={handleDropoffChange}
                placeholder="Drop off location..."
                className="location-input"
              />
              <span className="search-icon">🔍</span>
            </div>
            
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="suggestions-container">
                <div className="suggestions-header">
                  <span>Suggestions</span>
                  <button className="see-more-btn">see more?</button>
                </div>
                
                {filteredSuggestions.map((suggestion, index) => (
                  <div key={index} className="suggestion-item" onClick={() => handleSuggestionClick(suggestion)}>
                    <span className="location-pin">📍</span>
                    <span>{suggestion}</span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="navigation-buttons">
              <button className="btn-back" onClick={handleBackClick}>
                <span className="back-arrow">←</span>
              </button>
              <button className="btn-next" onClick={handleNextClick} disabled={!dropoff}>
                Next
              </button>
            </div>
          </>
        )}
        
        {step === 'confirm' && (
          <>
            <div className="confirmation-header">
              <h2>Confirm your ride!</h2>
              <p>Make sure everything below is correct</p>
            </div>
            
            <div className="ride-details">
              <div className="detail-item">
                <div className="icon pickup-icon">👤</div>
                <div className="detail-content">
                  <p className="detail-label">Pick up at</p>
                  <p className="detail-value">{pickup}</p>
                </div>
              </div>
              
              <div className="connector-line"></div>
              
              <div className="detail-item">
                <div className="icon dropoff-icon">📍</div>
                <div className="detail-content">
                  <p className="detail-label">Drop off at</p>
                  <p className="detail-value">{dropoff}</p>
                </div>
              </div>
            </div>
            
            <div className="navigation-buttons">
              <button className="btn-back" onClick={handleBackClick}>
                <span className="back-arrow">←</span>
              </button>
              <button className="btn-request" onClick={handleRequestRide}>
                Request
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RideRequestMap;