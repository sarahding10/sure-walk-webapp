import React, { useEffect, useRef } from 'react';
import './CancelPopupWindow.css';

function CancelPopupWindow({ request, isOpen, onClose, position }) {
    const BACKEND_URL = process.env.REACT_APP_API_BASE_URL;
    const popupRef = useRef(null);

    // Close popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const onCancelClick = async () => {
        try {
            onClose();
            const response = await fetch(`${BACKEND_URL}/api/admin/cancel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId: request }),
            });
            if (!response.ok) throw new Error('Admin failed to cancel ride request');
        } catch (err) {
            console.error('Error canceling ride request:', err);
        }
    };

    const onMoreInfoClick = async () => {
        try {
            onClose();
            const response = await fetch(`${BACKEND_URL}/api/admin/getRiderDetails`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error('Failed to fetch rider details.');
        } catch (err) {
            console.error('Error getting rider details:', err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="cancel-popup-overlay">
            <div className="cancel-popup" ref={popupRef} style={{
                position: 'absolute',
                top: `${position.y}px`,
                left: `${position.x - 200}px`
            }}>
                <div className="cancel">
                    <div className="cancel-section" onClick={onCancelClick}>
                        <svg width="18" height="18" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="25" cy="25" r="22" stroke="#CE1313" strokeWidth="4" fill="none" />
                            <line x1="15" y1="15" x2="35" y2="35" stroke="#CE1313" strokeWidth="4" strokeLinecap="round" />
                            <line x1="35" y1="15" x2="15" y2="35" stroke="#CE1313" strokeWidth="4" strokeLinecap="round" />
                        </svg>
                        <span className="cancel-text">
                            Cancel Request
                        </span>
                    </div>
                    <hr></hr>
                    <div className="more-section">
                        <span onClick={onMoreInfoClick}>View Details</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CancelPopupWindow;
