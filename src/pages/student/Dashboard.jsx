import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import './Dashboard.css';

export default function StudentDashboard() {
  const [studentData, setStudentData] = useState(null);
  const [stats, setStats] = useState({
    totalDue: 0,
    activeComplaints: 0,
    pendingPayments: 0
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    setStudentData({
      name: "Amit Kumar",
      rollNumber: "2024CS10001",
      contactNumber: "9876543210",
      hall: "Hall 5",
      roomNo: "G-102",
      warden: "Dr. Priya Sharma"
    });

    setStats({
      totalDue: 2850,
      activeComplaints: 2,
      pendingPayments: 1
    });
  }, []);

  if (!studentData) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="dashboard-container">
        <h1 className="dashboard-title">Student Dashboard</h1>
        
        <div className="stats-grid">
          <div className="stat-card card-blue">
            <h3>💰 Total Due</h3>
            <p className="stat-amount">₹{stats.totalDue}</p>
            <p className="stat-due">Due in 5 days</p>
          </div>
          
          <div className="stat-card card-green">
            <h3>🏠 Room Details</h3>
            <p className="stat-info">{studentData.roomNo}, {studentData.hall}</p>
            <p className="stat-subinfo">Warden: {studentData.warden}</p>
          </div>
          
          <div className="stat-card card-purple">
            <h3>📋 Active Complaints</h3>
            <p className="stat-amount">{stats.activeComplaints}</p>
            <p className="stat-subinfo">{stats.pendingPayments} pending resolution</p>
          </div>
        </div>

        <div className="action-section">
          <h3 className="action-title">Quick Actions</h3>
          <div className="action-buttons">
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/student/payments')}
            >
              Pay Dues
            </button>
            <button 
              className="btn btn-success" 
              onClick={() => navigate('/student/complaints')}
            >
              Raise Complaint
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => navigate('/student/profile')}
            >
              View Profile
            </button>
            <button 
              className="btn btn-purple" 
              onClick={() => navigate('/student/room-allotment')}
            >
              Allotment Letter
            </button>
          </div>
        </div>

        <div className="info-card">
          <h3 className="info-title">Due Breakdown</h3>
          <div className="due-breakdown">
            <div className="due-item">
              <span>Mess Charges:</span>
              <span>₹1,800</span>
            </div>
            <div className="due-item">
              <span>Room Rent:</span>
              <span>₹750</span>
            </div>
            <div className="due-item">
              <span>Amenities Fee:</span>
              <span>₹300</span>
            </div>
            <div className="due-item total">
              <span>Total Due:</span>
              <span>₹2,850</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}