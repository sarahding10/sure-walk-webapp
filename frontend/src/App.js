import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AdminDashboard from './pages/Admin/AdminDashboard';

// Import other pages
import LoginRouter from './pages/Rider/LoginFlow/LoginRouter';
import RiderRequest from './pages/Rider/RideRequest/RideRequestMap';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            {/* Public routes */}
            <Route path="/login/*" element={<LoginRouter />} />

            {/* Rider routes */}
            <Route path="/rider/request" element={<RiderRequest />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/login" replace/>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;