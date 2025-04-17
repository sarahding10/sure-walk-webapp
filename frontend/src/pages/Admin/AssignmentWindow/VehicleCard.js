import React from 'react';
import './VehicleWindow.css';

const VehicleCard = ({ vehicle, selectedVehicle, setSelectedVehicle }) => {
  const assignedRidesCount = Array.isArray(vehicle.assignedRequests)
    ? vehicle.assignedRequests.length
    : 0;

  const isDisabled = assignedRidesCount >= vehicle.capacity;
  const isSelected = selectedVehicle?.id === vehicle.id;

  const handleCardClick = () => {
    if (!isDisabled) {
      setSelectedVehicle(vehicle);
    }
  };

  return (
    <div
      key={vehicle.id}
      className={`vehicle-option ${isSelected ? 'selected' : ''}`}
      onClick={handleCardClick}
      style={{ cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.5 : 1 }}
    >
      <div className="vehicle-radio" onClick={(e) => e.stopPropagation()}>
        <input
          type="radio"
          id={vehicle.id}
          name="vehicle"
          disabled={isDisabled}
          checked={isSelected}
          onChange={() => setSelectedVehicle(vehicle)}
        />
        <label htmlFor={vehicle.id}>
          {vehicle.type} #{vehicle.typeIndex} • {assignedRidesCount}/{vehicle.capacity} {isDisabled && "(At capacity)"}
        </label>
      </div>

      <div className="vehicle-details">
        <div>Last seen location: {vehicle.lastLocation || 'None'}</div>
        <div>Next stop: {vehicle.nextLocation || 'None'}</div>
      </div>
    </div>
  );
};

export default VehicleCard;
