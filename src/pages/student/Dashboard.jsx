import React from 'react'
import Layout from '../../components/common/Layout'
import './Dashboard.css'  // We'll create this

export default function StudentDashboard() {
  return (
    <Layout>
      <div className="dashboard-container">
        <h1 className="dashboard-title">Student Dashboard</h1>
        
        <div className="stats-grid">
          <div className="stat-card card-blue">
            <h3>💰 Current Due</h3>
            <p className="stat-amount">₹2,850</p>
            <p className="stat-due">Due in 5 days</p>
          </div>
          
          <div className="stat-card card-green">
            <h3>🏠 Room Details</h3>
            <p className="stat-info">G-102, Hall 5</p>
            <p className="stat-subinfo">Single Occupancy</p>
          </div>
          
          <div className="stat-card card-purple">
            <h3>📋 Complaints</h3>
            <p className="stat-amount">2</p>
            <p className="stat-subinfo">1 Resolved • 1 Pending</p>
          </div>
        </div>

        <div className="action-section">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button className="btn btn-primary">Pay Dues</button>
            <button className="btn btn-success">Raise Complaint</button>
            <button className="btn btn-secondary">View Profile</button>
          </div>
        </div>
      </div>
    </Layout>
  )
}