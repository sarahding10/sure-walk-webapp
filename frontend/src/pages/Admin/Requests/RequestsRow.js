import React, { memo } from 'react';
import './Requests.css';

const RequestRow = ({ request, selected, handleSelectRow, handleAssignVehicle }) => {
  // Function to determine status badge class
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'assigned':
        return 'status-assigned';
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

  // Disable selection for non-pending requests
  const isDisabled = request.status.toLowerCase() !== 'pending';

  const handleRowClick = () => {
    if (request.status.toLowerCase() === 'pending') {
        handleSelectRow(request.id); // Only allow selection for pending rows
    }
    };

  return (
    <tr
      className={`request-row ${selected ? 'selected' : ''} ${isDisabled ? 'disabled-row' : ''}`}
      onClick={handleRowClick}
      style={{ cursor: isDisabled ? 'default' : 'pointer' }}
    >
      {/* Checkbox column */}
      <td className="checkbox-column">
        <input
            type="checkbox"
            checked={selected}
            onChange={() => handleSelectRow(request.id)}
            className="checkbox"
            disabled={isDisabled}
        />
        </td>

      {/* Request details */}
      <td>{request.displayName}</td>
      <td>{request.pickupLocation}</td>
      <td>{request.dropoffLocation}</td>
      <td>
        <span className={`status-badge ${getStatusClass(request.status)}`}>
          {request.status.charAt(0).toUpperCase() + request.status.slice(1).toLowerCase()}
        </span>
      </td>

      {/* Action column */}
      <td className="actions-column">
        {request.status.toLowerCase() === 'pending' ? (
          <button
            className="assign-button"
            onClick={() => handleAssignVehicle(request.id, 'status', 'assigned')}
          >
            Assign
          </button>
        ) : (
          <span>{request.assignedVehicle}</span>
        )}
      </td>

      {/* More options button */}
      <td className="actions-column">
        <button className="more-button" disabled={isDisabled}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="none"
          >
            <circle cx="12" cy="4" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="20" r="2" />
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default memo(RequestRow);
