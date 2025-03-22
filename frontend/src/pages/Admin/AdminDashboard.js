import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config.js';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import Header from './Header/Header';
import RequestsSection from './Requests/RequestsSection';
import StatRow from './Stats/StatRow';

function AdminDashboard () {
  const [riderRequests, setRiderRequests] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  useEffect (() => {
    // requests listener
    const riderRequestsRef = collection(db, 'requests');
    const requestsQuery = query(riderRequestsRef, orderBy('createdAt', 'desc'));

    const unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
      const updatedRequests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRiderRequests(updatedRequests);
    });

    // vehicles listener
    const vehiclesRef = collection(db, 'vehicles');

    const unsubscribeVehicles = onSnapshot(vehiclesRef, (snapshot) => {
      const updatedVechicles = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVehicles(updatedVechicles);
    })

    // cleanup listeners on component unmount
    return () => {
      unsubscribeRequests();
      unsubscribeVehicles();
    };

  }, []);

  return (
      <div>
        <Header />
        <StatRow pendingRequests={riderRequests.length} activeVehicles={vehicles.length} />
        <RequestsSection requestsData={riderRequests}/>
      </div>
    );
  };

  export default AdminDashboard;