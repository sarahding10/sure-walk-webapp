import React, { useState, useEffect } from 'react';
import RequestsHeader from './RequestsHeader';
import RequestsTable from './RequestsTable';
import VehicleAssignmentWindow from '../AssignmentWindow/VehicleAssignmentWindow';
import RowFilterWindow from '../FilterWindow/RowFilterWindow';
import './Requests.css';

function RequestsSection({ requestsData }) {
  const [filteredRequests, setFilteredRequests] = useState(requestsData);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isVehiclePopupOpen, setIsVehiclePopupOpen] = useState(false);
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [selectedRequests, setSelectedRequests] = useState([]);

  // Function to handle selecting/deselecting rows
  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Function to open filter row window
  const handleFilterRowsClick = () => {
    setIsFilterPopupOpen(true);
  };

  // Function to handle assigning a vehicle to a request
  const handleAssignVehicle = (event, requestId) => {
    event.stopPropagation();
    const selectedRequest = filteredRequests.find(r => r.id === requestId);  // Use filteredRequests for assignment
    const selectedRequestsData = selectedRows.length > 0
      ? filteredRequests.filter(r => selectedRows.includes(r.id))
      : [selectedRequest];
    setSelectedRequests(selectedRequestsData);
    setIsVehiclePopupOpen(true); // Open the popup when a request is selected
  };

  // Function to handle the filter save logic
  const handleFilterSave = (filteredData) => {
    setFilteredRequests(filteredData); // Update the filtered requests
    setIsFilterPopupOpen(false); // Close the filter window
  };

  // Function to revert to original data (requestsData)
  const revertToOriginal = () => {
    setFilteredRequests([...requestsData]);  // Reset to original data
  };

  useEffect(() => {
    setFilteredRequests(requestsData);
  }, [requestsData]);

  return (
    <div className="requests-section">
      <RequestsHeader
        totalRequests={filteredRequests.length}  // Display filtered requests length
        onBulkAssign={handleAssignVehicle}
        selectedRequests={selectedRows}
        handleFilterRowsClick={handleFilterRowsClick}
        handleRevert={revertToOriginal}  // Function to revert to original data
      />
      <RequestsTable
        requests={filteredRequests}  // Use filteredRequests for display
        selectedRows={selectedRows}
        handleSelectRow={handleSelectRow}
        handleAssignVehicle={handleAssignVehicle}
      />
      <RowFilterWindow
        isOpen={isFilterPopupOpen}
        onClose={() => setIsFilterPopupOpen(false)}
        requestsData={requestsData}
        filteredRequestsData={filteredRequests}
        setFilteredRequestsData={setFilteredRequests}
      />
      <VehicleAssignmentWindow
        isOpen={isVehiclePopupOpen}
        onClose={() => setIsVehiclePopupOpen(false)}
        selectedRequests={selectedRequests}
        setSelectedRequests={setSelectedRequests}
        setSelectedRows={setSelectedRows}
      />
    </div>
  );
}

export default RequestsSection;