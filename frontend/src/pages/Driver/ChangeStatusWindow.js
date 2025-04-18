import React, { useState } from "react";
import "./ChangeStatusWindow.css";

const BACKEND_URL = 'http://localhost:5001'

function ChangeStatusWindow( {onClose, requestId, requestStatus} ) {

  const handleChange = async (e) => {
    const newStatus = e.target.value;

    try {
      const response = await fetch(BACKEND_URL + `/api/driver/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: requestId, newStatus: newStatus}),
      });

      if (!response.ok) {
        throw new Error('Failed to update driver status.');
      }
    } catch (err) {
      console.error('Error updating driver status:', err);
    }

    onClose();
  };

  return (
    <div className="popup-card">
      <div className="popup-header">Update Rider Status</div>
      <form className="status-options">
        <label className="radio-label">
          <input
            type="radio"
            value="assigned"
            checked={requestStatus === "assigned"}
            onChange={handleChange}
          />
          <span>On my way!</span>
        </label>
        <label className="radio-label">
          <input
            type="radio"
            value="picked up"
            checked={requestStatus === "picked up"}
            onChange={handleChange}
          />
          <span>Picked up</span>
        </label>
        <label className="radio-label">
          <input
            type="radio"
            value="complete"
            checked={requestStatus === "complete"}
            onChange={handleChange}
          />
          <span>Dropped off</span>
        </label>
      </form>
    </div>
  );
}

export default ChangeStatusWindow;
