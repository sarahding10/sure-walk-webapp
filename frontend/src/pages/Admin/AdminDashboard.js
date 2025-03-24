import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config.js';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import Header from './Header/Header';
import RequestsSection from './Requests/RequestsSection';
import StatRow from './Stats/StatRow';

function AdminDashboard () {
  const [riderRequests, setRiderRequests] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    // Get shift bounds
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Set shift start (5 PM today)
    const shiftStart = new Date(today.setHours(17, 0, 0, 0)); // 5 PM today

    // Set shift end (5 AM tomorrow)
    const shiftEnd = new Date(tomorrow.setHours(5, 0, 0, 0)); // 5 AM tomorrow

    // By day for testing
    // const shiftStart = new Date(today.setHours(0, 0, 0, 0)); // midnight
    // const shiftEnd = new Date(today.setHours(24, 24, 24, 24)); // midnight

    // requests query for the same day
    const riderRequestsRef = collection(db, 'requests');
    const requestsQuery = query(
      riderRequestsRef,
      where('createdAt', '>=', shiftStart),  // Created after or at the start of today
      where('createdAt', '<=', shiftEnd),    // Created before or at the end of today
      orderBy('createdAt', 'desc')           // Optional: Order by creation date
    );

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
      const updatedVehicles = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVehicles(updatedVehicles);
    });

    // cleanup listeners on component unmount
    return () => {
      unsubscribeRequests();
      unsubscribeVehicles();
    };

  }, []);

  // Filter same day pending requests
  const pendingRequests = riderRequests.filter((request) => request.status === "pending");

  // Filter same day user canceled requests
  const userCanceled = riderRequests.filter((request) => request.status === "canceled" && request.canceledBy && request.canceledBy === 'rider');

  // Filter same day admin canceled requests
  const adminCanceled = riderRequests.filter((request) => request.status === "canceled" && request.canceledBy && request.canceledBy === 'admin');

  // Filter for active vehicles
  const activeVehicles = vehicles.filter((vehicle) => vehicle.driver !== "");

  return (
    <div>
      <Header />
      <StatRow
        totalRequests={riderRequests.length}
        pendingRequests={pendingRequests.length}
        userCanceledCount={userCanceled.length}
        adminCanceledCount={adminCanceled.length}
        activeVehicles={activeVehicles.length}
      />
      <RequestsSection requestsData={riderRequests}/>
    </div>
  );
}

export default AdminDashboard;
