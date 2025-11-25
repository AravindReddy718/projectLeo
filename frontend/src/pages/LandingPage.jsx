import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const handleLogin = () => navigate('/login');

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-icon">
              <i className="fas fa-university"></i>
            </div>
            <span className="logo-text">IIT HMC Portal</span>
          </div>
          <ul className="nav-menu">
            <li className="nav-item">
              <a href="#resources" className="nav-link">Resources</a>
            </li>
            <li className="nav-item">
              <a href="#contact" className="nav-link">Contact</a>
            </li>
            <li className="nav-item">
              <a href="#dev-team" className="nav-link">Dev Team</a>
            </li>
          </ul>
          <button className="nav-login-btn" onClick={handleLogin}>
            Login
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          {/* Left Side - Text Content */}
          <div className="text-content">
            <h1 className="main-heading">
              Welcome to Hall Management Portal...
            </h1>
            <p className="description">
              Access all hostel services and resources in one place. Manage your accommodation, 
              requests, and stay informed about important updates.
            </p>
            
            <div className="stats-container">
              <div className="stat-item">
                <span className="stat-number">5000+</span>
                <span className="stat-label">Students</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">15+</span>
                <span className="stat-label">Hostels</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Support</span>
              </div>
            </div>
            
            <div className="button-group">
              <button className="login-btn primary-btn" onClick={handleLogin}>
                Login Now
              </button>
              <button className="secondary-btn">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Side - Feature Cards */}
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon blue-bg">
                <i className="fas fa-door-open"></i>
              </div>
              <h3>Room Management</h3>
              <p>Automated room assignment with transparent process</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon purple-bg">
                <i className="fas fa-users"></i>
              </div>
              <h3>Student Management</h3>
              <p>Complete student profile and accommodation tracking</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon red-bg">
                <i className="fas fa-tools"></i>
              </div>
              <h3>Maintenance</h3>
              <p>Quick complaint registration and tracking system</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-card">
              <div className="feature-icon green-bg">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Security</h3>
              <p>Enhanced security protocols and monitoring</p>
            </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon orange-bg">
                <i className="fas fa-bell"></i>
              </div>
              <h3>Notifications</h3>
              <p>Instant alerts for important updates and announcements</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon gray-bg">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Dashboard</h3>
              <p>Comprehensive overview of all hostel operations</p>
            </div>
          </div>
        </div>
      </main>

      {/* Background Elements */}
      <div className="bg-blur-circle circle-1"></div>
      <div className="bg-blur-circle circle-2"></div>
      <div className="bg-blur-circle circle-3"></div>
    </div>
  );
};

export default LandingPage;