import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import './Dashboard.css';

const API_BASE_URL = 'http://localhost:5001/api';
// Student ID from test data - TODO: Get from auth context
const studentId = '690256e03cf868dd730c2b15';

export default function StudentDashboard() {
  const [studentData, setStudentData] = useState(null);
  const [stats, setStats] = useState({
    totalDue: 0,
    activeComplaints: 0,
    pendingPayments: 0
  });
  const [dueBreakdown, setDueBreakdown] = useState({
    messCharges: 0,
    roomRent: 0,
    amenitiesFee: 0,
    otherCharges: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [dashboardResponse, complaintsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/students/dashboard/${studentId}`),
        fetch(`${API_BASE_URL}/students/dashboard/${studentId}/complaints?limit=3`)
      ]);
      
      if (!dashboardResponse.ok) throw new Error('Failed to fetch dashboard data');
      if (!complaintsResponse.ok) throw new Error('Failed to fetch complaints data');
      
      const dashboardData = await dashboardResponse.json();
      const complaintsData = await complaintsResponse.json();
      
      // Backend returns data wrapped in 'data' property
      setStudentData(dashboardData.data.studentData);
      setStats(dashboardData.data.stats);
      setDueBreakdown(dashboardData.data.dueBreakdown);
      setRecentComplaints(complaintsData.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'status-pending', text: 'Pending' },
      'in-progress': { class: 'status-progress', text: 'In Progress' },
      resolved: { class: 'status-resolved', text: 'Resolved' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { class: 'priority-low', text: 'Low' },
      medium: { class: 'priority-medium', text: 'Medium' },
      high: { class: 'priority-high', text: 'High' }
    };
    const config = priorityConfig[priority] || priorityConfig.medium;
    return <span className={`priority-badge ${config.class}`}>{config.text}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="dashboard-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error && !studentData) {
    return (
      <Layout>
        <div className="dashboard-container">
          <div className="error-container">
            <h2>Error Loading Dashboard</h2>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchDashboardData}>
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const totalDue = (dueBreakdown?.messCharges || 0) + (dueBreakdown?.roomRent || 0) + 
                   (dueBreakdown?.amenitiesFee || 0) + (dueBreakdown?.otherCharges || 0);

  return (
    <Layout>
      <div className="dashboard-container">
        <h1 className="dashboard-title">Student Dashboard</h1>
        
        {error && (
          <div className="alert alert-warning">
            <strong>Note:</strong> {error}
          </div>
        )}

        {/* Welcome Section */}
        <div className="welcome-section">
          <h2>Welcome back, {studentData?.name || 'Student'}! 👋</h2>
          <p>Here's your hostel overview for today</p>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card card-blue">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Total Due</h3>
              <p className="stat-amount">₹{totalDue}</p>
              <p className="stat-due">Due in 5 days</p>
            </div>
          </div>
          
          <div className="stat-card card-green">
            <div className="stat-icon">🏠</div>
            <div className="stat-content">
              <h3>Room Details</h3>
              <p className="stat-info">{studentData?.roomNo}, {studentData?.hall}</p>
              <p className="stat-subinfo">Warden: {studentData?.wardenName}</p>
            </div>
          </div>
          
          <div className="stat-card card-purple">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>Active Complaints</h3>
              <p className="stat-amount">{stats.activeComplaints}</p>
              <p className="stat-subinfo">{stats.activeComplaints} pending resolution</p>
            </div>
          </div>

          <div className="stat-card card-orange">
            <div className="stat-icon">🎓</div>
            <div className="stat-content">
              <h3>Academic Info</h3>
              <p className="stat-info">{studentData?.department}</p>
              <p className="stat-subinfo">{studentData?.course}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Quick Actions */}
          <div className="action-section">
            <h3 className="section-title">Quick Actions</h3>
            <div className="action-buttons">
              <button 
                className="btn btn-primary" 
                onClick={() => navigate('/student/payments')}
              >
                💳 Pay Dues
              </button>
              <button 
                className="btn btn-success" 
                onClick={() => navigate('/student/complaints')}
              >
                🛠️ Raise Complaint
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => navigate('/student/profile')}
              >
                👤 View Profile
              </button>
              <button 
                className="btn btn-purple" 
                onClick={() => navigate('/student/room-allotment')}
              >
                🏠 Allotment Letter
              </button>
            </div>
          </div>

          {/* Recent Complaints */}
          {recentComplaints.length > 0 && (
            <div className="recent-section">
              <h3 className="section-title">Recent Complaints</h3>
              <div className="complaints-list">
                {recentComplaints.map(complaint => (
                  <div key={complaint._id} className="complaint-item">
                    <div className="complaint-main">
                      <h4>{complaint.title}</h4>
                      <div className="complaint-meta">
                        {getPriorityBadge(complaint.priority)}
                        {getStatusBadge(complaint.status)}
                      </div>
                    </div>
                    <div className="complaint-details">
                      <span className="complaint-type">{complaint.type}</span>
                      <span className="complaint-date">{formatDate(complaint.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                className="btn btn-outline"
                onClick={() => navigate('/student/complaints')}
              >
                View All Complaints →
              </button>
            </div>
          )}
        </div>

        {/* Due Breakdown */}
        <div className="info-card">
          <h3 className="info-title">Due Breakdown</h3>
          <div className="due-breakdown">
            <div className="due-item">
              <span>Mess Charges:</span>
              <span>₹{dueBreakdown.messCharges}</span>
            </div>
            <div className="due-item">
              <span>Room Rent:</span>
              <span>₹{dueBreakdown.roomRent}</span>
            </div>
            <div className="due-item">
              <span>Amenities Fee:</span>
              <span>₹{dueBreakdown.amenitiesFee}</span>
            </div>
            {dueBreakdown.otherCharges > 0 && (
              <div className="due-item">
                <span>Other Charges:</span>
                <span>₹{dueBreakdown.otherCharges}</span>
              </div>
            )}
            <div className="due-item total">
              <span>Total Due:</span>
              <span>₹{totalDue}</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="quick-links">
          <h3 className="section-title">Quick Links</h3>
          <div className="links-grid">
            <div className="link-item" onClick={() => navigate('/student/mess-menu')}>
              <span className="link-icon">🍽️</span>
              <span>Mess Menu</span>
            </div>
            <div className="link-item" onClick={() => navigate('/student/notices')}>
              <span className="link-icon">📢</span>
              <span>Notices</span>
            </div>
            <div className="link-item" onClick={() => navigate('/student/visitors')}>
              <span className="link-icon">👥</span>
              <span>Visitor Log</span>
            </div>
            <div className="link-item" onClick={() => navigate('/student/help')}>
              <span className="link-icon">❓</span>
              <span>Help & Support</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}