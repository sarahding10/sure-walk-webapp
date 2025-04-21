import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import WelcomePage from './WelcomePage';
import PhonePage from './PhonePage';
import OtpPage from './OtpPage';
import EmailPage from './EmailPage';
import ProfilePage from './ProfilePage';

function AuthRouter() {
  // Get userType from URL params
  const { userType } = useParams();
  
  // Validate user type
  const validUserTypes = ['rider', 'driver', 'employee'];
  const isValidUserType = validUserTypes.includes(userType);
  
  if (!isValidUserType) {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<WelcomePage userType={userType} />} />
      <Route path="/phone" element={<PhonePage userType={userType} />} />
      <Route path="/otp" element={<OtpPage userType={userType} />} />
      <Route path="/email" element={<EmailPage userType={userType} />} />
      <Route path="/profile" element={<ProfilePage userType={userType} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AuthRouter;