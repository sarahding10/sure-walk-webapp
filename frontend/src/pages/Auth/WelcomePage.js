import React from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import './LoginStyles.css'; 
import sureWalkLogo from '../../../assets/images/sure-walk.webp'; 
import utLogo from '../../../assets/images/ut-logo.png';  

function WelcomePage({ userType }) {   
  const navigate = useNavigate();    
  
  const handleGetStarted = () => {     
    navigate(`/${userType}/auth/phone`);   
  };    
  
  const renderTitle = () => {
    switch(userType) {
      case 'driver':
        return "Welcome, Driver!";
      case 'employee':
        return "Employee Login";
      default:
        return "Ensuring safety for late night walks!";
    }
  };

  return (     
    <div className="login-page">       
      <div className="welcome-content">         
        <div className="logo-container">           
          <img src={sureWalkLogo} alt="SureWalk Logo" className="logo" />           
          <p className="tagline">
            <strong>{renderTitle()}</strong><br />
            From 7 pm - 2 am
          </p>         
        </div>                  
        
        <button className="btn-primary get-started" onClick={handleGetStarted}>           
          Get Started         
        </button>                  
        
        <div className="university-logo">           
          <img src={utLogo} alt="University of Texas at Austin" />         
        </div>       
      </div>     
    </div>   
  ); 
}  

export default WelcomePage;