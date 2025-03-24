import React, { useState } from 'react';
import RequestsHeader from './RequestsHeader';
import RequestsTable from './RequestsTable';
import VehicleAssignmentWindow from '../AssignmentWindow/VehicleAssignmentWindow';
import './Requests.css';

function RequestsSection({ requestsData }) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRequests, setSelectedRequests] = useState([]);  // To manage selected requests

  // Function to handle selecting/deselecting rows
  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Function to handle assigning a vehicle to a request
  const handleAssignVehicle = (requestId) => {
    // Get selected request details
    const selectedRequest = requestsData.find(r => r.id === requestId);

    // If any rows are selected, use those; otherwise, use the clicked request
    const selectedRequestsData = selectedRows.length > 0
      ? requestsData.filter(r => selectedRows.includes(r.id))  // Filter based on selectedRows
      : [selectedRequest];  // If no rows selected, use the clicked request

    setSelectedRequests(selectedRequestsData);
    setIsPopupOpen(true); // Open the popup when a request is selected
  };

  return (
    <div className="requests-section">
      <RequestsHeader
        totalRequests={requestsData.length}
        onBulkAssign={handleAssignVehicle}
        selectedRequests={selectedRows}
      />
      <RequestsTable
        requests={requestsData}
        selectedRows={selectedRows}
        handleSelectRow={handleSelectRow}
        handleAssignVehicle={handleAssignVehicle}
      />
      <VehicleAssignmentWindow
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        selectedRequests={selectedRequests}
      />
    </div>
  );
}

export default RequestsSection;
