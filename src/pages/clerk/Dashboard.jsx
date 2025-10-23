import React from 'react'
import Layout from '../../components/common/Layout'
import './Dashboard.css'

export default function ClerkDashboard() {
  return (
    <Layout>
      <div className="dashboard-container">
        <h1 className="dashboard-title">Hall Clerk Dashboard</h1>
        
        <div className="stats-grid">
          <div className="stat-card card-blue">
            <h3>👥 Occupancy</h3>
            <p className="stat-amount">248/300</p>
            <p className="stat-subinfo">82.6% Full</p>
          </div>
          
          <div className="stat-card card-red">
            <h3>📋 Pending Tasks</h3>
            <p className="stat-amount">12</p>
            <p className="stat-urgent">3 Urgent</p>
          </div>
          
          <div className="stat-card card-green">
            <h3>💰 Revenue</h3>
            <p className="stat-amount">₹6.2L</p>
            <p className="stat-subinfo">This Month</p>
          </div>
        </div>

        <div className="action-section">
          <h3 className="action-title">Quick Actions</h3>
          <div className="action-buttons">
            <button className="btn btn-primary">Register Student</button>
            <button className="btn btn-success">Allocate Room</button>
            <button className="btn btn-purple">Collect Fees</button>
            <button className="btn btn-secondary">View Reports</button>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="info-card">
            <h3 className="info-title">Pending Complaints</h3>
            <div className="complaint-list">
              <div className="complaint-item urgent">
                <span className="status-icon">🔴</span>
                <div className="complaint-details">
                  <p className="complaint-title">Fused Light (G-102)</p>
                  <p className="complaint-meta">2 days pending • Electrical</p>
                </div>
              </div>
              <div className="complaint-item warning">
                <span className="status-icon">🟡</span>
                <div className="complaint-details">
                  <p className="complaint-title">Leaking Tap (B-205)</p>
                  <p className="complaint-meta">1 day pending • Plumbing</p>
                </div>
              </div>
              <div className="complaint-item resolved">
                <span className="status-icon">🟢</span>
                <div className="complaint-details">
                  <p className="complaint-title">Room Cleaning (A-101)</p>
                  <p className="complaint-meta">3 days pending • Housekeeping</p>
                </div>
              </div>
            </div>
          </div>

          <div className="info-card">
            <h3 className="info-title">Recent Registrations</h3>
            <div className="registration-list">
              <div className="registration-item">
                <p className="student-name">Amit Kumar</p>
                <p className="registration-meta">Room: G-102 • Oct 22, 2024</p>
              </div>
              <div className="registration-item">
                <p className="student-name">Priya Singh</p>
                <p className="registration-meta">Room: B-205 • Oct 21, 2024</p>
              </div>
              <div className="registration-item">
                <p className="student-name">Rohan Mehta</p>
                <p className="registration-meta">Room: A-101 • Oct 20, 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}