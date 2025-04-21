import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config.js';
import './DriverDashboard.css';
import RequestCard from './RequestCard';

const vehicleId = "U2tbpOzPtKC0GmJmsPTa";

function DriverDashboard() {
    const [assignedRequests, setAssignedRequests] = useState([]);
    const [vehicleData, setVehicleData] = useState(null);
    const [requestData, setRequestData] = useState({});

    const vehicleDocRef = doc(db, "vehicles", vehicleId);

    useEffect(() => {
        const unsubscribe = onSnapshot(vehicleDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setAssignedRequests(data.assignedRequests || []);
                setVehicleData(data);
            } else {
                setAssignedRequests([]);
                setVehicleData(null);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const unsubscribeRequestListeners = [];

        assignedRequests.forEach((requestId) => {
            const requestDocRef = doc(db, "requests", requestId);
            const unsubscribeRequest = onSnapshot(requestDocRef, (requestSnap) => {
                if (requestSnap.exists()) {
                    const data = requestSnap.data();
                    if (data.status !== "cancelled") {
                        setRequestData((prevData) => ({
                            ...prevData,
                            [requestId]: data,
                        }));
                    } else {
                        // Remove cancelled request if it exists
                        setRequestData((prevData) => {
                            const { [requestId]: _, ...rest } = prevData;
                            return rest;
                        });
                    }
                }
            });

            unsubscribeRequestListeners.push(unsubscribeRequest);
        });

        return () => {
            unsubscribeRequestListeners.forEach((unsubscribe) => unsubscribe());
        };
    }, [assignedRequests]);

    return (
        <div className="assigned-requests">
            <header>
                <h1>
                    {Object.keys(requestData).length > 0
                        ? `Assigned Requests - ${vehicleData?.type} #${vehicleData?.typeIndex}`
                        : 'No Current Requests'}
                </h1>
                <p>
                    {Object.keys(requestData).length > 0
                        ? 'Make sure to update the status of each request!'
                        : 'Rider requests assigned to you will show up below'}
                </p>
            </header>

            {Object.keys(requestData).length === 0 ? (
                <div className="empty-box">Waiting for dispatcher...</div>
            ) : (
                <div className="cards-container">
                    {Object.entries(requestData).map(([requestId, data]) => (
                        <RequestCard key={requestId} request={data} requestId={requestId} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default DriverDashboard;
