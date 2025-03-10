import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import rider screens
import AuthScreen from './components/rider/AuthScreen';
import RideRequestScreen from './components/rider/RideRequestScreen';
import WaitingScreen from './components/rider/WaitingScreen';

// Import driver screens

// Import admin screens

const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, userRole } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && userRole !== requiredRole) {
    // Redirect based on actual role
    if (userRole === 'rider') return <Navigate to="/rider" />;
    if (userRole === 'driver') return <Navigate to="/driver" />;
    if (userRole === 'admin') return <Navigate to="/admin" />;
    return <Navigate to="/login" />;
  }
  
  return children;
};

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Welcome to Sure Walk!
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Rider routes */}
            <Route path="/rider" element={
              <ProtectedRoute requiredRole="rider">
                <RiderDashboard />
              </ProtectedRoute>
            } />
            <Route path="/rider/request" element={
              <ProtectedRoute requiredRole="rider">
                <RideRequest />
              </ProtectedRoute>
            } />
            
            {/* Admin routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/request/:id" element={
              <ProtectedRoute requiredRole="admin">
                <RequestDetails />
              </ProtectedRoute>
            } />
            
            {/* Driver routes */}
            <Route path="/driver" element={
              <ProtectedRoute requiredRole="driver">
                <DriverDashboard />
              </ProtectedRoute>
            } />
            <Route path="/driver/status" element={
              <ProtectedRoute requiredRole="driver">
                <DriverStatus />
              </ProtectedRoute>
            } />
            
            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
