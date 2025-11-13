import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import './ChairmanDashboard.css';

const ChairmanDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    totalWardens: 0,
    totalComplaints: 0,
    resolvedComplaints: 0,
    pendingComplaints: 0,
    totalRevenue: 0,
    occupancyRate: 0,
    avgResolutionTime: 0
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [hallWiseData, setHallWiseData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Mock data - replace with API calls
    setDashboardStats({
      totalStudents: 3247,
      totalWardens: 12,
      totalComplaints: 156,
      resolvedComplaints: 128,
      pendingComplaints: 28,
      totalRevenue: 2456700,
      occupancyRate: 92.5,
      avgResolutionTime: 2.3
    });

    setRecentActivities([
      { id: 1, type: 'complaint', message: 'High priority complaint resolved in Hall 3', time: '2 hours ago', hall: 'Hall 3' },
      { id: 2, type: 'financial', message: 'Monthly revenue report generated', time: '4 hours ago', hall: 'All' },
      { id: 3, type: 'student', message: 'New student allocation in Hall 5', time: '6 hours ago', hall: 'Hall 5' },
      { id: 4, type: 'maintenance', message: 'Quarterly maintenance scheduled', time: '1 day ago', hall: 'All' }
    ]);

    setHallWiseData([
      { hall: 'Hall 1', students: 280, complaints: 12, resolutionRate: 85, revenue: 245000 },
      { hall: 'Hall 2', students: 265, complaints: 8, resolutionRate: 92, revenue: 231000 },
      { hall: 'Hall 3', students: 310, complaints: 15, resolutionRate: 78, revenue: 268000 },
      { hall: 'Hall 4', students: 295, complaints: 10, resolutionRate: 88, revenue: 252000 },
      { hall: 'Hall 5', students: 275, complaints: 7, resolutionRate: 95, revenue: 238000 }
    ]);
  }, []);

  const getPerformanceColor = (rate) => {
    if (rate >= 90) return 'excellent';
    if (rate >= 80) return 'good';
    if (rate >= 70) return 'average';
    return 'poor';
  };

  return (
    <Layout>
      <div className="chairman-dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Chairman Dashboard</h1>
          <p className="dashboard-subtitle">Oversight and Analytics Overview</p>
        </div>

        {/* Key Metrics */}
        <div className="metrics-grid">
          <div className="metric-card metric-primary">
            <div className="metric-icon">👨‍🎓</div>
            <div className="metric-content">
              <h3>Total Students</h3>
              <p className="metric-value">{dashboardStats.totalStudents}</p>
              <p className="metric-label">Across all halls</p>
            </div>
          </div>

          <div className="metric-card metric-success">
            <div className="metric-icon">✅</div>
            <div className="metric-content">
              <h3>Complaints Resolved</h3>
              <p className="metric-value">{dashboardStats.resolvedComplaints}</p>
              <p className="metric-label">{((dashboardStats.resolvedComplaints / dashboardStats.totalComplaints) * 100).toFixed(1)}% resolution rate</p>
            </div>
          </div>

          <div className="metric-card metric-warning">
            <div className="metric-icon">💰</div>
            <div className="metric-content">
              <h3>Total Revenue</h3>
              <p className="metric-value">₹{(dashboardStats.totalRevenue / 100000).toFixed(1)}L</p>
              <p className="metric-label">This academic year</p>
            </div>
          </div>

          <div className="metric-card metric-info">
            <div className="metric-icon">📊</div>
            <div className="metric-content">
              <h3>Occupancy Rate</h3>
              <p className="metric-value">{dashboardStats.occupancyRate}%</p>
              <p className="metric-label">Hostel utilization</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Hall Performance */}
          <div className="content-section">
            <div className="section-header">
              <h3>Hall-wise Performance</h3>
              <button 
                className="btn btn-outline"
                onClick={() => navigate('/chairman/hall-reports')}
              >
                View Detailed Reports
              </button>
            </div>
            <div className="hall-performance">
              {hallWiseData.map(hall => (
                <div key={hall.hall} className="hall-card">
                  <div className="hall-header">
                    <h4>{hall.hall}</h4>
                    <span className={`performance-badge ${getPerformanceColor(hall.resolutionRate)}`}>
                      {hall.resolutionRate}%
                    </span>
                  </div>
                  <div className="hall-stats">
                    <div className="hall-stat">
                      <span>Students</span>
                      <strong>{hall.students}</strong>
                    </div>
                    <div className="hall-stat">
                      <span>Complaints</span>
                      <strong>{hall.complaints}</strong>
                    </div>
                    <div className="hall-stat">
                      <span>Revenue</span>
                      <strong>₹{(hall.revenue / 1000).toFixed(0)}K</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions & Recent Activities */}
          <div className="content-columns">
            <div className="column">
              <div className="content-section">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/chairman/warden-reports')}
                  >
                    📋 Warden Reports
                  </button>
                  <button 
                    className="btn btn-success"
                    onClick={() => navigate('/chairman/student-analytics')}
                  >
                    📊 Student Analytics
                  </button>
                  <button 
                    className="btn btn-warning"
                    onClick={() => navigate('/chairman/financial-reports')}
                  >
                    💰 Financial Overview
                  </button>
                  <button 
                    className="btn btn-info"
                    onClick={() => navigate('/chairman/complaint-analysis')}
                  >
                    🛠️ Complaint Analysis
                  </button>
                </div>
              </div>
            </div>

            <div className="column">
              <div className="content-section">
                <h3>Recent Activities</h3>
                <div className="activities-list">
                  {recentActivities.map(activity => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-icon">
                        {activity.type === 'complaint' && '🛠️'}
                        {activity.type === 'financial' && '💰'}
                        {activity.type === 'student' && '👨‍🎓'}
                        {activity.type === 'maintenance' && '🔧'}
                      </div>
                      <div className="activity-content">
                        <p>{activity.message}</p>
                        <span className="activity-meta">
                          {activity.hall} • {activity.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChairmanDashboard;