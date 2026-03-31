import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const Billing = () => {
  const [deskBookings, setDeskBookings] = useState([]);
  const [roomBookings, setRoomBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalSpent: 0,
    pendingAmount: 0,
    paidBookings: 0,
    pendingBookings: 0,
  });

  useEffect(() => {
    fetchBookingsAndCalculate();
  }, []);

  const fetchBookingsAndCalculate = async () => {
    try {
      setLoading(true);
      const [deskRes, roomRes] = await Promise.all([
        bookingAPI.getUserDeskBookings(),
        bookingAPI.getUserRoomBookings(),
      ]);
      
      const desks = deskRes.data.bookings || [];
      const rooms = roomRes.data.bookings || [];
      
      setDeskBookings(desks);
      setRoomBookings(rooms);
      
      // Calculate summary
      const allBookings = [...desks, ...rooms];
      const totalSpent = allBookings
        .filter(b => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + b.totalAmount, 0);
      
      const pendingAmount = allBookings
        .filter(b => b.paymentStatus === 'pending' && b.status !== 'cancelled')
        .reduce((sum, b) => sum + b.totalAmount, 0);
      
      const paidBookings = allBookings.filter(b => b.paymentStatus === 'paid').length;
      const pendingBookings = allBookings.filter(
        b => b.paymentStatus === 'pending' && b.status !== 'cancelled'
      ).length;
      
      setSummary({ totalSpent, pendingAmount, paidBookings, pendingBookings });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load billing information');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      paid: '#4caf50',
      pending: '#ff9800',
      refunded: '#2196f3',
      failed: '#f44336',
    };
    return colors[status] || '#666';
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '60vh',
        color: '#ffffff',
        fontSize: '1.2rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(74, 172, 254, 0.2)',
            borderTop: '4px solid #4aacfe',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p>Loading billing information...</p>
        </div>
      </div>
    );
  }

  const allBookings = [...deskBookings, ...roomBookings].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(74, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)',
        backdropFilter: 'blur(20px)',
        padding: '2rem 2.5rem',
        borderRadius: '24px',
        marginBottom: '2.5rem',
        border: '1px solid rgba(74, 172, 254, 0.2)',
        boxShadow: '0 8px 32px rgba(74, 172, 254, 0.15)',
      }}>
        <h1 style={{ 
          margin: '0 0 0.5rem 0',
          fontSize: '2.5rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #4aacfe 0%, #00f2fe 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px'
        }}>
          💰 Billing & Payments
        </h1>
        <p style={{ 
          margin: 0,
          color: '#e0e0e0',
          fontSize: '1.1rem',
          fontWeight: '500'
        }}>
          View your transaction history and payment details
        </p>
      </div>

      {/* Billing Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {[
          { 
            title: 'Total Spent', 
            value: `$${summary.totalSpent.toFixed(2)}`,
            subtitle: `${summary.paidBookings} paid booking${summary.paidBookings !== 1 ? 's' : ''}`,
            gradient: 'linear-gradient(135deg, #05ffa1 0%, #00d9ff 100%)',
            icon: '✓'
          },
          { 
            title: 'Pending Amount', 
            value: `$${summary.pendingAmount.toFixed(2)}`,
            subtitle: `${summary.pendingBookings} pending booking${summary.pendingBookings !== 1 ? 's' : ''}`,
            gradient: 'linear-gradient(135deg, #ffb800 0%, #ff8800 100%)',
            icon: '⏳'
          },
          { 
            title: 'Total Bookings', 
            value: allBookings.length,
            subtitle: `${deskBookings.length} desk${deskBookings.length !== 1 ? 's' : ''}, ${roomBookings.length} room${roomBookings.length !== 1 ? 's' : ''}`,
            gradient: 'linear-gradient(135deg, #4aacfe 0%, #00f2fe 100%)',
            icon: '📊'
          },
          { 
            title: 'Total Amount', 
            value: `$${(summary.totalSpent + summary.pendingAmount).toFixed(2)}`,
            subtitle: 'All bookings combined',
            gradient: 'linear-gradient(135deg, #b967ff 0%, #f093fb 100%)',
            icon: '💵'
          }
        ].map((stat, index) => (
          <div
            key={index}
            style={{
              background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              padding: '2rem',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(74, 172, 254, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(74, 172, 254, 0.3)';
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
              background: stat.gradient,
              opacity: 0.1,
              borderRadius: '50%',
              filter: 'blur(40px)'
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ 
                margin: '0 0 0.75rem 0',
                color: '#a0a0a0',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: '600'
              }}>
                {stat.title}
              </p>
              <p style={{ 
                margin: '0 0 0.5rem 0',
                fontSize: '2.5rem',
                fontWeight: '800',
                background: stat.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-1px'
              }}>
                {stat.value}
              </p>
              <p style={{ 
                margin: 0,
                fontSize: '0.85rem',
                color: '#808080',
                fontWeight: '500'
              }}>
                {stat.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Transaction History */}
      <h2 style={{
        margin: '0 0 1.5rem 0',
        fontSize: '1.8rem',
        fontWeight: '800',
        color: '#ffffff',
        letterSpacing: '-0.3px'
      }}>
        Transaction History
      </h2>

      {allBookings.length === 0 ? (
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          padding: '3rem',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
          <p style={{ color: '#e0e0e0', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
            No billing records found
          </p>
          <p style={{ color: '#808080', fontSize: '1rem' }}>
            Your desk and room bookings will appear here
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {allBookings.map((booking, index) => {
            const isDesk = booking.desk !== undefined;
            const itemName = isDesk 
              ? `Desk #${booking.desk?.deskNumber || 'N/A'}` 
              : booking.meetingRoom?.name || 'N/A';
            const itemLocation = isDesk 
              ? booking.desk?.location 
              : `Capacity: ${booking.meetingRoom?.capacity || 'N/A'}`;
            
            return (
              <div
                key={booking._id}
                style={{
                  background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
                  backdropFilter: 'blur(20px)',
                  padding: '2rem',
                  borderRadius: '20px',
                  border: `1px solid ${isDesk ? 'rgba(0, 217, 255, 0.2)' : 'rgba(185, 103, 255, 0.2)'}`,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                  transition: 'all 0.3s ease',
                  animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 12px 40px ${isDesk ? 'rgba(0, 217, 255, 0.2)' : 'rgba(185, 103, 255, 0.2)'}`;
                  e.currentTarget.style.borderColor = isDesk ? 'rgba(0, 217, 255, 0.4)' : 'rgba(185, 103, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5)';
                  e.currentTarget.style.borderColor = isDesk ? 'rgba(0, 217, 255, 0.2)' : 'rgba(185, 103, 255, 0.2)';
                }}
              >
                {/* Glow effect */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '150px',
                  height: '150px',
                  background: isDesk 
                    ? 'radial-gradient(circle, rgba(0, 217, 255, 0.1) 0%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(185, 103, 255, 0.1) 0%, transparent 70%)',
                  pointerEvents: 'none'
                }} />

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '12px',
                        background: isDesk 
                          ? 'linear-gradient(135deg, #00d9ff 0%, #05ffa1 100%)'
                          : 'linear-gradient(135deg, #b967ff 0%, #00d9ff 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        boxShadow: isDesk 
                          ? '0 4px 16px rgba(0, 217, 255, 0.3)'
                          : '0 4px 16px rgba(185, 103, 255, 0.3)'
                      }}>
                        {isDesk ? '💻' : '🏢'}
                      </div>
                      <div>
                        <h3 style={{ 
                          margin: 0,
                          fontSize: '1.4rem',
                          fontWeight: '800',
                          background: isDesk 
                            ? 'linear-gradient(135deg, #00d9ff 0%, #05ffa1 100%)'
                            : 'linear-gradient(135deg, #b967ff 0%, #00d9ff 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}>
                          {itemName}
                        </h3>
                        <p style={{ margin: '0.25rem 0 0 0', color: '#a0a0a0', fontSize: '0.9rem' }}>
                          {itemLocation}
                        </p>
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '1rem',
                      marginBottom: '1rem'
                    }}>
                      <div>
                        <p style={{ margin: 0, color: '#808080', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                          Date
                        </p>
                        <p style={{ margin: 0, color: '#e0e0e0', fontWeight: '600', fontSize: '0.95rem' }}>
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p style={{ margin: 0, color: '#808080', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                          Time
                        </p>
                        <p style={{ margin: 0, color: '#e0e0e0', fontWeight: '600', fontSize: '0.95rem' }}>
                          {new Date(booking.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(booking.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                      <div>
                        <p style={{ margin: 0, color: '#808080', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                          Duration
                        </p>
                        <p style={{ margin: 0, color: '#e0e0e0', fontWeight: '600', fontSize: '0.95rem' }}>
                          {booking.duration} hour{booking.duration !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    {!isDesk && booking.purpose && (
                      <p style={{ 
                        margin: '0 0 1rem 0',
                        color: '#b0b0b0',
                        fontSize: '0.9rem',
                        fontStyle: 'italic'
                      }}>
                        Purpose: {booking.purpose}
                      </p>
                    )}

                    {/* Status badges */}
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <span style={{
                        background: getStatusColor(booking.paymentStatus),
                        color: 'white',
                        padding: '0.4rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {booking.paymentStatus}
                      </span>
                      <span style={{
                        background: booking.status === 'cancelled' ? 'rgba(255, 0, 110, 0.2)' : 'rgba(5, 255, 161, 0.2)',
                        color: booking.status === 'cancelled' ? '#ff006e' : '#05ffa1',
                        border: booking.status === 'cancelled' ? '1px solid rgba(255, 0, 110, 0.4)' : '1px solid rgba(5, 255, 161, 0.4)',
                        padding: '0.4rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        textTransform: 'capitalize',
                        letterSpacing: '0.5px'
                      }}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <p style={{
                      margin: '0 0 0.5rem 0',
                      fontSize: '2.5rem',
                      fontWeight: '800',
                      background: 'linear-gradient(135deg, #4aacfe 0%, #00f2fe 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      ${booking.totalAmount.toFixed(2)}
                    </p>
                    <p style={{ 
                      margin: 0,
                      fontSize: '0.75rem',
                      color: '#808080',
                      fontWeight: '500'
                    }}>
                      Booked {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Billing;