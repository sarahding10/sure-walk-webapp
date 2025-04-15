import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config.js';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

import RequestCard from './RequestCard';
import './DriverDashboard.css';

function DriverDashboard() {
  const [assignedRequests, setAssignedRequests] = useState([]);
  const [vehicleId, setVehicleId] = useState('or6lkb3R3Vzat1X1EM8J'); // Replace with dynamic value if needed

  useEffect(() => {
    if (!vehicleId) return;

    const requestsRef = collection(db, 'requests');
    const q = query(requestsRef, where('vehicleId', '==', vehicleId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedRequests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAssignedRequests(updatedRequests);
    });

    return () => unsubscribe();
  }, [vehicleId]);

  console.log(assignedRequests);

  return (
    <div className="assigned-requests">
      <header>
        <h1>Assigned Requests - {vehicleId}</h1>
        <p>Make sure to update the status of each request!</p>
      </header>
      <div className="cards-container">
        {assignedRequests.map((req) => (
          <RequestCard
            key={req.id}
            name={req.name || 'Unnamed'}
            pickup={req.pickup || 'Unknown'}
            dropoff={req.dropoff || 'Unknown'}
            status={req.status || 'inactive'}
          />
        ))}
      </div>
    </div>
  );
}

export default DriverDashboard;
