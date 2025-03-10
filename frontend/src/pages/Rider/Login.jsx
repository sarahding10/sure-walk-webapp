// components/rider/Login.js
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/Login.css';

function Login() {
  const { setupRecaptcha, signInWithPhone, verifyOtp } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone', 'otp', 'email', 'profile'
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [utId, setUtId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const recaptchaContainerRef = useRef(null);
  const navigate = useNavigate();

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const formattedPhone = '+1' + phoneNumber.replace(/\D/g, '');
      const appVerifier = setupRecaptcha('recaptcha-container');
      await signInWithPhone(formattedPhone, appVerifier);
      setStep('otp');
    } catch (error) {
      setError('Failed to send verification code: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await verifyOtp(otp);
      // Check if user has profile info
      // For now, let's assume they need to fill it out
      setStep('email');
    } catch (error) {
      setError('Invalid verification code: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Validate email
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }
    setStep('profile');
  };

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
      // This would be handled in a real implementation
      // For now, we'll just navigate to the rider dashboard
      navigate('/rider');
    } catch (error) {
      setError('Failed to save profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'phone':
        return (
          <div className="login-step">
            <h2>Sign up or log in!</h2>
            <form onSubmit={handlePhoneSubmit}>
              <div className="form-group">
                <label htmlFor="phone">Mobile Number</label>
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="(555) 555-5555"
                  required
                />
              </div>
              <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
              <button type="submit" className="btn-primary" disabled={loading}>
                Continue
              </button>
            </form>
            <div className="social-login">
              <button className="btn-secondary">Continue with Apple</button>
              <button className="btn-secondary">Continue with Google</button>
              <button className="btn-secondary">Continue with Email</button>
            </div>
          </div>
        );
        
      case 'otp':
        return (
          <div className="login-step">
            <h2>Confirm your phone number</h2>
            <p>Enter the 4-digit code sent via SMS to {phoneNumber}</p>
            <form onSubmit={handleOtpSubmit}>
              <div className="form-group otp-group">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="4-digit code"
                  maxLength="4"
                  required
                />
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                Next
              </button>
              <button type="button" className="btn-link" onClick={() => setStep('phone')}>
                Back
              </button>
            </form>
          </div>
        );
        
      case 'email':
        return (
          <div className="login-step">
            <h2>Enter email address</h2>
            <p>Add your email for account recovery</p>
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
              <button type="submit" className="btn-primary">
                Next
              </button>
              <button type="button" className="btn-link" onClick={() => setStep('otp')}>
                Back
              </button>
            </form>
          </div>
        );
        
      case 'profile':
        return (
          <div className="login-step">
            <h2>What's your name?</h2>
            <p>Let us know what we should call you!</p>
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
              <button type="submit" className="btn-primary" disabled={loading}>
                Next
              </button>
              <button type="button" className="btn-link" onClick={() => setStep('email')}>
                Back
              </button>
            </form>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        <img src="/logo.png" alt="SureWalk Logo" className="logo" />
        <h1>SureWalk</h1>
        <p className="tagline">Ensuring safety for late-night walks!<br />From 7pm - 2 am</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {renderStep()}
      
      {step === 'phone' && (
        <div className="start-section">
          <button className="btn-start" onClick={() => setStep('phone')}>
            Get Started
          </button>
        </div>
      )}
    </div>
  );
}

export default Login;