import React, { useState } from 'react';
import RequestsHeader from './RequestsHeader';
import RequestsTable from './RequestsTable';
import './Requests.css';

function RequestsSection ({requestsData}) {
  const [selectedRows, setSelectedRows] = useState([]);

  // Function to handle selecting/deselecting rows
  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Function to handle bulk assignment
  const handleBulkAssign = () => {
    console.log('Bulk assigning rows:', selectedRows);
    // Implement your bulk assign logic here
  };

  return (
    <div className="requests-section">
      <RequestsHeader
        totalRequests={requestsData.length}
        onBulkAssign={handleBulkAssign}
        hasSelection={selectedRows.length > 0}
      />
      <RequestsTable
        requests={requestsData}
        selectedRows={selectedRows}
        onSelectRow={handleSelectRow}
      />
    </div>
  );
};

export default RequestsSection;