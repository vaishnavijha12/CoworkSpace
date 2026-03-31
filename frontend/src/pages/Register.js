import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../features/auth/authSlice';
import { toast } from 'react-hot-toast';

const Register = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [company, setCompany] = React.useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    const result = await dispatch(register({ name, email, password, phone, company }));
    if (register.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background effects */}
      <div style={{
        position: 'absolute',
        top: '5%',
        right: '15%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(5, 255, 161, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 7s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(0, 217, 255, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 9s ease-in-out infinite reverse'
      }} />

      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.98) 0%, rgba(20, 20, 20, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        padding: '3rem 2.5rem',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(5, 255, 161, 0.1)',
        width: '100%',
        maxWidth: '520px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeIn 0.6s ease-out'
      }}>
        {/* Logo/Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            fontSize: '3.5rem',
            marginBottom: '1rem',
            animation: 'bounce 2s ease-in-out infinite'
          }}>
            ✨
          </div>
          <h2 style={{ 
            background: 'linear-gradient(135deg, #05ffa1 0%, #00d9ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '2.2rem',
            fontWeight: '800',
            marginBottom: '0.5rem',
            letterSpacing: '-0.5px'
          }}>
            Join CoworkSpace
          </h2>
          <p style={{ color: '#a0a0a0', fontSize: '1rem', fontWeight: '500' }}>
            Create your account and get started
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ 
              display: 'block',
              marginBottom: '0.65rem',
              fontWeight: '600',
              color: '#e0e0e0',
              fontSize: '0.9rem'
            }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.95rem 1.15rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                fontSize: '0.98rem',
                color: 'white',
                transition: 'all 0.3s ease',
                fontWeight: '500'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#05ffa1';
                e.target.style.boxShadow = '0 0 0 3px rgba(5, 255, 161, 0.1), 0 0 20px rgba(5, 255, 161, 0.2)';
                e.target.style.background = 'rgba(5, 255, 161, 0.05)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.boxShadow = 'none';
                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
              placeholder="John Doe"
              required
            />
          </div>
          
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ 
              display: 'block',
              marginBottom: '0.65rem',
              fontWeight: '600',
              color: '#e0e0e0',
              fontSize: '0.9rem'
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.95rem 1.15rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                fontSize: '0.98rem',
                color: 'white',
                transition: 'all 0.3s ease',
                fontWeight: '500'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#05ffa1';
                e.target.style.boxShadow = '0 0 0 3px rgba(5, 255, 161, 0.1), 0 0 20px rgba(5, 255, 161, 0.2)';
                e.target.style.background = 'rgba(5, 255, 161, 0.05)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.boxShadow = 'none';
                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
              placeholder="john@example.com"
              required
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ 
                display: 'block',
                marginBottom: '0.65rem',
                fontWeight: '600',
                color: '#e0e0e0',
                fontSize: '0.9rem'
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.95rem 1.15rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  fontSize: '0.98rem',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  fontWeight: '500'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#05ffa1';
                  e.target.style.boxShadow = '0 0 0 3px rgba(5, 255, 161, 0.1)';
                  e.target.style.background = 'rgba(5, 255, 161, 0.05)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
                placeholder="••••••••"
                required
              />
            </div>
            
            <div>
              <label style={{ 
                display: 'block',
                marginBottom: '0.65rem',
                fontWeight: '600',
                color: '#e0e0e0',
                fontSize: '0.9rem'
              }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.95rem 1.15rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  fontSize: '0.98rem',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  fontWeight: '500'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#05ffa1';
                  e.target.style.boxShadow = '0 0 0 3px rgba(5, 255, 161, 0.1)';
                  e.target.style.background = 'rgba(5, 255, 161, 0.05)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ 
              display: 'block',
              marginBottom: '0.65rem',
              fontWeight: '600',
              color: '#e0e0e0',
              fontSize: '0.9rem'
            }}>
              Phone (Optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: '100%',
                padding: '0.95rem 1.15rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                fontSize: '0.98rem',
                color: 'white',
                transition: 'all 0.3s ease',
                fontWeight: '500'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#05ffa1';
                e.target.style.boxShadow = '0 0 0 3px rgba(5, 255, 161, 0.1)';
                e.target.style.background = 'rgba(5, 255, 161, 0.05)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.boxShadow = 'none';
                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block',
              marginBottom: '0.65rem',
              fontWeight: '600',
              color: '#e0e0e0',
              fontSize: '0.9rem'
            }}>
              Company (Optional)
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              style={{
                width: '100%',
                padding: '0.95rem 1.15rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                fontSize: '0.98rem',
                color: 'white',
                transition: 'all 0.3s ease',
                fontWeight: '500'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#05ffa1';
                e.target.style.boxShadow = '0 0 0 3px rgba(5, 255, 161, 0.1)';
                e.target.style.background = 'rgba(5, 255, 161, 0.05)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.boxShadow = 'none';
                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
              placeholder="Your Company Name"
            />
          </div>

          {error && (
            <div style={{ 
              color: '#ff006e',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              padding: '1rem',
              background: 'rgba(255, 0, 110, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 0, 110, 0.3)',
              fontWeight: '500',
              animation: 'shake 0.5s ease-in-out'
            }}>
              ⚠️ {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '1.1rem',
              background: isLoading 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'linear-gradient(135deg, #05ffa1 0%, #00d9ff 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.05rem',
              fontWeight: '700',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: isLoading ? 'none' : '0 8px 24px rgba(5, 255, 161, 0.3)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 32px rgba(5, 255, 161, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 24px rgba(5, 255, 161, 0.3)';
              }
            }}
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '3px solid white',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
                Creating Account...
              </span>
            ) : (
              '✨ Create Account'
            )}
          </button>
        </form>
        
        <p style={{ 
          textAlign: 'center',
          marginTop: '2rem',
          color: '#a0a0a0',
          fontSize: '0.95rem',
          fontWeight: '500'
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ 
            color: '#05ffa1',
            textDecoration: 'none',
            fontWeight: '700',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = '#00f5d4';
            e.target.style.textDecoration = 'underline';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#05ffa1';
            e.target.style.textDecoration = 'none';
          }}
          >
            Sign in
          </Link>
        </p>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-30px); }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }
        `}
      </style>
    </div>
  );
};

export default Register;