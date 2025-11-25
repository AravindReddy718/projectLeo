import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import chairmanService from '../../services/chairmanService';
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const overview = await chairmanService.getDashboardOverview();
      const performance = await chairmanService.getPerformanceMetrics();
      const roomOccupancy = await chairmanService.getRoomOccupancy();
      
      // Set dashboard stats from API
      setDashboardStats({
        totalStudents: overview.overview?.totalStudents || 0,
        totalWardens: overview.overview?.totalUsers || 0,
        totalComplaints: overview.overview?.totalComplaints || 0,
        resolvedComplaints: overview.overview?.resolvedComplaints || 0,
        pendingComplaints: overview.overview?.pendingComplaints || 0,
        totalRevenue: overview.financial?.totalRevenue || 0,
        occupancyRate: 0, // Calculate from room data
        avgResolutionTime: performance.resolutionStats?.avgResolutionTime || 0
      });

      // Set recent activities from API
      const activities = [];
      if (overview.recentActivities?.recentComplaints) {
        overview.recentActivities.recentComplaints.forEach(complaint => {
          activities.push({
            id: complaint._id,
            type: 'complaint',
            message: `Complaint: ${complaint.title}`,
            time: new Date(complaint.createdAt).toLocaleString(),
            hall: complaint.student?.hostelInfo?.block || 'N/A'
          });
        });
      }
      if (overview.recentActivities?.recentPayments) {
        overview.recentActivities.recentPayments.forEach(payment => {
          activities.push({
            id: payment._id,
            type: 'financial',
            message: `Payment: ₹${payment.totalAmount}`,
            time: new Date(payment.paidDate || payment.createdAt).toLocaleString(),
            hall: 'All'
          });
        });
      }
      setRecentActivities(activities.slice(0, 10));

      // Set hall-wise data from room occupancy
      const hallData = roomOccupancy.blockStats?.map(block => ({
        hall: block._id || 'Unknown',
        students: block.count || 0,
        complaints: 0, // Would need separate API call
        resolutionRate: 0,
        revenue: 0
      })) || [];
      setHallWiseData(hallData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      alert(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceColor = (rate) => {
    if (rate >= 90) return 'excellent';
    if (rate >= 80) return 'good';
    if (rate >= 70) return 'average';
    return 'poor';
  };

  if (loading) {
    return (
      <Layout>
        <div className="chairman-dashboard">
          <div className="loading-container">
            <p>Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

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
              <p className="metric-label">
                {dashboardStats.totalComplaints > 0 
                  ? `${((dashboardStats.resolvedComplaints / dashboardStats.totalComplaints) * 100).toFixed(1)}% resolution rate`
                  : 'No complaints yet'}
              </p>
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
              {hallWiseData.length === 0 ? (
                <p>No hall data available</p>
              ) : (
                hallWiseData.map(hall => (
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
              ))
              )}
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
                  {recentActivities.length === 0 ? (
                    <p>No recent activities</p>
                  ) : (
                    recentActivities.map(activity => (
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
                  ))
                  )}
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