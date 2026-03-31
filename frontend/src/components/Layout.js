import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = isAdmin ? [
    { name: 'Admin Dashboard', path: '/admin', icon: '🔐' },
  ] : [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Desks', path: '/desks', icon: '💻' },
    { name: 'Meeting Rooms', path: '/meeting-rooms', icon: '🏢' },
    { name: 'My Bookings', path: '/bookings', icon: '📅' },
    { name: 'Announcements', path: '/announcements', icon: '📢' },
    { name: 'Billing', path: '/billing', icon: '💰' },
    { name: 'Profile', path: '/profile', icon: '👤' },
  ];

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
      position: 'relative'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        background: 'linear-gradient(180deg, rgba(20, 20, 20, 0.98) 0%, rgba(10, 10, 10, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        padding: '2rem 1.25rem',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '4px 0 40px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Logo */}
        <div style={{ 
          marginBottom: '2.5rem',
          textAlign: 'center',
          padding: '1.25rem',
          background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.1) 0%, rgba(185, 103, 255, 0.1) 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(0, 217, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 217, 255, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #00d9ff, transparent)',
            animation: 'shimmer 2s infinite'
          }} />
          <h2 style={{ 
            margin: 0,
            fontSize: '1.75rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #00d9ff 0%, #b967ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.5px',
            textShadow: '0 0 30px rgba(0, 217, 255, 0.5)'
          }}>
            🏢 CoworkSpace
          </h2>
          <p style={{ 
            margin: '0.5rem 0 0 0',
            fontSize: '0.75rem',
            color: '#a0a0a0',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontWeight: '600'
          }}>
            Premium Workspace
          </p>
        </div>
        
        {/* User Info */}
        <div style={{ 
          marginBottom: '2.5rem', 
          padding: '1.5rem',
          background: isAdmin 
            ? 'linear-gradient(135deg, rgba(255, 0, 110, 0.15) 0%, rgba(255, 0, 110, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(0, 217, 255, 0.15) 0%, rgba(185, 103, 255, 0.05) 100%)',
          borderRadius: '16px',
          border: isAdmin 
            ? '1px solid rgba(255, 0, 110, 0.3)' 
            : '1px solid rgba(0, 217, 255, 0.3)',
          boxShadow: isAdmin 
            ? '0 8px 32px rgba(255, 0, 110, 0.2)'
            : '0 8px 32px rgba(0, 217, 255, 0.2)',
          position: 'relative'
        }}>
          {isAdmin && (
            <div style={{
              position: 'absolute',
              top: '-8px',
              right: '12px',
              background: 'linear-gradient(135deg, #ff006e 0%, #ff4d8f 100%)',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '0.7rem',
              fontWeight: '700',
              color: 'white',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '0 4px 12px rgba(255, 0, 110, 0.4)'
            }}>
              ⚡ Admin
            </div>
          )}
          <p style={{ 
            fontSize: '0.75rem', 
            color: '#a0a0a0',
            marginBottom: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            fontWeight: '600'
          }}>
            {isAdmin ? 'System Administrator' : 'Welcome Back'}
          </p>
          <h3 style={{ 
            margin: 0,
            fontSize: '1.2rem',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '0.5rem',
            letterSpacing: '0.3px'
          }}>
            {user?.name || 'Guest User'}
          </h3>
          <p style={{ 
            fontSize: '0.85rem', 
            color: '#b0b0b0',
            marginBottom: '1rem',
            wordBreak: 'break-word'
          }}>
            {user?.email || ''}
          </p>
          <div style={{
            display: 'inline-block',
            background: isAdmin
              ? 'linear-gradient(135deg, #ff006e 0%, #ff4d8f 100%)'
              : 'linear-gradient(135deg, #00d9ff 0%, #b967ff 100%)',
            padding: '0.5rem 1.25rem',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: '700',
            color: 'white',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: isAdmin 
              ? '0 4px 16px rgba(255, 0, 110, 0.4)'
              : '0 4px 16px rgba(0, 217, 255, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            {isAdmin ? '🔐 ADMIN' : '👤 ' + (user?.role?.toUpperCase() || 'MEMBER')}
          </div>
        </div>
        
        {/* Navigation */}
        <nav>
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '1rem 1.25rem',
                  marginBottom: '0.75rem',
                  background: isActive 
                    ? 'linear-gradient(135deg, rgba(0, 217, 255, 0.2) 0%, rgba(185, 103, 255, 0.2) 100%)' 
                    : 'transparent',
                  color: isActive ? '#ffffff' : '#b0b0b0',
                  border: isActive 
                    ? '1px solid rgba(0, 217, 255, 0.4)' 
                    : '1px solid transparent',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: isActive ? '700' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isActive ? '0 4px 20px rgba(0, 217, 255, 0.25)' : 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  textAlign: 'left',
                  letterSpacing: '0.3px',
                  animationDelay: `${index * 0.05}s`,
                  animation: 'slideIn 0.4s ease-out'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateX(8px)';
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.color = '#b0b0b0';
                  }
                }}
              >
                <span style={{ 
                  marginRight: '1rem',
                  fontSize: '1.4rem',
                  filter: isActive ? 'drop-shadow(0 0 8px currentColor)' : 'none'
                }}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    right: '12px',
                    width: '4px',
                    height: '4px',
                    background: '#00d9ff',
                    borderRadius: '50%',
                    boxShadow: '0 0 8px #00d9ff',
                    animation: 'pulse 2s infinite'
                  }} />
                )}
              </button>
            );
          })}
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '1rem 1.25rem',
              marginTop: '2rem',
              background: 'linear-gradient(135deg, rgba(255, 0, 110, 0.2) 0%, rgba(255, 77, 143, 0.1) 100%)',
              color: '#ffffff',
              border: '1px solid rgba(255, 0, 110, 0.4)',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 20px rgba(255, 0, 110, 0.25)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 0, 110, 0.3) 0%, rgba(255, 77, 143, 0.2) 100%)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(255, 0, 110, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 0, 110, 0.2) 0%, rgba(255, 77, 143, 0.1) 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 0, 110, 0.25)';
            }}
          >
            <span style={{ marginRight: '0.75rem', fontSize: '1.3rem' }}>🚪</span>
            <span>Logout</span>
          </button>
        </nav>
      </div>
      
      {/* Main Content */}
      <div style={{ 
        flex: 1,
        padding: '2.5rem',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        overflowY: 'auto',
        minHeight: '100vh',
        position: 'relative'
      }}>
        <Outlet />
      </div>

      {/* Add keyframes for animations */}
      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
};

export default Layout;