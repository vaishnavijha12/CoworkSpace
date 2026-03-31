import React, { useState, useEffect } from 'react';
import { roomAPI, bookingAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const MeetingRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    startTime: '',
    endTime: '',
    purpose: '',
    attendees: 1
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await roomAPI.getAllRooms();
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleBookRoom = async (e) => {
    e.preventDefault();
    try {
      await bookingAPI.createRoomBooking({
        roomId: selectedRoom._id,
        ...bookingData
      });
      toast.success('Room booked successfully!');
      setShowBookingModal(false);
      setSelectedRoom(null);
      setBookingData({ startTime: '', endTime: '', purpose: '', attendees: 1 });
      fetchRooms();
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
            border: '4px solid rgba(185, 103, 255, 0.2)',
            borderTop: '4px solid #b967ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p>Loading meeting rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(185, 103, 255, 0.1) 0%, rgba(255, 0, 110, 0.1) 100%)',
        backdropFilter: 'blur(20px)',
        padding: '2rem 2.5rem',
        borderRadius: '24px',
        marginBottom: '2.5rem',
        border: '1px solid rgba(185, 103, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(185, 103, 255, 0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <h1 style={{ 
          margin: '0 0 0.5rem 0',
          fontSize: '2.5rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #b967ff 0%, #ff006e 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px'
        }}>
          🏢 Meeting Rooms
        </h1>
        <p style={{ 
          margin: 0,
          color: '#e0e0e0',
          fontSize: '1.1rem',
          fontWeight: '500'
        }}>
          Reserve professional meeting spaces for your team
        </p>
      </div>

      {/* Rooms Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '2rem'
      }}>
        {rooms.map((room, index) => (
          <div
            key={room._id}
            style={{
              background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              padding: '2rem',
              borderRadius: '20px',
              border: room.isAvailable 
                ? '1px solid rgba(185, 103, 255, 0.3)' 
                : '1px solid rgba(255, 0, 110, 0.3)',
              boxShadow: room.isAvailable
                ? '0 8px 32px rgba(185, 103, 255, 0.15)'
                : '0 8px 32px rgba(255, 0, 110, 0.15)',
              transition: 'all 0.3s ease',
              animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
              cursor: room.isAvailable ? 'pointer' : 'default',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              if (room.isAvailable) {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(185, 103, 255, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(185, 103, 255, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = room.isAvailable
                ? '0 8px 32px rgba(185, 103, 255, 0.15)'
                : '0 8px 32px rgba(255, 0, 110, 0.15)';
              e.currentTarget.style.borderColor = room.isAvailable 
                ? 'rgba(185, 103, 255, 0.3)' 
                : 'rgba(255, 0, 110, 0.3)';
            }}
          >
            {/* Status Badge */}
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: room.isAvailable 
                ? 'linear-gradient(135deg, #b967ff 0%, #00d9ff 100%)'
                : 'linear-gradient(135deg, #ff006e 0%, #ff4d8f 100%)',
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '700',
              color: 'white',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: room.isAvailable
                ? '0 4px 12px rgba(185, 103, 255, 0.4)'
                : '0 4px 12px rgba(255, 0, 110, 0.4)'
            }}>
              {room.isAvailable ? '✓ Available' : '✗ Booked'}
            </div>

            {/* Room Info */}
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{
                margin: '0 0 0.5rem 0',
                fontSize: '1.8rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #b967ff 0%, #00d9ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px'
              }}>
                {room.name}
              </h3>
              <p style={{
                margin: 0,
                color: '#a0a0a0',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                Room {room.roomNumber}
              </p>
            </div>

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
                <span style={{ fontSize: '1.2rem' }}>👥</span>
                <strong>Capacity:</strong> {room.capacity} people
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
                <strong>Rate:</strong> ${room.hourlyRate}/hr
              </p>
              {room.description && (
                <p style={{ 
                  margin: '0.75rem 0 0 0',
                  color: '#b0b0b0',
                  fontSize: '0.9rem',
                  lineHeight: '1.5'
                }}>
                  {room.description}
                </p>
              )}
            </div>

            {/* Amenities */}
            {room.amenities && room.amenities.length > 0 && (
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
                  {room.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: 'rgba(185, 103, 255, 0.1)',
                        color: '#b967ff',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        border: '1px solid rgba(185, 103, 255, 0.2)'
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
              disabled={!room.isAvailable}
              onClick={() => {
                setSelectedRoom(room);
                setShowBookingModal(true);
              }}
              style={{
                width: '100%',
                padding: '1rem',
                background: room.isAvailable
                  ? 'linear-gradient(135deg, #b967ff 0%, #00d9ff 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: room.isAvailable ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: room.isAvailable ? '0 4px 20px rgba(185, 103, 255, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (room.isAvailable) {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 6px 24px rgba(185, 103, 255, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (room.isAvailable) {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 4px 20px rgba(185, 103, 255, 0.3)';
                }
              }}
            >
              {room.isAvailable ? '📅 Reserve Room' : '🔒 Not Available'}
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedRoom && (
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
            border: '1px solid rgba(185, 103, 255, 0.3)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
            animation: 'slideIn 0.3s ease-out'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{
              margin: '0 0 1.5rem 0',
              fontSize: '2rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #b967ff 0%, #00d9ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Book {selectedRoom.name}
            </h2>

            <form onSubmit={handleBookRoom}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block',
                  marginBottom: '0.75rem',
                  color: '#e0e0e0',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}>
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  value={bookingData.startTime}
                  onChange={(e) => setBookingData({...bookingData, startTime: e.target.value})}
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
                  End Time
                </label>
                <input
                  type="datetime-local"
                  value={bookingData.endTime}
                  onChange={(e) => setBookingData({...bookingData, endTime: e.target.value})}
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
                  Number of Attendees
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedRoom.capacity}
                  value={bookingData.attendees}
                  onChange={(e) => setBookingData({...bookingData, attendees: parseInt(e.target.value)})}
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
                  Meeting Purpose
                </label>
                <textarea
                  value={bookingData.purpose}
                  onChange={(e) => setBookingData({...bookingData, purpose: e.target.value})}
                  required
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    resize: 'vertical'
                  }}
                  placeholder="Brief description of the meeting..."
                />
              </div>

              <div style={{ 
                background: 'rgba(185, 103, 255, 0.1)',
                padding: '1rem',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                border: '1px solid rgba(185, 103, 255, 0.2)'
              }}>
                <p style={{ margin: 0, color: '#e0e0e0', fontSize: '0.95rem' }}>
                  <strong>Rate:</strong> ${selectedRoom.hourlyRate}/hour
                </p>
                <p style={{ margin: '0.5rem 0 0 0', color: '#a0a0a0', fontSize: '0.85rem' }}>
                  <strong>Capacity:</strong> Up to {selectedRoom.capacity} people
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: 'linear-gradient(135deg, #b967ff 0%, #00d9ff 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    boxShadow: '0 4px 20px rgba(185, 103, 255, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.02)';
                    e.target.style.boxShadow = '0 6px 24px rgba(185, 103, 255, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 4px 20px rgba(185, 103, 255, 0.3)';
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

export default MeetingRooms;