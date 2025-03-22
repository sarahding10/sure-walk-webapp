import React from 'react';
import './Requests.css';

function RequestsHeader ({ totalRequests, onBulkAssign, hasSelection }) {
  return (
    <div className="requests-header">
      <h2 className="requests-title">Requests ({totalRequests})</h2>
      <div className="requests-actions">
        <button className="filter-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filter by
        </button>
        <button
          className={`bulk-assign-button ${hasSelection ? 'active' : ''}`}
          onClick={onBulkAssign}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Bulk Assign
        </button>
      </div>
    </div>
  );
};

export default RequestsHeader;