import React, { useEffect, useState } from 'react';
import './DriverDashboard.css';
import { useNavigate } from 'react-router-dom';
import VehicleCard from './VehicleCard';
import VanImage from '../../assets/images/sure-walk-van.png';
import GolfcartImage from '../../assets/images/sure-walk-golfcart.png';

const BACKEND_URL = 'http://localhost:5001';

function VehicleSelection({}) {
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [vehicles, setVehicles] = useState([
        {
          id: 1,
          type: 'Van',
          available: 4,
          image: VanImage,
        },
        {
          id: 2,
          type: 'Golfcart',
          available: 10,
          image: GolfcartImage,
        },
      ]);

  const navigate = useNavigate();

//   useEffect(() => {
//     const fetchVehicles = async () => {
//       try {
//         const response = await fetch(`${BACKEND_URL}/api/admin/available-vehicles`);
//         if (!response.ok) throw new Error('Failed to fetch vehicles');
//         const data = await response.json();
//         setVehicles(data);
//       } catch (error) {
//         console.error('Error fetching vehicles:', error);
//       }
//     };

//     fetchVehicles();
//   }, []);

const onSelectVehicle = (type) => {
    if (selectedVehicle === type) {
      // If the same vehicle is clicked again, deselect it
      setSelectedVehicle(null);
    } else {
      setSelectedVehicle(type);
    }
  };



  const handleStartShift = () => {
    if (selectedVehicle) {
      navigate('/driver/dashboard');
    } else {
      alert("Please select a vehicle first!");
    }
  };

  return (
    <div className="assigned-requests">
      <header>
        <h1>Choose your vehicle</h1>
        <p>The specific number will be assigned!</p>
      </header>
      <div className="cards-container">
        {vehicles.length > 0 ? (
          vehicles.map((v) => (
            <VehicleCard
              key={v.id}
              type={v.type}
              available={v.available}
              image={v.image}
              selected={selectedVehicle === v.type}
              onClick={() => onSelectVehicle(v.type)}
            />
          ))
        ) : (
          <div className="empty-box">No vehicles available</div>
        )}
      </div>
      <button className="start-shift-btn" onClick={handleStartShift}>Start Shift</button>
    </div>
  );
}

export default VehicleSelection;