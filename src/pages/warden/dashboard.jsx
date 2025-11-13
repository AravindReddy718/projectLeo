import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import './Dashboard.css';

const WardenDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    pendingComplaints: 0,
    totalExpenses: 0,
    activeStaff: 0,
    occupiedRooms: 0,
    availableRooms: 0
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    setDashboardStats({
      totalStudents: 245,
      pendingComplaints: 12,
      totalExpenses: 15420,
      activeStaff: 8,
      occupiedRooms: 180,
      availableRooms: 45
    });
  }, []);

  return (
    <Layout>
      <div className="dashboard-container">
        <h1 className="dashboard-title">Warden Dashboard</h1>
        
        <div className="stats-grid">
          <div className="stat-card card-blue">
            <h3>👨‍🎓 Total Students</h3>
            <p className="stat-amount">{dashboardStats.totalStudents}</p>
          </div>
          
          <div className="stat-card card-red">
            <h3>⚠️ Pending Complaints</h3>
            <p className="stat-amount">{dashboardStats.pendingComplaints}</p>
          </div>
          
          <div className="stat-card card-green">
            <h3>💰 Monthly Expenses</h3>
            <p className="stat-amount">₹{dashboardStats.totalExpenses.toLocaleString()}</p>
          </div>
          
          <div className="stat-card card-purple">
            <h3>👥 Active Staff</h3>
            <p className="stat-amount">{dashboardStats.activeStaff}</p>
          </div>

          <div className="stat-card card-orange">
            <h3>🏠 Occupied Rooms</h3>
            <p className="stat-amount">{dashboardStats.occupiedRooms}</p>
          </div>

          <div className="stat-card card-teal">
            <h3>🟢 Available Rooms</h3>
            <p className="stat-amount">{dashboardStats.availableRooms}</p>
          </div>
        </div>

        <div className="action-section">
          <h3 className="action-title">Quick Actions</h3>
          <div className="action-buttons">
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/warden/complaints')}
            >
              Manage Complaints
            </button>
            <button 
              className="btn btn-success" 
              onClick={() => navigate('/warden/students')}
            >
              Student Management
            </button>
            <button 
              className="btn btn-purple" 
              onClick={() => navigate('/warden/room-allocation')}
            >
              Room Allocation
            </button>
            
          </div>
        </div>

        <div className="recent-activities">
          <h3 className="info-title">Recent Activities</h3>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-badge new">New</span>
              <span>New complaint #CMP-0012 submitted by Student A</span>
              <span className="activity-time">2 hours ago</span>
            </div>
            <div className="activity-item">
              <span className="activity-badge room">Room</span>
              <span>Student John Doe allocated to Room 205</span>
              <span className="activity-time">3 hours ago</span>
            </div>
            <div className="activity-item">
              <span className="activity-badge resolved">Resolved</span>
              <span>Complaint #CMP-0011 marked as resolved</span>
              <span className="activity-time">5 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WardenDashboard;