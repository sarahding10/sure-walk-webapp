import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config.js';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import RiderRequests from './RiderRequest';
import Vehicles from './VehicleComponent';
import './AdminStyles.css';


function AdminDashboard() {
    const [riderRequests, setRiderRequests] = useState([]);
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        // Listener for rider requests
        const riderRequestsRef = collection(db, 'requests');
        const requestsQuery = query(riderRequestsRef, orderBy('createdAt', 'desc')); // Order by most recent

        const unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
            if (snapshot.empty) {
                console.log('No documents found in the collection.');
            } else {
                snapshot.docs.forEach((doc) => {
                    console.log('Document ID:', doc.id);
                    console.log('Document Data:', doc.data());
                });
            }
            const updatedRequests = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setRiderRequests(updatedRequests);
        });

        // Listener for vehicles
        const vehiclesRef = collection(db, 'vehicles'); // Collection name in Firestore
        // const vehiclesQuery = query(vehiclesRef, orderBy('createdAt', 'desc')); // Optional ordering

        const unsubscribeVehicles = onSnapshot(vehiclesRef, (snapshot) => {
            const updatedVehicles = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setVehicles(updatedVehicles);
        });

        // Cleanup listeners on component unmount
        return () => {
            unsubscribeRequests();
            unsubscribeVehicles();
        };
    }, []);

    return (
        <div className="admin-dashboard">
            <div className="dashboard-section">
                <h1>Rider Requests ({riderRequests.length})</h1>
                {riderRequests.map((request) => (
                    <RiderRequests
                        key={request.id}
                        name={request.riderName}
                        pickup={request.pickupLocation}
                        dropoff={request.dropoffLocation}
                    />
                ))}
            </div>

            <div className="dashboard-section">
                <h1>Vehicles ({vehicles.length})</h1>
                {vehicles.map((vehicle) => (
                    <Vehicles
                        key={vehicle.id}
                        type={vehicle.vehicleType}
                        lastLocation={vehicle.lastLocation}
                        assignedRequests={vehicle.assignedRequests}
                        capacity={vehicle.capacity}
                    />
                ))}
            </div>
        </div>
    );
}

export default AdminDashboard;
