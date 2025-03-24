import React, { useState, useEffect } from 'react';
import RequestRow from './RequestsRow';
import './Requests.css';

function RequestsTable({ requests, selectedRows, handleSelectRow, handleAssignVehicle }) {
  
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
          {requests.map((request) => (
            <RequestRow
              key={request.id}
              request={request}
              selected={selectedRows.includes(request.id)}
              handleSelectRow={handleSelectRow}
              handleAssignVehicle={handleAssignVehicle}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RequestsTable;