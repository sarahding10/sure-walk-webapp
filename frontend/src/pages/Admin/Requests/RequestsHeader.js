import React from 'react';
import './Requests.css';

function RequestsHeader({ totalRequests, onBulkAssign, selectedRequests }) {
  // Only trigger onBulkAssign if there are selected requests
  const handleBulkAssignClick = () => {
    if (selectedRequests && selectedRequests.length > 0) {
      onBulkAssign();  // Trigger the bulk assign function
    } else {
      alert('Please select at least one request to bulk assign');  // Optional alert or other handling
    }
  };

  return (
    <div className="requests-header">
      <div className="left-side">
        <h2 className="requests-title">Ride Requests ({totalRequests})</h2>
        <button className="filter-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filter by
        </button>
      </div>
      <button
        className="bulk-assign-button"
        onClick={handleBulkAssignClick}
        disabled={selectedRequests.length === 0}  // disable the button when no requests are selected
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 17.25V21h3.75l12-12L15 5.25l-12 12z" />
        </svg>
        Bulk Assign
      </button>
    </div>
  );
};

export default RequestsHeader;
