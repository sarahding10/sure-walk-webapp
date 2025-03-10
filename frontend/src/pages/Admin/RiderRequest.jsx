import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase/config';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';

const RiderRequest = ({ name, pickup, dropoff }) => {
  const [selectedVehicle, setSelectedVehicle] = useState("");

  return (
    <div className="rider-request">
    <div className="rider-section">
      <h2>{name}</h2>
      <p>Pick up: {pickup}</p>
      <p>Drop off: {dropoff}</p>
    </div>

    <div className="rider-section">
      <label htmlFor="vehicle-select">Assign Vehicle:</label>
      <select
        id="vehicle-select"
        value={selectedVehicle}
        onChange={(e) => setSelectedVehicle(e.target.value)}
>
        <option value="">Select a vehicle</option>
      </select>
    </div>
    </div>
  );
};

export default RiderRequest;


