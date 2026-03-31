import React, { useState, useEffect } from 'react';
import { deskAPI, bookingAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const Desks = () => {
  const [desks, setDesks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDesk, setSelectedDesk] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    bookingType: 'hourly'
  });

  useEffect(() => {
    fetchDesks();
  }, []);

  const fetchDesks = async () => {
    try {
      setLoading(true);
      const response = await deskAPI.getAllDesks();
      setDesks(response.data);
    } catch (error) {
      console.error('Error fetching desks:', error);
      toast.error('Failed to load desks');
    } finally {
      setLoading(false);
    }
  };

  const handleBookDesk = async (e) => {
    e.preventDefault();
    try {
      await bookingAPI.createDeskBooking({
        deskId: selectedDesk._id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        bookingType: bookingData.bookingType
      });
      toast.success('Desk booked successfully!');
      setShowBookingModal(false);
      setSelectedDesk(null);
      setBookingData({ startDate: '', endDate: '', bookingType: 'hourly' });
      fetchDesks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
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
          <p>Loading desks...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.1) 0%, rgba(185, 103, 255, 0.1) 100%)',
        backdropFilter: 'blur(20px)',
        padding: '2rem 2.5rem',
        borderRadius: '24px',
        marginBottom: '2.5rem',
        border: '1px solid rgba(0, 217, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 217, 255, 0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <h1 style={{ 
          margin: '0 0 0.5rem 0',
          fontSize: '2.5rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #00d9ff 0%, #b967ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px'
        }}>
          💻 Available Desks
        </h1>
        <p style={{ 
          margin: 0,
          color: '#e0e0e0',
          fontSize: '1.1rem',
          fontWeight: '500'
        }}>
          Choose your perfect workspace from our available desks
        </p>
      </div>

      {/* Desks Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '2rem'
      }}>
        {desks.map((desk, index) => (
          <div
            key={desk._id}
            style={{
              background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              padding: '2rem',
              borderRadius: '20px',
              border: desk.isAvailable 
                ? '1px solid rgba(5, 255, 161, 0.3)' 
                : '1px solid rgba(255, 0, 110, 0.3)',
              boxShadow: desk.isAvailable
                ? '0 8px 32px rgba(5, 255, 161, 0.15)'
                : '0 8px 32px rgba(255, 0, 110, 0.15)',
              transition: 'all 0.3s ease',
              animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
              cursor: desk.isAvailable ? 'pointer' : 'default',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              if (desk.isAvailable) {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(5, 255, 161, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(5, 255, 161, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = desk.isAvailable
                ? '0 8px 32px rgba(5, 255, 161, 0.15)'
                : '0 8px 32px rgba(255, 0, 110, 0.15)';
              e.currentTarget.style.borderColor = desk.isAvailable 
                ? 'rgba(5, 255, 161, 0.3)' 
                : 'rgba(255, 0, 110, 0.3)';
            }}
          >
            {/* Status Badge */}
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: desk.isAvailable 
                ? 'linear-gradient(135deg, #05ffa1 0%, #00d9ff 100%)'
                : 'linear-gradient(135deg, #ff006e 0%, #ff4d8f 100%)',
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '700',
              color: 'white',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: desk.isAvailable
                ? '0 4px 12px rgba(5, 255, 161, 0.4)'
                : '0 4px 12px rgba(255, 0, 110, 0.4)'
            }}>
              {desk.isAvailable ? '✓ Available' : '✗ Occupied'}
            </div>

            {/* Desk Number */}
            <h3 style={{
              margin: '0 0 1rem 0',
              fontSize: '2rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #00d9ff 0%, #b967ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px'
            }}>
              {desk.deskNumber}
            </h3>

            {/* Details */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ 
                margin: '0 0 0.75rem 0',
                color: '#e0e0e0',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1.2rem' }}>📍</span>
                <strong>Location:</strong> {desk.location}
              </p>
              <p style={{ 
                margin: '0 0 0.75rem 0',
                color: '#e0e0e0',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1.2rem' }}>🪑</span>
                <strong>Type:</strong> {desk.type}
              </p>
              <p style={{ 
                margin: '0 0 0.75rem 0',
                color: '#e0e0e0',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1.2rem' }}>💵</span>
                <strong>Rate:</strong> ${desk.hourlyRate}/hr
              </p>
              {desk.description && (
                <p style={{ 
                  margin: '0.75rem 0 0 0',
                  color: '#b0b0b0',
                  fontSize: '0.9rem',
                  lineHeight: '1.5'
                }}>
                  {desk.description}
                </p>
              )}
            </div>

            {/* Amenities */}
            {desk.amenities && desk.amenities.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ 
                  margin: '0 0 0.75rem 0',
                  color: '#a0a0a0',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: '600'
                }}>
                  Amenities
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {desk.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: 'rgba(0, 217, 255, 0.1)',
                        color: '#00d9ff',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        border: '1px solid rgba(0, 217, 255, 0.2)'
                      }}
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Book Button */}
            <button
              disabled={!desk.isAvailable}
              onClick={() => {
                setSelectedDesk(desk);
                setShowBookingModal(true);
              }}
              style={{
                width: '100%',
                padding: '1rem',
                background: desk.isAvailable
                  ? 'linear-gradient(135deg, #05ffa1 0%, #00d9ff 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: desk.isAvailable ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: desk.isAvailable ? '0 4px 20px rgba(5, 255, 161, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (desk.isAvailable) {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 6px 24px rgba(5, 255, 161, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (desk.isAvailable) {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 4px 20px rgba(5, 255, 161, 0.3)';
                }
              }}
            >
              {desk.isAvailable ? '📅 Book Now' : '🔒 Not Available'}
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedDesk && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease-out'
        }} onClick={() => setShowBookingModal(false)}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.98) 0%, rgba(20, 20, 20, 0.98) 100%)',
            backdropFilter: 'blur(20px)',
            padding: '2.5rem',
            borderRadius: '24px',
            width: '90%',
            maxWidth: '500px',
            border: '1px solid rgba(0, 217, 255, 0.3)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
            animation: 'slideIn 0.3s ease-out'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{
              margin: '0 0 1.5rem 0',
              fontSize: '2rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #00d9ff 0%, #b967ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Book Desk {selectedDesk.deskNumber}
            </h2>

            <form onSubmit={handleBookDesk}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block',
                  marginBottom: '0.75rem',
                  color: '#e0e0e0',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}>
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={bookingData.startDate}
                  onChange={(e) => setBookingData({...bookingData, startDate: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block',
                  marginBottom: '0.75rem',
                  color: '#e0e0e0',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}>
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={bookingData.endDate}
                  onChange={(e) => setBookingData({...bookingData, endDate: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>

              <div style={{ 
                background: 'rgba(0, 217, 255, 0.1)',
                padding: '1rem',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                border: '1px solid rgba(0, 217, 255, 0.2)'
              }}>
                <p style={{ margin: 0, color: '#e0e0e0', fontSize: '0.95rem' }}>
                  <strong>Rate:</strong> ${selectedDesk.hourlyRate}/hour
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: 'linear-gradient(135deg, #05ffa1 0%, #00d9ff 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    boxShadow: '0 4px 20px rgba(5, 255, 161, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.02)';
                    e.target.style.boxShadow = '0 6px 24px rgba(5, 255, 161, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 4px 20px rgba(5, 255, 161, 0.3)';
                  }}
                >
                  Confirm Booking
                </button>
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: 'rgba(255, 0, 110, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(255, 0, 110, 0.4)',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 0, 110, 0.3)';
                    e.target.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 0, 110, 0.2)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Desks;