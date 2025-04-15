import React, { useState, useEffect } from 'react';
import RequestRow from './RequestsRow';
import CancelPopupWindow from '../CancelPopupWindow/CancelPopupWindow';
import './Requests.css';

function RequestsTable({ requests, selectedRows, handleSelectRow, handleAssignVehicle }) {
  const [popupInfo, setPopupInfo] = useState({
    isOpen: false,
    x: 0,
    y: 0,
    requestId: null
  });

  const handleMoreButton = (event, requestId) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setPopupInfo({
      isOpen: true,
      y: rect.top + window.scrollY,
      x: rect.left,
      requestId: requestId
    });
  };

  return (
    <div className="requests-table-container">
      <table className="requests-table">
        <thead>
          <tr>
            <th className="checkbox-column">
            </th>
            <th>Full Name</th>
            <th>Pick Up Location</th>
            <th>Drop Off Location</th>
            <th>Status</th>
            <th>Vehicle</th>
            <th className="actions-column"></th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <RequestRow
              key={request.id}
              request={request}
              selected={selectedRows.includes(request.id)}
              handleSelectRow={handleSelectRow}
              handleAssignVehicle={handleAssignVehicle}
              handleMoreButton={handleMoreButton}
            />
          ))}
        </tbody>
      </table>
        {popupInfo.isOpen && (
        <CancelPopupWindow
          request={popupInfo.requestId}
          isOpen={popupInfo.isOpen}
          onClose={() => setPopupInfo({ ...popupInfo, isOpen: false })}
          position={{ x: popupInfo.x, y: popupInfo.y }}
        />
      )}
    </div>
  );
}

export default RequestsTable;