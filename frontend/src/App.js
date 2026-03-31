import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './app/store';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Desks from './pages/Desks';
import MeetingRooms from './pages/MeetingRooms';
import Announcements from './pages/Announcements';
import Bookings from './pages/Bookings';
import Billing from './pages/Billing';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

// Layout
import Layout from './components/Layout';

// Styles
import './App.css';

function AppContent() {
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const user = useSelector((state) => state.auth?.user);
  const isAdmin = user?.role === 'admin';

  return (
    <>
      <Toaster 
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4caf50',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#f44336',
              secondary: '#fff',
            },
          },
        }}
      />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {isAuthenticated ? (
            <Route element={<Layout />}>
              {isAdmin ? (
                // Admin-only routes
                <>
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/" element={<Navigate to="/admin" />} />
                  <Route path="*" element={<Navigate to="/admin" />} />
                </>
              ) : (
                // Regular user routes
                <>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/desks" element={<Desks />} />
                  <Route path="/meeting-rooms" element={<MeetingRooms />} />
                  <Route path="/announcements" element={<Announcements />} />
                  <Route path="/bookings" element={<Bookings />} />
                  <Route path="/billing" element={<Billing />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/admin" element={<Navigate to="/dashboard" />} />
                </>
              )}
            </Route>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Router>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
