import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import other pages
import Login from './pages/Rider/Login';
import RiderDashboard from './pages/Rider/RiderDashboard';
import RideRequest from './pages/Rider/RideRequest';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />

            {/* Rider routes */}
            <Route path="/rider" element={<RiderDashboard />} />
            <Route path="/rider/request" element={<RideRequest />} />

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;