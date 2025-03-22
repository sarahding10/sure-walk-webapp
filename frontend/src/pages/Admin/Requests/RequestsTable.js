// RequestsTable.jsx
import React from 'react';
import './Requests.css';

function RequestsTable ({ requests, selectedRows, onSelectRow }) {
  // Function to determine status badge class
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'picked up':
        return 'status-picked-up';
      case 'complete':
        return 'status-complete';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  return (
    <div className="requests-table-container">
      <table className="requests-table">
        <thead>
          <tr>
            <th className="checkbox-column">
              {/* You could add a "select all" checkbox here */}
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
          {requests.map(request => (
            <tr key={request.id} className={selectedRows.includes(request.id) ? 'selected' : ''}>
              <td className="checkbox-column">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(request.id)}
                  onChange={() => onSelectRow(request.id)}
                />
              </td>
              <td>{request.name}</td>
              <td>{request.pickupLocation}</td>
              <td>{request.dropoffLocation}</td>
              <td>
                <span className={`status-badge ${getStatusClass(request.status)}`}>
                  {request.status}
                </span>
              </td>
              <td className="actions-column">
              {request.status.toLowerCase() === 'pending' ? (
                <button className="assign-button">Assign</button>
              ) : (
                <span>{request.vehicle}</span>
              )}
              </td>
              <td className="actions-column">
                <button className="more-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <circle cx="12" cy="4" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="20" r="2" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestsTable;