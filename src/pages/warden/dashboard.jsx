import React from 'react'
import Layout from '../../components/common/Layout'
import './Dashboard.css'

export default function WardenDashboard() {
  return (
    <Layout>
      <div className="dashboard-container">
        <h1 className="dashboard-title">Warden Dashboard - Hall 5</h1>
        
        <div className="stats-grid warden-stats">
          <div className="stat-card card-blue">
            <h3>🎯 Occupancy</h3>
            <p className="stat-amount">248/300</p>
            <p className="stat-subinfo">82.6% Full</p>
          </div>
          
          <div className="stat-card card-red">
            <h3>📋 Pending ATRs</h3>
            <p className="stat-amount">12</p>
            <p className="stat-urgent">Require attention</p>
          </div>
          
          <div className="stat-card card-green">
            <h3>💰 Collection Rate</h3>
            <p className="stat-amount">92%</p>
            <p className="stat-subinfo">Revenue collected</p>
          </div>
          
          <div className="stat-card card-purple">
            <h3>😊 Satisfaction</h3>
            <p className="stat-amount">78%</p>
            <p className="stat-subinfo">Student rating</p>
          </div>
        </div>

        <div className="action-section">
          <h3 className="action-title">Management Actions</h3>
          <div className="action-buttons">
            <button className="btn btn-primary">View Complaints</button>
            <button className="btn btn-success">Financial Reports</button>
            <button className="btn btn-purple">Staff Management</button>
            <button className="btn btn-secondary">Grant Allocation</button>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="info-card">
            <h3 className="info-title">Urgent Items Requiring ATR</h3>
            <div className="atr-list">
              <div className="atr-item urgent">
                <span className="status-icon">🔴</span>
                <div className="atr-details">
                  <p className="atr-title">Electrical Issue - G Block</p>
                  <p className="atr-meta">Fused lights in corridor • 4 days pending</p>
                </div>
              </div>
              <div className="atr-item urgent">
                <span className="status-icon">🔴</span>
                <div className="atr-details">
                  <p className="atr-title">Water Leakage - 1st Floor</p>
                  <p className="atr-meta">Bathroom leakage • 2 days pending</p>
                </div>
              </div>
              <div className="atr-item warning">
                <span className="status-icon">🟡</span>
                <div className="atr-details">
                  <p className="atr-title">Common Area Cleaning</p>
                  <p className="atr-meta">Cleaning required • 1 day pending</p>
                </div>
              </div>
            </div>
          </div>

          <div className="info-card">
            <h3 className="info-title">Financial Summary</h3>
            <div className="financial-summary">
              <div className="financial-item">
                <span className="financial-label">Grants Received</span>
                <span className="financial-amount">₹15,00,000</span>
              </div>
              <div className="financial-item">
                <span className="financial-label">Expenditure</span>
                <span className="financial-amount">₹12,45,680</span>
              </div>
              <div className="financial-item total">
                <span className="financial-label">Balance</span>
                <span className="financial-amount positive">₹2,54,320</span>
              </div>
              <div className="progress-section">
                <p className="progress-label">Monthly Collection Target</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '92%' }}></div>
                </div>
                <p className="progress-text">92% collected (₹4.6L of ₹5L)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}