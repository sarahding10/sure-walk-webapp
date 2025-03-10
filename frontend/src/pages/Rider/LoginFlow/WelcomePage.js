import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginStyles.css';

function WelcomePage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login/phone');
  };

  return (
    <div className="login-page">
      <div className="welcome-content">
        <div className="logo-container">
          <img src="sure-walk-webapp\frontend\src\sure-walk.webp" alt="SureWalk Logo" className="logo" />
          <h1>SureWalk</h1>
          <p className="tagline">Ensuring safety for late night walks!<br />From 7 pm - 2 am</p>
        </div>
        
        <button className="btn-primary get-started" onClick={handleGetStarted}>
          Get Started
        </button>
        
        <div className="university-logo">
          <img src="/texas-logo.png" alt="University of Texas at Austin" />
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;