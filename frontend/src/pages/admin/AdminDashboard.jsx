import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import adminService from '../../services/adminService';
import './AdminDashboard.css';

const AdminDashboard = () => {
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
  
  const [quickActionData, setQuickActionData] = useState({
    wardenReports: { count: 0, pendingTasks: 0, description: 'Loading...' },
    studentAnalytics: { count: 0, newThisMonth: 0, description: 'Loading...' },
    financialOverview: { totalRevenue: 0, collectedRevenue: 0, pendingRevenue: 0, collectionRate: 0, description: 'Loading...' },
    complaintAnalysis: { totalComplaints: 0, pendingComplaints: 0, resolvedComplaints: 0, resolutionRate: 0, avgResolutionTime: 0, description: 'Loading...' }
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [hallWiseData, setHallWiseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refreshData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [overview, quickActions, performance, roomOccupancy] = await Promise.all([
        adminService.getDashboardOverview(),
        adminService.getQuickActionCounts(),
        adminService.getPerformanceMetrics(),
        adminService.getRoomOccupancy()
      ]);
      
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

      // Set quick action data
      setQuickActionData(quickActions);

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
      // Don't show alert for refresh errors
      if (!refreshing) {
        alert(error.message || 'Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchDashboardData();
  };

  const formatCurrency = (amount) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    } else {
      return `₹${amount}`;
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
        <div className="admin-dashboard">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading admin dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <div className="header-content">
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <p className="dashboard-subtitle">System Overview and Management</p>
          </div>
          <div className="header-actions">
            <button 
              className={`refresh-button ${refreshing ? 'refreshing' : ''}`}
              onClick={refreshData}
              disabled={refreshing}
            >
              {refreshing ? '🔄' : '↻'} Refresh
            </button>
          </div>
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
              <p className="metric-value">{formatCurrency(dashboardStats.totalRevenue)}</p>
              <p className="metric-label">This academic year</p>
            </div>
          </div>

          <div className="metric-card metric-info">
            <div className="metric-icon">👥</div>
            <div className="metric-content">
              <h3>Active Wardens</h3>
              <p className="metric-value">{dashboardStats.totalWardens}</p>
              <p className="metric-label">System users</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Quick Actions & Recent Activities */}
          <div className="content-columns">
            <div className="column">
              <div className="content-section">
                <div className="section-header">
                  <h3>Quick Actions</h3>
                  <span className="last-updated">
                    Last updated: {new Date().toLocaleTimeString()}
                  </span>
                </div>
                <div className="action-buttons">
                  <div 
                    className="action-card action-primary"
                    onClick={() => navigate('/admin/warden-reports')}
                  >
                    <div className="action-icon">📋</div>
                    <div className="action-content">
                      <h4>Warden Reports</h4>
                      <div className="action-stats">
                        <span className="stat-main">{quickActionData.wardenReports.count} Active</span>
                        <span className="stat-sub">{quickActionData.wardenReports.pendingTasks} Pending Tasks</span>
                      </div>
                      <p className="action-description">{quickActionData.wardenReports.description}</p>
                    </div>
                  </div>

                  <div 
                    className="action-card action-success"
                    onClick={() => navigate('/admin/student-analytics')}
                  >
                    <div className="action-icon">📊</div>
                    <div className="action-content">
                      <h4>Student Analytics</h4>
                      <div className="action-stats">
                        <span className="stat-main">{quickActionData.studentAnalytics.count} Students</span>
                        <span className="stat-sub">Analytics Available</span>
                      </div>
                      <p className="action-description">{quickActionData.studentAnalytics.description}</p>
                    </div>
                  </div>

                  <div 
                    className="action-card action-warning"
                    onClick={() => navigate('/admin/financial-reports')}
                  >
                    <div className="action-icon">💰</div>
                    <div className="action-content">
                      <h4>Financial Overview</h4>
                      <div className="action-stats">
                        <span className="stat-main">{formatCurrency(quickActionData.financialOverview.collectedRevenue)}</span>
                        <span className="stat-sub">{quickActionData.financialOverview.collectionRate.toFixed(1)}% Collection Rate</span>
                      </div>
                      <p className="action-description">{quickActionData.financialOverview.description}</p>
                    </div>
                  </div>

                  <div 
                    className="action-card action-info"
                    onClick={() => navigate('/admin/complaint-analysis')}
                  >
                    <div className="action-icon">🛠️</div>
                    <div className="action-content">
                      <h4>Complaint Analysis</h4>
                      <div className="action-stats">
                        <span className="stat-main">{quickActionData.complaintAnalysis.totalComplaints} Total</span>
                        <span className="stat-sub">{quickActionData.complaintAnalysis.resolutionRate}% Resolved</span>
                      </div>
                      <p className="action-description">Avg resolution: {quickActionData.complaintAnalysis.avgResolutionTime} days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="column">
              <div className="content-section">
                <div className="section-header">
                  <h3>Recent Activities</h3>
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={refreshData}
                  >
                    Refresh
                  </button>
                </div>
                <div className="activities-list">
                  {recentActivities.length === 0 ? (
                    <div className="no-activities">
                      <p>No recent activities</p>
                    </div>
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

          {/* Hall Performance */}
          <div className="content-section">
            <div className="section-header">
              <h3>Hall-wise Performance</h3>
              <button 
                className="btn btn-outline"
                onClick={() => navigate('/admin/hall-reports')}
              >
                View Detailed Reports
              </button>
            </div>
            <div className="hall-performance">
              {hallWiseData.length === 0 ? (
                <div className="no-data">
                  <p>No hall data available</p>
                </div>
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
                      <strong>{formatCurrency(hall.revenue)}</strong>
                    </div>
                  </div>
                </div>
              ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
