import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './WelcomePage';
import PhonePage from './PhonePage';
import OtpPage from './OtpPage';
import EmailPage from './EmailPage';
import ProfilePage from './ProfilePage';

function LoginRouter() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/phone" element={<PhonePage />} />
      <Route path="/otp" element={<OtpPage />} />
      <Route path="/email" element={<EmailPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default LoginRouter;