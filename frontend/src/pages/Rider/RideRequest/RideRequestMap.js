import React, { useState, useEffect, useRef } from 'react';
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
  const [passengerCount, setPassengerCount] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(true);
  // Adding references for the autocomplete inputs and markers
  const pickupInputRef = useRef(null);
  const dropoffInputRef = useRef(null);
  const pickupMarkerRef = useRef(null);
  const dropoffMarkerRef = useRef(null);
  const navigate = useNavigate();

  // Fallback suggestions list if Places API fails
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

  // Load Google Maps API
  useEffect(() => {
    // Check if Google Maps script is already loaded
    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializePlacesAPI;
      document.head.appendChild(script);

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    } else {
      initializePlacesAPI();
    }
  }, []);

  // Filter suggestions based on input (fallback)
  useEffect(() => {
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

  function initializePlacesAPI() {
    if (window.google && window.google.maps) {
      // Initialize autocomplete for pickup
      const pickupAutocomplete = new window.google.maps.places.Autocomplete(
        document.getElementById('pickup-input'),
        {
          componentRestrictions: { country: 'us' },
          fields: ['place_id', 'formatted_address', 'geometry', 'name']
        }
      );

      // Initialize autocomplete for dropoff
      const dropoffAutocomplete = new window.google.maps.places.Autocomplete(
        document.getElementById('dropoff-input'),
        {
          componentRestrictions: { country: 'us' },
          fields: ['place_id', 'formatted_address', 'geometry', 'name']
        }
      );

      // Add listener for pickup autocomplete
      pickupAutocomplete.addListener('place_changed', () => {
        const place = pickupAutocomplete.getPlace();
        if (place.geometry) {
          setPickup(place.formatted_address || place.name);
          setShowSuggestions(false);

          // Create a marker for the pickup location if we wanted to show it on a map
          // Since we're keeping the iframe map, we store the reference but don't display it
          pickupMarkerRef.current = {
            position: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            },
            title: place.name
          };
        }
      });

      // Add listener for dropoff autocomplete
      dropoffAutocomplete.addListener('place_changed', () => {
        const place = dropoffAutocomplete.getPlace();
        if (place.geometry) {
          setDropoff(place.formatted_address || place.name);
          setShowSuggestions(false);

          // Create a marker for the dropoff location if we wanted to show it on a map
          // Since we're keeping the iframe map, we store the reference but don't display it
          dropoffMarkerRef.current = {
            position: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            },
            title: place.name
          };
        }
      });
    }
  }

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
      setTimeout(() => {
        if (dropoffInputRef.current) {
          dropoffInputRef.current.focus();
        }
      }, 100);
    } else if (step === 'dropoff' && dropoff) {
      setStep('confirm');
    }
  };

  const handleBackClick = () => {
    if (step === 'dropoff') {
      setStep('pickup');
      setTimeout(() => {
        if (pickupInputRef.current) {
          pickupInputRef.current.focus();
        }
      }, 100);
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
        displayName: currentUser.displayName,
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
                id="pickup-input"
                ref={pickupInputRef}
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
                id="dropoff-input"
                ref={dropoffInputRef}
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

              <div className="passengers-selector">
                <p>Number of Passengers:</p>
                <div className="passenger-controls">
                  <button
                    className="passenger-btn"
                    onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}
                    disabled={passengerCount <= 1}
                  >-</button>
                  <span className="passenger-count">{passengerCount}</span>
                  <button
                    className="passenger-btn"
                    onClick={() => setPassengerCount(Math.min(4, passengerCount + 1))}
                    disabled={passengerCount >= 4}
                  >+</button>
                </div>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

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