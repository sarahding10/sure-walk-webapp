import React, { useState, useEffect } from 'react';
import RiderRequests from './RiderRequest';
import Vehicles from './VehicleComponent';
import './AdminStyles.css';

function AdminDashboard() {


    return (
        <div className="admin-dashboard">
            <div className="dashboard-section">
                <h1>Rider Requests ({1})</h1>
                    <RiderRequests
                        key={10}
                        name={"Test Rider"}
                        pickup={"PCL"}
                        dropoff={"Texas Union"}
                    />
            </div>

            <div className="dashboard-section">
                <h1>Vehicles (4)</h1>
                {/* Passing the entire rides array to Vehicles component */}
                <Vehicles key={1} type={"Car 1"} assignedRequests={[]} capacity={4} />
            </div>
        </div>
    );
}

export default AdminDashboard;
