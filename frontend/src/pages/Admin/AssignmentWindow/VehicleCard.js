import React from 'react';
import './VehicleWindow.css';

const VehicleCard = ({ vehicle, selectedVehicle, setSelectedVehicle }) => {
    console.log("VehicleCard props:", { vehicle, selectedVehicle });
  const assignedRidesCount = vehicle.assignedRequests && Array.isArray(vehicle.assignedRequests)
    ? vehicle.assignedRequests.length
    : 0;

  const isDisabled = assignedRidesCount >= vehicle.capacity;

  return (
    <div key={vehicle.id} className="vehicle-option">
      <div className="vehicle-radio">
        <input
          type="radio"
          id={vehicle.id}
          name="vehicle"
          disabled={isDisabled}
          checked={selectedVehicle?.id === vehicle.id}
          onChange={() => setSelectedVehicle(vehicle)}
        />
        <label htmlFor={vehicle.id} style={{ opacity: isDisabled ? 0.5 : 1 }}>
          {vehicle.type} • {assignedRidesCount}/{vehicle.capacity} {isDisabled && "(At capacity)"}
        </label>
      </div>

      <div className="vehicle-details">
        <div>Last seen location: {vehicle.lastLocation}</div>
        <div>Next stop: {vehicle.nextLocation || 'None'}</div>
      </div>
    </div>
  );
};

export default VehicleCard;