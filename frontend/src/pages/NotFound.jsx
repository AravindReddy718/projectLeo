import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/common/Layout';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoToDashboard = () => {
    if (user && user.role) {
      navigate(`/${user.role}/dashboard`, { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  };

  const handleGoToLogin = () => {
    navigate('/login', { replace: true });
  };

  return (
    <Layout>
      <div style={{ 
        padding: '4rem 2rem', 
        textAlign: 'center',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: '#333' }}>404</h1>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#666' }}>
          Page Not Found
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#888', marginBottom: '2rem', maxWidth: '500px' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {user ? (
            <button 
              onClick={handleGoToDashboard}
              style={{
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Go to Dashboard
            </button>
          ) : (
            <button 
              onClick={handleGoToLogin}
              style={{
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Go to Login
            </button>
          )}
          <button 
            onClick={() => navigate('/', { replace: true })}
            style={{
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              backgroundColor: 'transparent',
              color: '#667eea',
              border: '2px solid #667eea',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Go to Home
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;

