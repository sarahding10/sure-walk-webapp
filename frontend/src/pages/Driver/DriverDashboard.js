import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config.js';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';

function DriverDashboard() {
    const [assignedRequests, updateAssignedRequests] = useState([]);

    // vehicles have an assignedRequests array
    // can then query requests by requestId in array for status

    useEffect(() => {
        // vehicles listener
        const vehiclesRef = collection(db, 'vehicles');
        const unsubscribeVehicles = onSnapshot(vehiclesRef, (snapshot) => {
        const updatedAssignedRequests = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        updateAssignedRequests(updatedAssignedRequests);
        console.log(assignedRequests);
        });

        // cleanup listeners on component unmount
        return () => {
        unsubscribeRequests();
        unsubscribeVehicles();
        };
    }, []);
}

export default DriverDashboard;