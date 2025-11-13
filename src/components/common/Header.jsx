import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleDisplay = (role) => {
    const roleMap = {
      'student': 'Student',
      'clerk': 'Hall Clerk', 
      'warden': 'Warden',
      'mess-manager': 'Mess Manager',
      'chairman': 'HMC Chairman',
      'controlling-warden': 'Controlling Warden'
    };
    return roleMap[role] || role;
  };

  const showBackButton = !location.pathname.includes('/dashboard');

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          {showBackButton && (
            <button 
              className="btn btn-secondary back-btn"
              onClick={() => navigate(`/${user?.role}/dashboard`)}
            >
              ← Dashboard
            </button>
          )}
          <div className="header-info">
            <h1 className="header-title">🏛️ IIT HMC Portal</h1>
            <p className="header-subtitle">
              Welcome, {user?.name} • {getRoleDisplay(user?.role)} • Hall: {user?.hall}
            </p>
          </div>
        </div>
        
        <div className="header-right">
          <button 
            onClick={handleLogout}
            className="btn btn-danger"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}