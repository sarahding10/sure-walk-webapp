import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AdminDashboard from './pages/Admin/AdminDashboard';
import DriverDashboard from './pages/Driver/DriverDashboard';
import VehicleSelection from './pages/Driver/VehicleSelection';

// Import other pages
import LoginRouter from './pages/Rider/LoginFlow/LoginRouter';
import RiderRequest from './pages/Rider/RideRequest/RideRequestMap';
import RideTracking from './pages/Rider/RideTracking/RideTracking';

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

            <Route path="/rider/tracking/:rideId" element={<RideTracking />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Driver routes */}
            <Route path="/driver" element={<VehicleSelection />} />
            <Route path="/driver/dashboard" element={<DriverDashboard />} />

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/login" replace/>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;