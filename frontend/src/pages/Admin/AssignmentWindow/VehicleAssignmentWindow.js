import React, { useState, useEffect } from 'react';
import RiderCard from './RiderCard';
import VehicleCard from './VehicleCard';
import './VehicleWindow.css';

const VehicleAssignmentWindow = ({ isOpen, onClose, selectedRequests, setSelectedRequests, setSelectedRows }) => {
  const BACKEND_URL = process.env.REACT_APP_API_BASE_URL;
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(BACKEND_URL + '/api/admin/available-vehicles');
        if (!response.ok) throw new Error('Failed to fetch vehicles');
        const data = await response.json();
        setVehicles(data);

        // Auto-select the first available vehicle that is not at capacity
        if (data.length > 0) {
          const firstAvailableVehicle = data.find((vehicle) => vehicle.assignedRequests.length < vehicle.capacity);
          // Ensure selected vehicle is set only once data is fetched
          setSelectedVehicle(firstAvailableVehicle || data[0]);
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    if (isOpen) fetchVehicles();
  }, [isOpen]);

  if (!isOpen) return null;

  // Function to handle confirming the vehicle assignment
  const handleVehicleAssigned = async () => {
    if (!selectedRequests || selectedRequests.length === 0 || !selectedVehicle) return;

    try {
      const response = await fetch(BACKEND_URL + `/api/admin/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestIds: selectedRequests.map((r) => r.id),
          vehicleId: selectedVehicle.id,
          vehicleName: `${selectedVehicle.type} #${selectedVehicle.typeIndex}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign vehicle to selected requests');
      }

      onClose();
      setSelectedVehicle(null); // Reset selected things after assignment
      setSelectedRequests([]);
      setSelectedRows([]);
    } catch (err) {
      console.error('Error assigning vehicle:', err);
    }
  };

  // Function to handle selecting a vehicle
  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle); // Allow manual selection
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2>Assign to available vehicle</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="popup-content">
          {/* Riders Section */}
          <div className="section">
            <h3>Riders:</h3>
            {selectedRequests.length > 0 ? (
              selectedRequests.map((rider) => <RiderCard key={rider.id} rider={rider} />)
            ) : (
              <p>No riders selected.</p>
            )}
          </div>

          {/* Vehicles Section */}
          <div className="section">
            <h3>Vehicles:</h3>
            {vehicles.length > 0 ? (
              vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  selectedVehicle={selectedVehicle}
                  setSelectedVehicle={handleSelectVehicle}
                />
              ))
            ) : (
              <p>Loading vehicles...</p>
            )}
          </div>
        </div>

        <div className="popup-footer">
          <button className="confirm-button" onClick={handleVehicleAssigned} disabled={!selectedVehicle}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleAssignmentWindow;
