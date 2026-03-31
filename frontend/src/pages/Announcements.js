import React, { useState, useEffect } from 'react';
import { announcementAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await announcementAPI.getAllAnnouncements();
      setAnnouncements(response.data.announcements || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      general: 'linear-gradient(135deg, #00d9ff 0%, #05ffa1 100%)',
      maintenance: 'linear-gradient(135deg, #ffb800 0%, #ff8800 100%)',
      event: 'linear-gradient(135deg, #b967ff 0%, #ff006e 100%)',
      policy: 'linear-gradient(135deg, #ff006e 0%, #ff4d8f 100%)',
    };
    return colors[category] || 'linear-gradient(135deg, #00d9ff 0%, #b967ff 100%)';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      general: '📢',
      maintenance: '🔧',
      event: '🎉',
      policy: '📋',
    };
    return icons[category] || '📢';
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      high: { bg: 'rgba(255, 0, 110, 0.2)', color: '#ff006e', border: 'rgba(255, 0, 110, 0.4)' },
      medium: { bg: 'rgba(255, 182, 0, 0.2)', color: '#ffb800', border: 'rgba(255, 182, 0, 0.4)' },
      low: { bg: 'rgba(0, 217, 255, 0.2)', color: '#00d9ff', border: 'rgba(0, 217, 255, 0.4)' },
    };
    return styles[priority] || styles.medium;
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
          <p>Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%)',
        backdropFilter: 'blur(20px)',
        padding: '2rem 2.5rem',
        borderRadius: '24px',
        marginBottom: '2.5rem',
        border: '1px solid rgba(240, 147, 251, 0.2)',
        boxShadow: '0 8px 32px rgba(240, 147, 251, 0.15)',
      }}>
        <h1 style={{ 
          margin: '0 0 0.5rem 0',
          fontSize: '2.5rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px'
        }}>
          📢 Announcements
        </h1>
        <p style={{ 
          margin: 0,
          color: '#e0e0e0',
          fontSize: '1.1rem',
          fontWeight: '500'
        }}>
          Stay updated with the latest news and community updates
        </p>
      </div>

      {/* Announcements List */}
      {announcements.length === 0 ? (
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
          <p style={{ color: '#e0e0e0', fontSize: '1.2rem' }}>
            No announcements at the moment
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {announcements.map((announcement, index) => {
            const priorityStyle = getPriorityBadge(announcement.priority);
            return (
              <div
                key={announcement._id}
                style={{
                  background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
                  backdropFilter: 'blur(20px)',
                  padding: '2rem',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                  transition: 'all 0.3s ease',
                  animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(240, 147, 251, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(240, 147, 251, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                {/* Decorative gradient */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '200px',
                  height: '200px',
                  background: getCategoryColor(announcement.category),
                  opacity: 0.05,
                  borderRadius: '50%',
                  filter: 'blur(60px)',
                  pointerEvents: 'none'
                }} />

                {/* Header */}
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '1.5rem',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '12px',
                        background: getCategoryColor(announcement.category),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
                      }}>
                        {getCategoryIcon(announcement.category)}
                      </div>
                      <div>
                        <h3 style={{ 
                          margin: 0,
                          fontSize: '1.6rem',
                          fontWeight: '800',
                          color: '#ffffff',
                          letterSpacing: '-0.3px'
                        }}>
                          {announcement.title}
                        </h3>
                        <p style={{ 
                          margin: '0.25rem 0 0 0',
                          color: '#a0a0a0',
                          fontSize: '0.85rem'
                        }}>
                          {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{
                      background: priorityStyle.bg,
                      color: priorityStyle.color,
                      border: `1px solid ${priorityStyle.border}`,
                      padding: '0.4rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {announcement.priority}
                    </span>
                    <span style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#e0e0e0',
                      padding: '0.4rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'capitalize',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      {announcement.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <p style={{ 
                    margin: 0,
                    color: '#e0e0e0',
                    fontSize: '1rem',
                    lineHeight: '1.7',
                    letterSpacing: '0.2px'
                  }}>
                    {announcement.content}
                  </p>

                  {/* Author */}
                  {announcement.author && (
                    <div style={{
                      marginTop: '1.5rem',
                      paddingTop: '1.5rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #00d9ff 0%, #b967ff 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        fontWeight: '700',
                        color: 'white'
                      }}>
                        {announcement.author.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ 
                          margin: 0,
                          color: '#e0e0e0',
                          fontSize: '0.9rem',
                          fontWeight: '600'
                        }}>
                          {announcement.author.name}
                        </p>
                        <p style={{ 
                          margin: 0,
                          color: '#808080',
                          fontSize: '0.8rem'
                        }}>
                          Posted by Admin
                        </p>
                      </div>
                    </div>
                  )}
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

export default Announcements;