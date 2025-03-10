import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import './LoginStyles.css';

function ProfilePage() {
  const { updateUserProfile } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [utId, setUtId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    // Validate form
    if (!firstName || !lastName || !utId) {
      setError('Please fill out all fields');
      return;
    }
    
    setLoading(true);
    try {
      // Save user profile to Firestore
      await updateUserProfile({
        firstName,
        lastName,
        utId,
        displayName: `${firstName} ${lastName}`,
        role: 'rider'
      });
      
      // Navigate to rider dashboard
      console.log("hi");
      navigate('/rider/request');
    } catch (error) {
      setError('Failed to save profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate('/login/email');
  };

  return (
    <div className="login-page">
      <div className="page-content">
        <div className="page-header">
          <h2>What's your name?</h2>
          <p className="subtitle">Let us know what we should call you!</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleProfileSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Lennon"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="utId">Enter UT EID</label>
            <p className="helper-text">Add your UT EID given by UT Austin</p>
            <input
              type="text"
              id="utId"
              value={utId}
              onChange={(e) => setUtId(e.target.value)}
              placeholder="12345"
              required
            />
          </div>
          
          <div className="navigation-buttons">
            <button type="button" className="btn-back" onClick={goBack}>
              <span className="back-arrow">←</span>
            </button>
            <button type="submit" className="btn-next" disabled={loading}>
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;