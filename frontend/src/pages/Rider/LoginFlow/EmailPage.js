import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginStyles.css';

function EmailPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Validate email
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }
    navigate('/login/profile');
  };

  const goBack = () => {
    navigate('/login/otp');
  };

  return (
    <div className="login-page">
      <div className="page-content">
        <div className="page-header">
          <h2>Enter email address</h2>
          <p className="subtitle">Add your email for account recovery</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleEmailSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              required
            />
          </div>
          
          <div className="navigation-buttons">
            <button type="button" className="btn-back" onClick={goBack}>
              <span className="back-arrow">←</span>
            </button>
            <button type="submit" className="btn-next">
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmailPage;