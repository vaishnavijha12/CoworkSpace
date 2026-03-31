import React, { useState, useEffect } from 'react';
import { deskAPI, roomAPI, bookingAPI, announcementAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const Admin = () => {
  const [stats, setStats] = useState({
    totalDesks: 0,
    availableDesks: 0,
    totalRooms: 0,
    availableRooms: 0,
    totalBookings: 0,
    activeBookings: 0,
    totalRevenue: 0,
    pendingRevenue: 0,
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [desks, setDesks] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [showDeskForm, setShowDeskForm] = useState(false);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [editingDesk, setEditingDesk] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [desksRes, roomsRes, deskBookingsRes, roomBookingsRes] = await Promise.all([
        deskAPI.getAllDesks(),
        roomAPI.getAllRooms(),
        bookingAPI.getAllDeskBookings(),
        bookingAPI.getAllRoomBookings(),
      ]);

      const allDesks = desksRes.data;
      const allRooms = roomsRes.data;
      const deskBookings = deskBookingsRes.data.bookings || [];
      const roomBookings = roomBookingsRes.data.bookings || [];
      const allBookings = [...deskBookings, ...roomBookings];

      setDesks(allDesks);
      setRooms(allRooms);
      setBookings(allBookings);

      // Calculate stats
      const totalRevenue = allBookings
        .filter(b => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + b.totalAmount, 0);
      
      const pendingRevenue = allBookings
        .filter(b => b.paymentStatus === 'pending' && b.status !== 'cancelled')
        .reduce((sum, b) => sum + b.totalAmount, 0);

      setStats({
        totalDesks: allDesks.length,
        availableDesks: allDesks.filter(d => d.isAvailable).length,
        totalRooms: allRooms.length,
        availableRooms: allRooms.filter(r => r.isAvailable).length,
        totalBookings: allBookings.length,
        activeBookings: allBookings.filter(b => b.status === 'confirmed').length,
        totalRevenue,
        pendingRevenue,
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDesk = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const deskData = {
      deskNumber: formData.get('deskNumber'),
      location: formData.get('location'),
      type: formData.get('type'),
      amenities: formData.getAll('amenities'),
      dailyRate: parseFloat(formData.get('dailyRate')),
      hourlyRate: parseFloat(formData.get('hourlyRate')),
      description: formData.get('description'),
      isAvailable: true,
      isActive: true,
    };

    try {
      if (editingDesk) {
        await deskAPI.updateDesk(editingDesk._id, deskData);
        toast.success('Desk updated successfully!');
      } else {
        await deskAPI.createDesk(deskData);
        toast.success('Desk created successfully!');
      }
      setShowDeskForm(false);
      setEditingDesk(null);
      fetchAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save desk');
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const roomData = {
      roomNumber: formData.get('roomNumber'),
      name: formData.get('name'),
      capacity: parseInt(formData.get('capacity')),
      amenities: formData.getAll('amenities'),
      hourlyRate: parseFloat(formData.get('hourlyRate')),
      description: formData.get('description'),
      isAvailable: true,
    };

    try {
      if (editingRoom) {
        await roomAPI.updateRoom(editingRoom._id, roomData);
        toast.success('Room updated successfully!');
      } else {
        await roomAPI.createRoom(roomData);
        toast.success('Room created successfully!');
      }
      setShowRoomForm(false);
      setEditingRoom(null);
      fetchAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save room');
    }
  };

  const handleDeleteDesk = async (id) => {
    if (!window.confirm('Are you sure you want to delete this desk?')) return;
    try {
      await deskAPI.deleteDesk(id);
      toast.success('Desk deleted successfully');
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to delete desk');
    }
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await roomAPI.deleteRoom(id);
      toast.success('Room deleted successfully');
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to delete room');
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
            border: '4px solid rgba(255, 0, 110, 0.2)',
            borderTop: '4px solid #ff006e',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255, 0, 110, 0.15) 0%, rgba(255, 77, 143, 0.1) 100%)',
        backdropFilter: 'blur(20px)',
        padding: '2rem 2.5rem',
        borderRadius: '24px',
        marginBottom: '2.5rem',
        border: '1px solid rgba(255, 0, 110, 0.3)',
        boxShadow: '0 8px 32px rgba(255, 0, 110, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, transparent, #ff006e, transparent)',
          animation: 'shimmer 2s infinite'
        }} />
        <h1 style={{ 
          margin: '0 0 0.5rem 0',
          fontSize: '2.5rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #ff006e 0%, #ff4d8f 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px'
        }}>
          🔐 Admin Dashboard
        </h1>
        <p style={{ 
          margin: 0,
          color: '#e0e0e0',
          fontSize: '1.1rem',
          fontWeight: '500'
        }}>
          Complete system management and analytics
        </p>
      </div>

      {/* Stats Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {[
          { title: 'Total Desks', value: stats.totalDesks, subtitle: `${stats.availableDesks} available`, icon: '💻', gradient: 'linear-gradient(135deg, #00d9ff 0%, #0099ff 100%)' },
          { title: 'Total Rooms', value: stats.totalRooms, subtitle: `${stats.availableRooms} available`, icon: '🏢', gradient: 'linear-gradient(135deg, #05ffa1 0%, #00d9ff 100%)' },
          { title: 'Total Bookings', value: stats.totalBookings, subtitle: `${stats.activeBookings} active`, icon: '📅', gradient: 'linear-gradient(135deg, #ffb800 0%, #ff8800 100%)' },
          { title: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, subtitle: `$${stats.pendingRevenue.toFixed(2)} pending`, icon: '💰', gradient: 'linear-gradient(135deg, #b967ff 0%, #f093fb 100%)' }
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
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 0, 110, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(255, 0, 110, 0.3)';
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <p style={{ 
                  margin: 0,
                  color: '#a0a0a0',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: '600'
                }}>
                  {stat.title}
                </p>
                <span style={{ fontSize: '2rem' }}>{stat.icon}</span>
              </div>
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

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
        overflowX: 'auto',
        paddingBottom: '0.5rem'
      }}>
        {['overview', 'desks', 'rooms', 'bookings'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '1rem 2rem',
              background: activeTab === tab 
                ? 'linear-gradient(135deg, rgba(255, 0, 110, 0.2) 0%, rgba(255, 77, 143, 0.2) 100%)'
                : 'transparent',
              border: 'none',
              borderBottom: activeTab === tab ? '3px solid #ff006e' : 'none',
              color: activeTab === tab ? '#ff006e' : '#a0a0a0',
              cursor: 'pointer',
              fontWeight: activeTab === tab ? '700' : '500',
              fontSize: '1rem',
              borderRadius: '12px 12px 0 0',
              transition: 'all 0.3s ease',
              textTransform: 'capitalize',
              whiteSpace: 'nowrap',
              letterSpacing: '0.3px'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab) {
                e.target.style.color = '#ffffff';
                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab) {
                e.target.style.color = '#a0a0a0';
                e.target.style.background = 'transparent';
              }
            }}
          >
            {tab === 'overview' && '📊 '}
            {tab === 'desks' && '💻 '}
            {tab === 'rooms' && '🏢 '}
            {tab === 'bookings' && '📅 '}
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          padding: '2rem',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
        }}>
          <h2 style={{ 
            margin: '0 0 1.5rem 0',
            fontSize: '1.8rem',
            fontWeight: '800',
            color: '#ffffff'
          }}>
            📊 Recent Activity
          </h2>
          <div>
            {bookings.slice(0, 10).map((booking, index) => (
              <div
                key={booking._id}
                style={{ 
                  padding: '1.25rem',
                  marginBottom: index < 9 ? '1rem' : 0,
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.3s ease',
                  animation: `slideIn 0.5s ease-out ${index * 0.05}s both`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 0, 110, 0.3)';
                  e.currentTarget.style.transform = 'translateX(8px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: booking.desk 
                      ? 'linear-gradient(135deg, #00d9ff 0%, #05ffa1 100%)'
                      : 'linear-gradient(135deg, #b967ff 0%, #00d9ff 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    flexShrink: 0
                  }}>
                    {booking.desk ? '💻' : '🏢'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <strong style={{ 
                      display: 'block',
                      color: '#ffffff',
                      fontSize: '1rem',
                      fontWeight: '700',
                      marginBottom: '0.25rem'
                    }}>
                      {booking.desk ? `Desk ${booking.desk.deskNumber}` : booking.meetingRoom?.name}
                    </strong>
                    <p style={{ 
                      margin: 0,
                      fontSize: '0.9rem',
                      color: '#b0b0b0'
                    }}>
                      {booking.user?.name} • {new Date(booking.bookingDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span style={{
                    padding: '0.35rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    background: booking.status === 'confirmed' 
                      ? 'rgba(5, 255, 161, 0.2)' 
                      : 'rgba(255, 0, 110, 0.2)',
                    color: booking.status === 'confirmed' ? '#05ffa1' : '#ff006e',
                    border: booking.status === 'confirmed'
                      ? '1px solid rgba(5, 255, 161, 0.4)'
                      : '1px solid rgba(255, 0, 110, 0.4)'
                  }}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Desks Management Tab */}
      {activeTab === 'desks' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', color: '#ffffff' }}>
              💻 Manage Desks
            </h2>
            <button
              onClick={() => {
                setEditingDesk(null);
                setShowDeskForm(true);
              }}
              style={{
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #00d9ff 0%, #05ffa1 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.95rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: '0 4px 20px rgba(0, 217, 255, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 24px rgba(0, 217, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 20px rgba(0, 217, 255, 0.3)';
              }}
            >
              + Add New Desk
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
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
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                  transition: 'all 0.3s ease',
                  animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = desk.isAvailable
                    ? '0 12px 40px rgba(5, 255, 161, 0.3)'
                    : '0 12px 40px rgba(255, 0, 110, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <h3 style={{
                    margin: 0,
                    fontSize: '1.8rem',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #00d9ff 0%, #05ffa1 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    {desk.deskNumber}
                  </h3>
                  <span style={{
                    padding: '0.4rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    background: desk.isAvailable 
                      ? 'rgba(5, 255, 161, 0.2)'
                      : 'rgba(255, 0, 110, 0.2)',
                    color: desk.isAvailable ? '#05ffa1' : '#ff006e',
                    border: desk.isAvailable
                      ? '1px solid rgba(5, 255, 161, 0.4)'
                      : '1px solid rgba(255, 0, 110, 0.4)'
                  }}>
                    {desk.isAvailable ? '✓ Available' : '✗ Occupied'}
                  </span>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#e0e0e0', fontSize: '0.95rem' }}>
                    <strong>Location:</strong> {desk.location}
                  </p>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#e0e0e0', fontSize: '0.95rem' }}>
                    <strong>Type:</strong> {desk.type}
                  </p>
                  <p style={{ margin: 0, color: '#00d9ff', fontSize: '1.2rem', fontWeight: '700' }}>
                    ${desk.hourlyRate}/hr
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => {
                      setEditingDesk(desk);
                      setShowDeskForm(true);
                    }}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'rgba(0, 217, 255, 0.2)',
                      color: '#00d9ff',
                      border: '1px solid rgba(0, 217, 255, 0.4)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(0, 217, 255, 0.3)';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(0, 217, 255, 0.2)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteDesk(desk._id)}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'rgba(255, 0, 110, 0.2)',
                      color: '#ff006e',
                      border: '1px solid rgba(255, 0, 110, 0.4)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255, 0, 110, 0.3)';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255, 0, 110, 0.2)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rooms Management Tab */}
      {activeTab === 'rooms' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', color: '#ffffff' }}>
              🏢 Manage Rooms
            </h2>
            <button
              onClick={() => {
                setEditingRoom(null);
                setShowRoomForm(true);
              }}
              style={{
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #05ffa1 0%, #00d9ff 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.95rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: '0 4px 20px rgba(5, 255, 161, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 24px rgba(5, 255, 161, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 20px rgba(5, 255, 161, 0.3)';
              }}
            >
              + Add New Room
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {rooms.map((room, index) => (
              <div
                key={room._id}
                style={{
                  background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
                  backdropFilter: 'blur(20px)',
                  padding: '2rem',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                  transition: 'all 0.3s ease',
                  animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(5, 255, 161, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <h3 style={{
                    margin: 0,
                    fontSize: '1.8rem',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #05ffa1 0%, #00d9ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    {room.name}
                  </h3>
                  <span style={{
                    padding: '0.4rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    background: room.isAvailable 
                      ? 'rgba(5, 255, 161, 0.2)'
                      : 'rgba(255, 0, 110, 0.2)',
                    color: room.isAvailable ? '#05ffa1' : '#ff006e',
                    border: room.isAvailable
                      ? '1px solid rgba(5, 255, 161, 0.4)'
                      : '1px solid rgba(255, 0, 110, 0.4)'
                  }}>
                    {room.isAvailable ? '✓ Available' : '✗ Booked'}
                  </span>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#e0e0e0', fontSize: '0.95rem' }}>
                    <strong>Room Number:</strong> {room.roomNumber}
                  </p>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#e0e0e0', fontSize: '0.95rem' }}>
                    <strong>Capacity:</strong> {room.capacity} people
                  </p>
                  <p style={{ margin: 0, color: '#05ffa1', fontSize: '1.2rem', fontWeight: '700' }}>
                    ${room.hourlyRate}/hr
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => {
                      setEditingRoom(room);
                      setShowRoomForm(true);
                    }}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'rgba(5, 255, 161, 0.2)',
                      color: '#05ffa1',
                      border: '1px solid rgba(5, 255, 161, 0.4)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(5, 255, 161, 0.3)';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(5, 255, 161, 0.2)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRoom(room._id)}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'rgba(255, 0, 110, 0.2)',
                      color: '#ff006e',
                      border: '1px solid rgba(255, 0, 110, 0.4)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255, 0, 110, 0.3)';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255, 0, 110, 0.2)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div>
          <h2 style={{ marginBottom: '1rem', color: '#ffffff' }}>📅 All Bookings</h2>
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            padding: '2rem',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            color: '#ffffff'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '700', fontSize: '0.9rem', color: '#a0a0a0' }}>Type</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '700', fontSize: '0.9rem', color: '#a0a0a0' }}>Item</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '700', fontSize: '0.9rem', color: '#a0a0a0' }}>User</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '700', fontSize: '0.9rem', color: '#a0a0a0' }}>Date</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '700', fontSize: '0.9rem', color: '#a0a0a0' }}>Amount</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '700', fontSize: '0.9rem', color: '#a0a0a0' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '0.75rem', color: '#e0e0e0', fontSize: '0.9rem' }}>{booking.desk ? 'Desk' : 'Room'}</td>
                    <td style={{ padding: '0.75rem', color: '#e0e0e0', fontSize: '0.9rem' }}>
                      {booking.desk ? `Desk ${booking.desk.deskNumber}` : booking.meetingRoom?.name}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#e0e0e0', fontSize: '0.9rem' }}>{booking.user?.name}</td>
                    <td style={{ padding: '0.75rem', color: '#e0e0e0', fontSize: '0.9rem' }}>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                    <td style={{ padding: '0.75rem', color: '#e0e0e0', fontSize: '0.9rem' }}>${booking.totalAmount}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        backgroundColor: booking.status === 'confirmed' ? 'rgba(5, 255, 161, 0.2)' : 'rgba(255, 0, 110, 0.2)',
                        color: booking.status === 'confirmed' ? '#05ffa1' : '#ff006e',
                        border: booking.status === 'confirmed'
                          ? '1px solid rgba(5, 255, 161, 0.4)'
                          : '1px solid rgba(255, 0, 110, 0.4)'
                      }}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Desk Form Modal */}
      {showDeskForm && <DeskFormModal desk={editingDesk} onSubmit={handleCreateDesk} onClose={() => { setShowDeskForm(false); setEditingDesk(null); }} />}

      {/* Room Form Modal */}
      {showRoomForm && <RoomFormModal room={editingRoom} onSubmit={handleCreateRoom} onClose={() => { setShowRoomForm(false); setEditingRoom(null); }} />}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, subtitle, color }) => (
  <div style={{
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    borderLeft: `4px solid ${color}`
  }}>
    <h3 style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem', fontWeight: 'normal' }}>{title}</h3>
    <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color }}>{value}</p>
    {subtitle && <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#999' }}>{subtitle}</p>}
  </div>
);

