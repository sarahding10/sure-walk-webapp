import './VehicleWindow.css';

const RiderCard = ({ rider }) => (
  <div className="rider-card">
    <div className="rider-name">{rider.displayName}</div>
    <div className="rider-detail">Pick up: {rider.pickupLocation}</div>
    <div className="rider-detail">Drop off: {rider.dropoffLocation}</div>
  </div>
);

export default RiderCard;