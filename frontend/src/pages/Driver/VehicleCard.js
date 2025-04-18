import React from 'react';
import './VehicleCard.css';

function VehicleCard({ type, available, image, selected, onClick }) {
  return (
    <div
      className={`vehicle-card-horizontal ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="vehicle-info">
        <h3>{type}</h3>
        <p>Currently available</p>
        <p>Capacity: {available}</p>
      </div>
      <img src={image} alt={type} className="vehicle-img" />
    </div>
  );
}

export default VehicleCard;
