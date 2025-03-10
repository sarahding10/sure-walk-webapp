import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase/config';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';

const CarComponent = ({ type, assignedRequests, capacity }) => {
    let lastLocation = assignedRequests

    return (
        <div className="car-component">
            <div className="car-section">
                <h2>{type}</h2>
                <p>Last Ride Location: {lastLocation}</p>
            </div>

            <div className="car-section">
                <span>{assignedRequests.length}/{capacity}</span>
            </div>
      </div>
    )
}

export default CarComponent;

