import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import './LoginStyles.css';

function OtpPage() {
  const { verifyOtp } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const phoneNumber = location.state?.phoneNumber || '';

  const handleOtpChange = (index, value) => {
    // Ensure value is a digit
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-advance to next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      await verifyOtp(otpValue);
      navigate('/login/email');
    } catch (error) {
      setError('Invalid verification code: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate('/login/phone');
  };

  // Format phone number for display
  const formatPhone = (phone) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) {
      return `(${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6)}`;
    }
    return phone;
  };

  return (
    <div className="login-page">
      <div className="page-content">
        <div className="page-header">
          <h2>Confirm your phone number</h2>
          <p className="subtitle">Enter the 6-digit code sent via SMS at:<br />{formatPhone(phoneNumber)}</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleOtpSubmit}>
          <div className="otp-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className="otp-input"
              />
            ))}
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

export default OtpPage;