import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const Bookings = () => {
  const [deskBookings, setDeskBookings] = useState([]);
  const [roomBookings, setRoomBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('desks');
  const [cancellingId, setCancellingId] = useState(null);


  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const [deskRes, roomRes] = await Promise.all([
        bookingAPI.getUserDeskBookings(),
        bookingAPI.getUserRoomBookings(),
      ]);
      setDeskBookings(deskRes.data.bookings || []);
      setRoomBookings(roomRes.data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

const handleCancelDeskBooking = async (id) => {
  if (!window.confirm('Are you sure you want to cancel this booking?')) return;

  try {
    setCancellingId(id);

    // 🔥 optimistic UI update
    setDeskBookings(prev =>
      prev.map(b =>
        b._id === id ? { ...b, status: 'cancelled' } : b
      )
    );

    await bookingAPI.cancelDeskBooking(id);
    toast.success('Booking cancelled successfully');
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to cancel booking');
    fetchBookings(); // rollback if API fails
  } finally {
    setCancellingId(null);
  }
};


  const handleCancelRoomBooking = async (id) => {
  if (!window.confirm('Are you sure you want to cancel this booking?')) return;

  try {
    setCancellingId(id);

    setRoomBookings(prev =>
      prev.map(b =>
        b._id === id ? { ...b, status: 'cancelled' } : b
      )
    );

    await bookingAPI.cancelRoomBooking(id);
    toast.success('Booking cancelled successfully');
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to cancel booking');
    fetchBookings();
  } finally {
    setCancellingId(null);
  }
};

  const getStatusColor = (status) => {
    const colors = {
      confirmed: '#4caf50',
      pending: '#ff9800',
      cancelled: '#f44336',
      completed: '#2196f3',
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
            border: '4px solid rgba(0, 217, 255, 0.2)',
            borderTop: '4px solid #00d9ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p>Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255, 182, 0, 0.1) 0%, rgba(255, 107, 53, 0.1) 100%)',
        backdropFilter: 'blur(20px)',
        padding: '2rem 2.5rem',
        borderRadius: '24px',
        marginBottom: '2.5rem',
        border: '1px solid rgba(255, 182, 0, 0.2)',
        boxShadow: '0 8px 32px rgba(255, 182, 0, 0.15)',
      }}>
        <h1 style={{ 
          margin: '0 0 0.5rem 0',
          fontSize: '2.5rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #ffb800 0%, #ff6b35 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px'
        }}>
          📅 My Bookings
        </h1>
        <p style={{ 
          margin: 0,
          color: '#e0e0e0',
          fontSize: '1.1rem',
          fontWeight: '500'
        }}>
          Manage your desk and meeting room reservations
        </p>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        borderBottom: '2px solid rgba(255, 255, 255, 0.1)'
      }}>
        <button
          onClick={() => setActiveTab('desks')}
          style={{
            padding: '1rem 2rem',
            background: activeTab === 'desks' 
              ? 'linear-gradient(135deg, rgba(0, 217, 255, 0.2) 0%, rgba(5, 255, 161, 0.2) 100%)'
              : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'desks' ? '3px solid #00d9ff' : 'none',
            color: activeTab === 'desks' ? '#00d9ff' : '#a0a0a0',
            cursor: 'pointer',
            fontWeight: activeTab === 'desks' ? '700' : '500',
            fontSize: '1rem',
            borderRadius: '12px 12px 0 0',
            transition: 'all 0.3s ease',
            letterSpacing: '0.3px'
          }}
          onMouseEnter={(e) => !activeTab === 'desks' && (e.target.style.color = '#ffffff')}
          onMouseLeave={(e) => !activeTab === 'desks' && (e.target.style.color = '#a0a0a0')}
        >
          💻 Desk Bookings ({deskBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('rooms')}
          style={{
            padding: '1rem 2rem',
            background: activeTab === 'rooms' 
              ? 'linear-gradient(135deg, rgba(185, 103, 255, 0.2) 0%, rgba(255, 0, 110, 0.2) 100%)'
              : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'rooms' ? '3px solid #b967ff' : 'none',
            color: activeTab === 'rooms' ? '#b967ff' : '#a0a0a0',
            cursor: 'pointer',
            fontWeight: activeTab === 'rooms' ? '700' : '500',
            fontSize: '1rem',
            borderRadius: '12px 12px 0 0',
            transition: 'all 0.3s ease',
            letterSpacing: '0.3px'
          }}
          onMouseEnter={(e) => !activeTab === 'rooms' && (e.target.style.color = '#ffffff')}
          onMouseLeave={(e) => !activeTab === 'rooms' && (e.target.style.color = '#a0a0a0')}
        >
          🏢 Room Bookings ({roomBookings.length})
        </button>
      </div>

      {/* Desk Bookings */}
      {activeTab === 'desks' && (
        <div>
          {deskBookings.length === 0 ? (
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
              <p style={{ color: '#e0e0e0', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
                No desk bookings found
              </p>
              <button
                onClick={() => window.location.href = '/desks'}
                style={{
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #00d9ff 0%, #05ffa1 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  boxShadow: '0 4px 20px rgba(0, 217, 255, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 6px 24px rgba(0, 217, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 4px 20px rgba(0, 217, 255, 0.3)';
                }}
              >
                Book a Desk
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {deskBookings.map((booking, index) => (
                <div
                  key={booking._id}
                  style={{
                    background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
                    backdropFilter: 'blur(20px)',
                    padding: '2rem',
                    borderRadius: '20px',
                    border: '1px solid rgba(0, 217, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    transition: 'all 0.3s ease',
                    animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 217, 255, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5)';
                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.2)';
                  }}
                >
                  {/* Glow effect */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '150px',
                    height: '150px',
                    background: 'radial-gradient(circle, rgba(0, 217, 255, 0.1) 0%, transparent 70%)',
                    pointerEvents: 'none'
                  }} />

                  <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #00d9ff 0%, #05ffa1 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        boxShadow: '0 4px 16px rgba(0, 217, 255, 0.3)'
                      }}>
                        💻
                      </div>
                      <div>
                        <h3 style={{ 
                          margin: 0,
                          fontSize: '1.5rem',
                          fontWeight: '800',
                          background: 'linear-gradient(135deg, #00d9ff 0%, #05ffa1 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}>
                          Desk #{booking.desk?.deskNumber || 'N/A'}
                        </h3>
                        <p style={{ margin: '0.25rem 0 0 0', color: '#a0a0a0', fontSize: '0.9rem' }}>
                          {booking.desk?.location || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <p style={{ margin: 0, color: '#a0a0a0', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                          Date
                        </p>
                        <p style={{ margin: 0, color: '#e0e0e0', fontWeight: '600' }}>
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p style={{ margin: 0, color: '#a0a0a0', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                          Time
                        </p>
                        <p style={{ margin: 0, color: '#e0e0e0', fontWeight: '600' }}>
                          {new Date(booking.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(booking.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                      <div>
                        <p style={{ margin: 0, color: '#a0a0a0', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                          Duration
                        </p>
                        <p style={{ margin: 0, color: '#e0e0e0', fontWeight: '600' }}>
                          {booking.duration} hour{booking.duration !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div>
                        <p style={{ margin: 0, color: '#a0a0a0', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                          Amount
                        </p>
                        <p style={{ margin: 0, color: '#00d9ff', fontWeight: '700', fontSize: '1.1rem' }}>
                          ${booking.totalAmount}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <span style={{
                        background: getStatusColor(booking.status),
                        color: 'white',
                        padding: '0.4rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {booking.status}
                      </span>
                      <span style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#e0e0e0',
                        padding: '0.4rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}>
                        {booking.paymentStatus}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {booking.status === 'confirmed' && (
                      <button
  disabled={cancellingId === booking._id}
  onClick={() => handleCancelDeskBooking(booking._id)}

                        style={{
                          padding: '0.75rem 1.5rem',
                          background: 'linear-gradient(135deg, rgba(255, 0, 110, 0.2) 0%, rgba(255, 77, 143, 0.2) 100%)',
                          color: '#ff006e',
                          border: '1px solid rgba(255, 0, 110, 0.4)',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          fontWeight: '700',
                          fontSize: '0.9rem',
                          transition: 'all 0.3s ease',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'linear-gradient(135deg, rgba(255, 0, 110, 0.3) 0%, rgba(255, 77, 143, 0.3) 100%)';
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'linear-gradient(135deg, rgba(255, 0, 110, 0.2) 0%, rgba(255, 77, 143, 0.2) 100%)';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Room Bookings - Similar styling */}
      {activeTab === 'rooms' && (
        <div>
          {roomBookings.length === 0 ? (
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
              <p style={{ color: '#e0e0e0', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
                No room bookings found
              </p>
              <button
              
                onClick={() => window.location.href = '/meeting-rooms'}
                style={{
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #b967ff 0%, #00d9ff 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  boxShadow: '0 4px 20px rgba(185, 103, 255, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 6px 24px rgba(185, 103, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 4px 20px rgba(185, 103, 255, 0.3)';
                }}
              >
                Book a Room
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {roomBookings.map((booking, index) => (
                <div
                  key={booking._id}
                  style={{
                    background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
                    backdropFilter: 'blur(20px)',
                    padding: '2rem',
                    borderRadius: '20px',
                    border: '1px solid rgba(185, 103, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    transition: 'all 0.3s ease',
                    animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(185, 103, 255, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(185, 103, 255, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5)';
                    e.currentTarget.style.borderColor = 'rgba(185, 103, 255, 0.2)';
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '150px',
                    height: '150px',
                    background: 'radial-gradient(circle, rgba(185, 103, 255, 0.1) 0%, transparent 70%)',
                    pointerEvents: 'none'
                  }} />

                  <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #b967ff 0%, #00d9ff 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        boxShadow: '0 4px 16px rgba(185, 103, 255, 0.3)'
                      }}>
                        🏢
                      </div>
                      <div>
                        <h3 style={{ 
                          margin: 0,
                          fontSize: '1.5rem',
                          fontWeight: '800',
                          background: 'linear-gradient(135deg, #b967ff 0%, #00d9ff 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}>
                          {booking.meetingRoom?.name || 'N/A'}
                        </h3>
                        <p style={{ margin: '0.25rem 0 0 0', color: '#a0a0a0', fontSize: '0.9rem' }}>
                          {booking.purpose}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <p style={{ margin: 0, color: '#a0a0a0', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                          Date
                        </p>
                        <p style={{ margin: 0, color: '#e0e0e0', fontWeight: '600' }}>
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p style={{ margin: 0, color: '#a0a0a0', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                          Time
                        </p>
                        <p style={{ margin: 0, color: '#e0e0e0', fontWeight: '600' }}>
                          {new Date(booking.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(booking.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                      <div>
                        <p style={{ margin: 0, color: '#a0a0a0', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                          Attendees
                        </p>
                        <p style={{ margin: 0, color: '#e0e0e0', fontWeight: '600' }}>
                          {booking.attendees} people
                        </p>
                      </div>
                      <div>
                        <p style={{ margin: 0, color: '#a0a0a0', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                          Amount
                        </p>
                        <p style={{ margin: 0, color: '#b967ff', fontWeight: '700', fontSize: '1.1rem' }}>
                          ${booking.totalAmount}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <span style={{
                        background: getStatusColor(booking.status),
                        color: 'white',
                        padding: '0.4rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {booking.status}
                      </span>
                      <span style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#e0e0e0',
                        padding: '0.4rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}>
                        {booking.paymentStatus}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {booking.status === 'confirmed' && (
                      <button
                      disabled={cancellingId === booking._id}
                        onClick={() => handleCancelRoomBooking(booking._id)}
                        style={{
                          padding: '0.75rem 1.5rem',
                          background: 'linear-gradient(135deg, rgba(255, 0, 110, 0.2) 0%, rgba(255, 77, 143, 0.2) 100%)',
                          color: '#ff006e',
                          border: '1px solid rgba(255, 0, 110, 0.4)',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          fontWeight: '700',
                          fontSize: '0.9rem',
                          transition: 'all 0.3s ease',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'linear-gradient(135deg, rgba(255, 0, 110, 0.3) 0%, rgba(255, 77, 143, 0.3) 100%)';
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'linear-gradient(135deg, rgba(255, 0, 110, 0.2) 0%, rgba(255, 77, 143, 0.2) 100%)';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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

export default Bookings;