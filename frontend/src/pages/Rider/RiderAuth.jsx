import React, { useState } from 'react';
import { signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import Logo from '../common/Logo';

const RiderAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [step, setStep] = useState('phone'); // phone, verification, email, profile
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [utEid, setUtEid] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': () => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    });
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      setupRecaptcha();
      const formattedNumber = phoneNumber.startsWith('+1') ? phoneNumber : `+1${phoneNumber}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedNumber, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      setStep('verification');
    } catch (err) {
      setError(`Error sending verification code: ${err.message}`);
      console.error(err);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await confirmationResult.confirm(verificationCode);
      setStep('email');
    } catch (err) {
      setError(`Error verifying code: ${err.message}`);
      console.error(err);
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setStep('profile');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Save user profile data to Firestore
      const user = auth.currentUser;
      if (user) {
        // Here you would save the user profile to Firebase
        // For now, we'll just navigate to the ride request page
        navigate('/rider/request');
      }
    } catch (err) {
      setError(`Error setting up profile: ${err.message}`);
      console.error(err);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 'phone':
        return (
          <div className="auth-container">
            <h2>Sign up or log in!</h2>
            <form onSubmit={handleSendCode}>
              <div className="form-group">
                <label>Mobile Number</label>
                <input 
                  type="tel" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="(555) 555-5555"
                  required
                />
              </div>
              <button type="submit" className="btn-primary">Continue</button>
              
              <div className="alternative-login">
                <button type="button" className="btn-secondary">Continue with Apple</button>
                <button type="button" className="btn-secondary">Continue with Google</button>
                <button type="button" className="btn-secondary">Continue with Email</button>
                <button type="button" className="btn-secondary">Create account</button>
              </div>
            </form>
          </div>
        );
      
      case 'verification':
        return (
          <div className="auth-container">
            <h2>Confirm your phone number</h2>
            <p>Enter the 4-digit code sent via SMS:</p>
            <form onSubmit={handleVerifyCode}>
              <div className="form-group verification-code">
                <input 
                  type="text" 
                  value={verificationCode} 
                  onChange={(e) => setVerificationCode(e.target.value)} 
                  placeholder="4-digit code"
                  maxLength="4"
                  required
                />
              </div>
              <button type="submit" className="btn-primary">Next</button>
              <button type="button" className="btn-link" onClick={() => setStep('phone')}>Back</button>
            </form>
          </div>
        );
        
      case 'email':
        return (
          <div className="auth-container">
            <h2>Enter email address</h2>
            <p>Add your email for account recovery</p>
            <form onSubmit={handleEmailSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <button type="submit" className="btn-primary">Next</button>
              <button type="button" className="btn-link" onClick={() => setStep('verification')}>Back</button>
            </form>
          </div>
        );
        
      case 'profile':
        return (
          <div className="auth-container">
            <h2>What's your name?</h2>
            <p>Let us know what we should call you!</p>
            <form onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label>First name</label>
                <input 
                  type="text" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                  placeholder="First name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Last name</label>
                <input 
                  type="text" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                  placeholder="Last name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Enter UT EID</label>
                <p className="field-helper">Add your UT EID given by UT Austin</p>
                <input 
                  type="text" 
                  value={utEid} 
                  onChange={(e) => setUtEid(e.target.value)} 
                  placeholder="UT EID"
                  required
                />
              </div>
              <button type="submit" className="btn-primary">Next</button>
              <button type="button" className="btn-link" onClick={() => setStep('email')}>Back</button>
            </form>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="auth-screen">
      <div id="recaptcha-container"></div>
      <Logo />
      {error && <div className="error-message">{error}</div>}
      {renderStep()}
    </div>
  );
};

export default RiderAuth;