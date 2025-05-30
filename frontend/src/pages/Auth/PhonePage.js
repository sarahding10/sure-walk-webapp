import React, { useState, useRef } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../../contexts/AuthContext'; 
import './LoginStyles.css';  

function PhonePage({ userType }) {   
  const { setupRecaptcha, signInWithPhone } = useAuth();   
  const [phoneNumber, setPhoneNumber] = useState('');   
  const [loading, setLoading] = useState(false);   
  const [error, setError] = useState('');   
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
      navigate(`/${userType}/auth/otp`, { state: { phoneNumber: formattedPhone } });     
    } catch (error) {       
      setError('Failed to send verification code: ' + error.message);     
    } finally {       
      setLoading(false);     
    }   
  };    
  
  const handleUserTypeSwitch = (newUserType) => {
    navigate(`/${newUserType}/auth/phone`);
  };

  const isEmployee = userType === 'employee' || userType === 'driver';
  
  return (     
    <div className="login-page">       
      <div className="page-content">         
        <div className="page-header">           
          <div className="logo-text">SureWalk</div>           
          <h2>{isEmployee ? 'Employee Login' : 'Sign up or log in!'}</h2>         
        </div>                  
        
        {error && <div className="error-message">{error}</div>}                  
        
        <form onSubmit={handlePhoneSubmit}>           
          <div className="form-group">             
            <label htmlFor="phone">Mobile Number</label>             
            <div className="phone-input-container">               
              <div className="country-code">                 
                +1               
              </div>               
              <input                 
                type="tel"                 
                id="phone"                 
                value={phoneNumber}                 
                onChange={(e) => setPhoneNumber(e.target.value)}                 
                placeholder="(555) 555-5555"                 
                required               
              />             
            </div>           
          </div>                      
          
          <div id="recaptcha-container" ref={recaptchaContainerRef}></div>                      
          
          <button type="submit" className="btn-primary" disabled={loading}>             
            Continue           
          </button>         
        </form>                  
        
        {!isEmployee && (
          <>
            <div className="divider">           
              <span>or</span>         
            </div>                  
            
            <div className="social-login">           
              <button className="btn-secondary">Continue with Apple</button>           
              <button className="btn-secondary">Continue with Google</button>           
              <button className="btn-secondary">Continue with Email</button>         
            </div>                  
            
            <div className="divider">           
              <span>or</span>         
            </div>                  
            
            <div className="find-account">           
              <button className="btn-link" onClick={() => handleUserTypeSwitch('employee')}>             
                Log in as employee           
              </button>         
            </div>
          </>
        )}
        
        {isEmployee && (
          <div className="find-account" style={{ marginTop: '20px' }}>           
            <button className="btn-link" onClick={() => handleUserTypeSwitch('rider')}>             
              Log in as rider           
            </button>         
          </div>
        )}
      </div>     
    </div>   
  ); 
}  

export default PhonePage;