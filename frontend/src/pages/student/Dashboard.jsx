import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Layout from '../../components/common/Layout';
import studentService from '../../services/studentService';
import api from '../../services/api';
import './Dashboard.css';

export default function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await api.get('/dashboard/student');
      setDashboardData(data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load dashboard');
      // Don't set mock data - show error instead
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

  if (error && !dashboardData) {
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

  const studentData = dashboardData?.student;
  const stats = dashboardData?.stats;
  const recentComplaints = dashboardData?.recentActivities?.recentComplaints || [];
  const recentPayments = dashboardData?.recentActivities?.recentPayments || [];
  
  // Calculate total due from payments
  const totalDue = stats?.payments?.pending || 0;
  const feeSummary = studentData?.feeSummary || { pendingFees: 0 };
  const actualDue = feeSummary.pendingFees || totalDue;

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
          <h2>Welcome back, {studentData?.personalInfo?.firstName || user?.profile?.firstName || 'Student'}! 👋</h2>
          <p>Here's your hostel overview for today</p>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card card-blue">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Total Due</h3>
              <p className="stat-amount">₹{actualDue.toLocaleString()}</p>
              <p className="stat-due">
                {stats?.payments?.overdue > 0 
                  ? `${stats.payments.overdue} overdue` 
                  : stats?.payments?.pending > 0 
                  ? `${stats.payments.pending} pending` 
                  : 'All paid'}
              </p>
            </div>
          </div>
          
          <div className="stat-card card-green">
            <div className="stat-icon">🏠</div>
            <div className="stat-content">
              <h3>Room Details</h3>
              <p className="stat-info">Room {studentData?.hostelInfo?.roomNumber || '101'}, Block {studentData?.hostelInfo?.block || 'A'}</p>
              <p className="stat-subinfo">Floor: {studentData?.hostelInfo?.floor || '1'}</p>
            </div>
          </div>
          
          <div className="stat-card card-purple">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>Active Complaints</h3>
              <p className="stat-amount">{stats?.complaints?.pending || 0}</p>
              <p className="stat-subinfo">{stats?.complaints?.pending || 0} pending resolution</p>
            </div>
          </div>

          <div className="stat-card card-orange">
            <div className="stat-icon">🎓</div>
            <div className="stat-content">
              <h3>Academic Info</h3>
              <p className="stat-info">{studentData?.academicInfo?.department || 'Computer Science'}</p>
              <p className="stat-subinfo">{studentData?.academicInfo?.course || 'B.Tech'}</p>
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
                      <span className="complaint-type">{complaint.category || complaint.type}</span>
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
        {recentPayments.length > 0 && (
          <div className="info-card">
            <h3 className="info-title">Recent Payments</h3>
            <div className="due-breakdown">
              {recentPayments.slice(0, 5).map((payment, index) => (
                <div key={payment._id || index} className="due-item">
                  <span>{payment.description || 'Payment'}:</span>
                  <span className={payment.status === 'paid' ? 'text-success' : 'text-warning'}>
                    ₹{payment.totalAmount?.toLocaleString() || '0'} ({payment.status || 'pending'})
                  </span>
                </div>
              ))}
              <div className="due-item total">
                <span>Total Due:</span>
                <span>₹{actualDue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

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