import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const navigate = useNavigate();

  const StatCard = ({ title, value, subtitle, icon, gradient, delay }) => (
    <div style={{
      background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
      backdropFilter: 'blur(20px)',
      padding: '2rem',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      animation: `fadeIn 0.5s ease-out ${delay}s both`,
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-8px)';
      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 217, 255, 0.3)';
      e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5)';
      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100px',
        height: '100px',
        background: gradient,
        opacity: 0.1,
        borderRadius: '50%',
        filter: 'blur(40px)'
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
          <h3 style={{ 
            margin: 0,
            color: '#a0a0a0',
            fontSize: '0.9rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            {title}
          </h3>
          <span style={{ fontSize: '2rem' }}>{icon}</span>
        </div>
        <p style={{ 
          margin: '0 0 0.5rem 0',
          fontSize: '2.5rem',
          fontWeight: '800',
          background: gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-1px'
        }}>
          {value}
        </p>
        {subtitle && (
          <p style={{ 
            margin: 0,
            fontSize: '0.85rem',
            color: '#808080',
            fontWeight: '500'
          }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );

  const QuickActionButton = ({ onClick, gradient, icon, title, delay }) => (
    <button 
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        width: '100%',
        padding: '1.25rem',
        background: `linear-gradient(135deg, ${gradient})`,
        color: 'white',
        border: 'none',
        borderRadius: '14px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '700',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        position: 'relative',
        overflow: 'hidden',
        animation: `slideIn 0.5s ease-out ${delay}s both`,
        letterSpacing: '0.3px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 217, 255, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4)';
      }}
    >
      <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      <span>{title}</span>
    </button>
  );

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Welcome Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.1) 0%, rgba(185, 103, 255, 0.1) 100%)',
        backdropFilter: 'blur(20px)',
        padding: '2.5rem',
        borderRadius: '24px',
        marginBottom: '2.5rem',
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
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(0, 217, 255, 0.1), transparent)',
          animation: 'shimmer 3s infinite'
        }} />
        <h1 style={{ 
          margin: '0 0 0.75rem 0',
          fontSize: '2.5rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #00d9ff 0%, #b967ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px'
        }}>
          Welcome Back, {user.name}! 👋
        </h1>
        <p style={{ 
          margin: 0,
          color: '#e0e0e0',
          fontSize: '1.15rem',
          fontWeight: '500',
          lineHeight: '1.6'
        }}>
          Manage your workspace, book desks and meeting rooms, and stay connected with your community.
        </p>
      </div>

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        marginBottom: '2.5rem'
      }}>
        {/* Stats */}
        <StatCard 
          title="Active Bookings"
          value="3"
          subtitle="This month"
          icon="📅"
          gradient="linear-gradient(135deg, #00d9ff 0%, #0099ff 100%)"
          delay={0}
        />
        <StatCard 
          title="Total Desks"
          value="50"
          subtitle="Available now"
          icon="💻"
          gradient="linear-gradient(135deg, #05ffa1 0%, #00d9ff 100%)"
          delay={0.1}
        />
        <StatCard 
          title="Meeting Rooms"
          value="12"
          subtitle="Ready to book"
          icon="🏢"
          gradient="linear-gradient(135deg, #b967ff 0%, #ff006e 100%)"
          delay={0.2}
        />
        <StatCard 
          title="Pending Invoices"
          value="1"
          subtitle="Due soon"
          icon="💰"
          gradient="linear-gradient(135deg, #ffb800 0%, #ff8800 100%)"
          delay={0.3}
        />
      </div>

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        {/* Quick Actions */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          padding: '2rem',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          animation: 'fadeIn 0.6s ease-out 0.2s both'
        }}>
          <h3 style={{ 
            margin: '0 0 1.5rem 0',
            fontSize: '1.4rem',
            fontWeight: '800',
            color: '#ffffff',
            letterSpacing: '-0.3px'
          }}>
            ⚡ Quick Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <QuickActionButton 
              onClick={() => navigate('/desks')}
              gradient="rgba(0, 217, 255, 0.2) 0%, rgba(0, 153, 255, 0.2) 100%"
              icon="💻"
              title="Book a Desk"
              delay={0.3}
            />
            <QuickActionButton 
              onClick={() => navigate('/meeting-rooms')}
              gradient="rgba(5, 255, 161, 0.2) 0%, rgba(0, 217, 255, 0.2) 100%"
              icon="🏢"
              title="Reserve Meeting Room"
              delay={0.4}
            />
            <QuickActionButton 
              onClick={() => navigate('/announcements')}
              gradient="rgba(185, 103, 255, 0.2) 0%, rgba(255, 0, 110, 0.2) 100%"
              icon="📢"
              title="View Announcements"
              delay={0.5}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          padding: '2rem',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          animation: 'fadeIn 0.6s ease-out 0.3s both'
        }}>
          <h3 style={{ 
            margin: '0 0 1.5rem 0',
            fontSize: '1.4rem',
            fontWeight: '800',
            color: '#ffffff',
            letterSpacing: '-0.3px'
          }}>
            🔄 Recent Activity
          </h3>
          {[
            { title: 'Desk booked', desc: 'Desk A-12 for today', time: '2 hours ago', icon: '💻', color: '#00d9ff' },
            { title: 'Meeting room reserved', desc: 'Conference Room B for tomorrow', time: 'Yesterday', icon: '🏢', color: '#05ffa1' },
            { title: 'Invoice paid', desc: 'Invoice #INV-001 paid', time: '3 days ago', icon: '💰', color: '#ffb800' }
          ].map((activity, index) => (
            <div key={index} style={{ 
              marginBottom: index < 2 ? '1.25rem' : 0,
              paddingBottom: index < 2 ? '1.25rem' : 0,
              borderBottom: index < 2 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
              animation: `slideIn 0.5s ease-out ${0.4 + index * 0.1}s both`
            }}>
              <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${activity.color}20, ${activity.color}10)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  flexShrink: 0
                }}>
                  {activity.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <strong style={{ 
                    display: 'block',
                    color: '#ffffff',
                    fontSize: '1rem',
                    fontWeight: '700',
                    marginBottom: '0.25rem'
                  }}>
                    {activity.title}
                  </strong>
                  <p style={{ 
                    margin: '0 0 0.5rem 0',
                    fontSize: '0.9rem',
                    color: '#b0b0b0'
                  }}>
                    {activity.desc}
                  </p>
                  <span style={{ 
                    fontSize: '0.8rem',
                    color: '#808080',
                    fontWeight: '500'
                  }}>
                    {activity.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;