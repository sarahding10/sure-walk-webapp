import React from 'react';
import './Requests.css';

function RequestsHeader({ totalRequests, onBulkAssign, handleFilterRowsClick, selectedRequests }) {
  // Only trigger onBulkAssign if there are selected requests
  const handleBulkAssignClick = (e) => {
    if (selectedRequests && selectedRequests.length > 0) {
      onBulkAssign(e);  // Trigger the bulk assign function
    } else {
      alert('Please select at least one request to bulk assign');
    }
  };

  return (
    <div className="requests-header">
      <div className="left-side">
        <h2 className="requests-title">Ride Requests ({totalRequests})</h2>
          <div className="filters-section">
          <button className="filter-button" onClick={handleFilterRowsClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Filter by
          </button>
        </div>
      </div>
      <button
        className={`bulk-assign-button ${selectedRequests.length > 0 ? 'active' : 'inactive'}`}
        onClick={(e) => handleBulkAssignClick(e, selectedRequests)}
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
