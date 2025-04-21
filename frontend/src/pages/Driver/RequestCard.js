import './RequestCard.css';
import { useState } from 'react';
import ChangeStatusWindow from './ChangeStatusWindow';

function RequestCard({ requestId, request }) {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => setShowPopup(prev => !prev);
  const closePopup = () => setShowPopup(false);

  return (
    <>
      <div className="request-card">
        <div className="request-header">
          <div className="request-profile">
            <svg
              xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="profile-icon"
            >
              <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5 -5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
            </svg>
            <strong className="request-name">{request.displayName}</strong>
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="currentColor" className="dropdown-arrow"
            onClick={togglePopup}
            style={{ cursor: "pointer" }}
          >
            <path d="M7 10l5 5 5-5H7z" />
          </svg>
        </div>

        <div className="request-body">
          <p>
            <span className="label">Pick up:</span>{" "}
            <span className="location">{request.pickupLocation}</span>
          </p>
          <p>
            <span className="label">Drop off:</span>{" "}
            <span className="location">{request.dropoffLocation}</span>
          </p>
        </div>
      </div>

      {showPopup && (
        <div className="overlay" onClick={closePopup}>
          <div className="popup-container" onClick={e => e.stopPropagation()}>
            <ChangeStatusWindow onClose={closePopup} requestId={requestId} requestStatus={request.status}/>
          </div>
        </div>
      )}
    </>
  );
}

export default RequestCard;
