import React, { useState, useEffect } from 'react';
import './RowFilterWindow.css';

const statuses = ['pending', 'assigned', 'picked up', 'completed', 'cancelled'];

function RowFilterWindow({ isOpen, onClose, requestsData, filteredRequestsData, setFilteredRequestsData }) {
    const BACKEND_URL = process.env.REACT_APP_API_BASE_URL;
    const [vehicles, setVehicles] = useState([]);
    const [selectedStatuses, setSelectedStatuses] = useState([...statuses]);
    const [selectedVehicles, setSelectedVehicles] = useState([...vehicles]);
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch(BACKEND_URL + '/api/admin/available-vehicles');
                if (!response.ok) throw new Error('Failed to fetch vehicles');
                const data = await response.json();
                setVehicles(data);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            }
        };
        if (isOpen) fetchVehicles();
    }, [isOpen]);

    useEffect(() => {
        setSelectedVehicles(vehicles.map(vehicle => vehicle.id));
    }, [vehicles]);

    const toggleStatus = (status) => {
        setSelectedStatuses((prev) =>
            prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
        );
    };

    const toggleVehicle = (vehicle) => {
        setSelectedVehicles((prev) =>
            prev.includes(vehicle) ? prev.filter((v) => v !== vehicle) : [...prev, vehicle]
        );
    };

    const selectAll = () => {
        setSelectedStatuses([...statuses]);
        setSelectedVehicles(vehicles.map(vehicle => vehicle.id));
        setPickup('');
        setDropoff('');
    };

    const handleSave = () => {
        if (!requestsData || requestsData.length === 0) {
            console.log('No requests available');
            return;
        }

        const filteredRequests = requestsData.filter(request => {
            const matchesStatus = selectedStatuses.some(status => {
                const match = request.status.toLowerCase() === status.toLowerCase();
                return match;
            });

            return matchesStatus;
        });

        // Update the requests state with the filtered data
        setFilteredRequestsData(filteredRequests);

        onClose(); // Close the filter window
    };



    if (!isOpen) return null;

    return (
        <div className="filter-window">
            <div className="header">
                <h2 className="header-title">Filter requests by</h2>
                <button onClick={onClose} className="close-btn">×</button>
            </div>

            <div className="link-buttons">
                <button onClick={selectAll} className="btn-link">Select all</button>
                <span>•</span>
                <button onClick={selectAll} className="btn-link">Reset</button>
            </div>

            <div className="filter-grid">
                <div className="filter-col">
                    <h4 className="filter-label">Status</h4>
                    {statuses.map((status) => (
                        <label key={status} className="filter-item">
                            <input
                                type="checkbox"
                                checked={selectedStatuses.includes(status)}
                                onChange={() => toggleStatus(status)}
                            />
                            <span>{status}</span>
                        </label>
                    ))}
                </div>

                <div className="filter-col">
                    <h4 className="filter-label">Vehicle</h4>
                    {vehicles.map((vehicle) => (
                        <label key={vehicle.id} className="filter-item">
                            <input
                                type="checkbox"
                                checked={selectedVehicles.includes(vehicle.id)}
                                onChange={() => toggleVehicle(vehicle.id)}
                            />
                            <span>{`${vehicle.type} #${vehicle.typeIndex}`}</span>
                        </label>
                    ))}
                </div>

                <div className="filter-col">
                    <div className="input-fields">
                        <div>
                            <h4 className="filter-label">Pick up</h4>
                            <input
                                type="text"
                                value={pickup}
                                onChange={(e) => setPickup(e.target.value)}
                                placeholder="   Pick up Location"
                                className="input-field"
                            />
                        </div>

                        <div>
                            <h4 className="filter-label">Drop off</h4>
                            <input
                                type="text"
                                value={dropoff}
                                onChange={(e) => setDropoff(e.target.value)}
                                placeholder={"   Drop off Location"}
                                className="input-field"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="save-btn-container">
                <button className="save-btn" onClick={handleSave}>Save</button>
            </div>
        </div>
    );
}

export default RowFilterWindow;