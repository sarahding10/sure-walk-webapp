// components/rider/RiderDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase/config';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import '../../styles/RiderDashboard.css';

function RiderDashboard() {
  const { currentUser, logout } = useAuth();
  const [activeRide, setActiveRide] = useState(null);
  const [pastRides, setPastRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    // Listen for active rides
    const activeRidesQuery = query(
      collection(db, 'rides'),
      where('riderId', '==', currentUser.uid),
      where('status', 'in', ['pending', 'accepted', 'inProgress']),
      orderBy('createdAt', 'desc'),
      limit(1)
    );

    const unsubscribeActive = onSnapshot(activeRidesQuery, (snapshot) => {
      if (!snapshot.empty) {
        const rideData = {
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data()
        };
        setActiveRide(rideData);
      } else {
        setActiveRide(null);
      }
      setLoading(false);
    });

    // Listen for past rides
    const pastRidesQuery = query(
      collection(db, 'rides'),
      where('riderId', '==', currentUser.uid),
      where('status', 'in', ['completed', 'cancelled']),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const unsubscribePast = onSnapshot(pastRidesQuery, (snapshot) => {
      const rides = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPastRides(rides);
    });

    return () => {
      unsubscribeActive();
      unsubscribePast();
    };
  }, [currentUser]);

  const handleRequestRide = () => {
    navigate('/rider/request');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="rider-dashboard">
      <header className="dashboard-header">
        <h1>SureWalk</h1>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </header>

      <div className="dashboard-content">
        {activeRide ? (
          <div className="active-ride-card">
            <h2>Active Ride</h2>
            <div className="ride-details">
              <p><strong>Status:</strong> {activeRide.status}</p>
              <p><strong>Pickup:</strong> {activeRide.pickup}</p>
              <p><strong>Dropoff:</strong> {activeRide.dropoff}</p>
              {activeRide.driverId && (
                <p><strong>Driver:</strong> {activeRide.driverName || 'Assigned'}</p>
              )}
            </div>
            {/* Add a map or other UI elements here */}
          </div>
        ) : (
          <button 
            className="btn-request-ride" 
            onClick={handleRequestRide}
          >
            Request a Ride
          </button>
        )}

        {pastRides.length > 0 && (
          <div className="past-rides-section">
            <h2>Recent Rides</h2>
            <ul className="past-rides-list">
              {pastRides.map(ride => (
                <li key={ride.id} className="past-ride-item">
                  <div className="ride-info">
                    <p className="ride-date">{new Date(ride.createdAt.toDate()).toLocaleDateString()}</p>
                    <p className="ride-route">{ride.pickup} → {ride.dropoff}</p>
                  </div>
                  <span className={`ride-status status-${ride.status}`}>
                    {ride.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default RiderDashboard;