// Desk Form Modal Component
const DeskFormModal = ({ desk, onSubmit, onClose }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease-out'
  }} onClick={onClose}>
    <div style={{
      background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.98) 0%, rgba(20, 20, 20, 0.98) 100%)',
      backdropFilter: 'blur(20px)',
      padding: '2.5rem',
      borderRadius: '24px',
      width: '90%',
      maxWidth: '600px',
      maxHeight: '90vh',
      overflowY: 'auto',
      border: '1px solid rgba(0, 217, 255, 0.3)',
      boxShadow: '0 20px 60px rgba(0, 217, 255, 0.3)',
      position: 'relative',
      animation: 'slideUp 0.3s ease-out'
    }} onClick={(e) => e.stopPropagation()}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, transparent, #00d9ff, transparent)',
        animation: 'shimmer 2s infinite'
      }} />
      
      <h2 style={{
        margin: '0 0 2rem 0',
        fontSize: '2rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #00d9ff 0%, #05ffa1 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '-0.5px'
      }}>
        {desk ? '✏️ Edit Desk' : '➕ Add New Desk'}
      </h2>
      
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.75rem', 
            fontWeight: '700',
            color: '#e0e0e0',
            fontSize: '0.95rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Desk Number
          </label>
          <input 
            type="text" 
            name="deskNumber" 
            defaultValue={desk?.deskNumber} 
            required 
            style={{ 
              width: '100%', 
              padding: '1rem 1.25rem', 
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(0, 217, 255, 0.5)';
              e.target.style.background = 'rgba(0, 217, 255, 0.1)';
              e.target.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.75rem', 
            fontWeight: '700',
            color: '#e0e0e0',
            fontSize: '0.95rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Location
          </label>
          <select 
            name="location" 
            defaultValue={desk?.location} 
            required 
            style={{ 
              width: '100%', 
              padding: '1rem 1.25rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              outline: 'none',
              cursor: 'pointer'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(0, 217, 255, 0.5)';
              e.target.style.background = 'rgba(0, 217, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            <option value="zone-a" style={{ background: '#1a1a1a', color: '#ffffff' }}>Zone A</option>
            <option value="zone-b" style={{ background: '#1a1a1a', color: '#ffffff' }}>Zone B</option>
            <option value="zone-c" style={{ background: '#1a1a1a', color: '#ffffff' }}>Zone C</option>
            <option value="quiet-area" style={{ background: '#1a1a1a', color: '#ffffff' }}>Quiet Area</option>
            <option value="collaborative-area" style={{ background: '#1a1a1a', color: '#ffffff' }}>Collaborative Area</option>
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.75rem', 
            fontWeight: '700',
            color: '#e0e0e0',
            fontSize: '0.95rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Type
          </label>
          <select 
            name="type" 
            defaultValue={desk?.type} 
            required 
            style={{ 
              width: '100%', 
              padding: '1rem 1.25rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              outline: 'none',
              cursor: 'pointer'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(0, 217, 255, 0.5)';
              e.target.style.background = 'rgba(0, 217, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            <option value="fixed" style={{ background: '#1a1a1a', color: '#ffffff' }}>Fixed</option>
            <option value="hot" style={{ background: '#1a1a1a', color: '#ffffff' }}>Hot Desk</option>
            <option value="dedicated" style={{ background: '#1a1a1a', color: '#ffffff' }}>Dedicated</option>
            <option value="standing" style={{ background: '#1a1a1a', color: '#ffffff' }}>Standing</option>
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.75rem', 
            fontWeight: '700',
            color: '#e0e0e0',
            fontSize: '0.95rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Hourly Rate ($)
          </label>
          <input 
            type="number" 
            name="hourlyRate" 
            defaultValue={desk?.hourlyRate} 
            step="0.01" 
            required 
            style={{ 
              width: '100%', 
              padding: '1rem 1.25rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(0, 217, 255, 0.5)';
              e.target.style.background = 'rgba(0, 217, 255, 0.1)';
              e.target.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.75rem', 
            fontWeight: '700',
            color: '#e0e0e0',
            fontSize: '0.95rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Daily Rate ($)
          </label>
          <input 
            type="number" 
            name="dailyRate" 
            defaultValue={desk?.dailyRate} 
            step="0.01" 
            required 
            style={{ 
              width: '100%', 
              padding: '1rem 1.25rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(0, 217, 255, 0.5)';
              e.target.style.background = 'rgba(0, 217, 255, 0.1)';
              e.target.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.75rem', 
            fontWeight: '700',
            color: '#e0e0e0',
            fontSize: '0.95rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Description
          </label>
          <textarea 
            name="description" 
            defaultValue={desk?.description} 
            rows="3" 
            style={{ 
              width: '100%', 
              padding: '1rem 1.25rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(0, 217, 255, 0.5)';
              e.target.style.background = 'rgba(0, 217, 255, 0.1)';
              e.target.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            type="submit" 
            style={{ 
              flex: 1, 
              padding: '1rem 2rem',
              background: 'linear-gradient(135deg, #00d9ff 0%, #05ffa1 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: '0 4px 20px rgba(0, 217, 255, 0.4)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 30px rgba(0, 217, 255, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 20px rgba(0, 217, 255, 0.4)';
            }}
          >
            {desk ? '💾 Update' : '✨ Create'}
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            style={{ 
              flex: 1, 
              padding: '1rem 2rem',
              background: 'linear-gradient(135deg, rgba(255, 0, 110, 0.3) 0%, rgba(255, 77, 143, 0.2) 100%)',
              color: '#ff006e',
              border: '1px solid rgba(255, 0, 110, 0.4)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(255, 0, 110, 0.4) 0%, rgba(255, 77, 143, 0.3) 100%)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(255, 0, 110, 0.3) 0%, rgba(255, 77, 143, 0.2) 100%)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            ❌ Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
);

// Room Form Modal Component  
const RoomFormModal = ({ room, onSubmit, onClose }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease-out'
  }} onClick={onClose}>
    <div style={{
      background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.98) 0%, rgba(20, 20, 20, 0.98) 100%)',
      backdropFilter: 'blur(20px)',
      padding: '2.5rem',
      borderRadius: '24px',
      width: '90%',
      maxWidth: '600px',
      maxHeight: '90vh',
      overflowY: 'auto',
      border: '1px solid rgba(5, 255, 161, 0.3)',
      boxShadow: '0 20px 60px rgba(5, 255, 161, 0.3)',
      position: 'relative',
      animation: 'slideUp 0.3s ease-out'
    }} onClick={(e) => e.stopPropagation()}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, transparent, #05ffa1, transparent)',
        animation: 'shimmer 2s infinite'
      }} />
      
      <h2 style={{
        margin: '0 0 2rem 0',
        fontSize: '2rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #05ffa1 0%, #00d9ff 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '-0.5px'
      }}>
        {room ? '✏️ Edit Room' : '➕ Add New Room'}
      </h2>
      
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.75rem', 
            fontWeight: '700',
            color: '#e0e0e0',
            fontSize: '0.95rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Room Number
          </label>
          <input 
            type="text" 
            name="roomNumber" 
            defaultValue={room?.roomNumber} 
            required 
            style={{ 
              width: '100%', 
              padding: '1rem 1.25rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(5, 255, 161, 0.5)';
              e.target.style.background = 'rgba(5, 255, 161, 0.1)';
              e.target.style.boxShadow = '0 0 20px rgba(5, 255, 161, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.75rem', 
            fontWeight: '700',
            color: '#e0e0e0',
            fontSize: '0.95rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Room Name
          </label>
          <input 
            type="text" 
            name="name" 
            defaultValue={room?.name} 
            required 
            style={{ 
              width: '100%', 
              padding: '1rem 1.25rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(5, 255, 161, 0.5)';
              e.target.style.background = 'rgba(5, 255, 161, 0.1)';
              e.target.style.boxShadow = '0 0 20px rgba(5, 255, 161, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.75rem', 
            fontWeight: '700',
            color: '#e0e0e0',
            fontSize: '0.95rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Capacity
          </label>
          <input 
            type="number" 
            name="capacity" 
            defaultValue={room?.capacity} 
            min="1" 
            required 
            style={{ 
              width: '100%', 
              padding: '1rem 1.25rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(5, 255, 161, 0.5)';
              e.target.style.background = 'rgba(5, 255, 161, 0.1)';
              e.target.style.boxShadow = '0 0 20px rgba(5, 255, 161, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.75rem', 
            fontWeight: '700',
            color: '#e0e0e0',
            fontSize: '0.95rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Hourly Rate ($)
          </label>
          <input 
            type="number" 
            name="hourlyRate" 
            defaultValue={room?.hourlyRate} 
            step="0.01" 
            required 
            style={{ 
              width: '100%', 
              padding: '1rem 1.25rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(5, 255, 161, 0.5)';
              e.target.style.background = 'rgba(5, 255, 161, 0.1)';
              e.target.style.boxShadow = '0 0 20px rgba(5, 255, 161, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.75rem', 
            fontWeight: '700',
            color: '#e0e0e0',
            fontSize: '0.95rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Description
          </label>
          <textarea 
            name="description" 
            defaultValue={room?.description} 
            rows="3" 
            style={{ 
              width: '100%', 
              padding: '1rem 1.25rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(5, 255, 161, 0.5)';
              e.target.style.background = 'rgba(5, 255, 161, 0.1)';
              e.target.style.boxShadow = '0 0 20px rgba(5, 255, 161, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            type="submit" 
            style={{ 
              flex: 1, 
              padding: '1rem 2rem',
              background: 'linear-gradient(135deg, #05ffa1 0%, #00d9ff 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: '0 4px 20px rgba(5, 255, 161, 0.4)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 30px rgba(5, 255, 161, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 20px rgba(5, 255, 161, 0.4)';
            }}
          >
            {room ? '💾 Update' : '✨ Create'}
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            style={{ 
              flex: 1, 
              padding: '1rem 2rem',
              background: 'linear-gradient(135deg, rgba(255, 0, 110, 0.3) 0%, rgba(255, 77, 143, 0.2) 100%)',
              color: '#ff006e',
              border: '1px solid rgba(255, 0, 110, 0.4)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(255, 0, 110, 0.4) 0%, rgba(255, 77, 143, 0.3) 100%)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(255, 0, 110, 0.3) 0%, rgba(255, 77, 143, 0.2) 100%)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            ❌ Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default Admin;

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
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(40px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `}
</style>
