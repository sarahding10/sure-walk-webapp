import React, { useState } from 'react';
import './RequestCard.css';

const RequestCard = ({ name, pickup, dropoff, status }) => {
  const [expanded, setExpanded] = useState(false);
  const cardClass = status === 'active' ? 'card active' : 'card inactive';

  return (
    <div className={cardClass}>
      <div className="card-header">
        <div className="icon-name">
          <span className="user-icon">👤</span>
          <span className="name">{name}</span>
        </div>
        <button className="toggle-btn" onClick={() => setExpanded(!expanded)}>
          {expanded ? '▲' : '▼'}
        </button>
      </div>
      <div className="card-details">
        <p><strong>Pick up:</strong> {pickup}</p>
        <p><strong>Drop off:</strong> {dropoff}</p>
      </div>
    </div>
  );
};

export default RequestCard;