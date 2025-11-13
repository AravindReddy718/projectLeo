import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import './ChairmanHallReports.css';

const HallReports = () => {
  const [hallReports, setHallReports] = useState([]);
  const [selectedHall, setSelectedHall] = useState('all');
  const [timeRange, setTimeRange] = useState('quarterly');

  useEffect(() => {
    // Mock data - replace with API
    setHallReports([
      {
        id: 1,
        name: 'Hall 1',
        warden: 'Dr. Priya Sharma',
        totalStudents: 280,
        occupancy: 93.3,
        complaints: 12,
        resolutionRate: 85,  
        revenue: 245000,
        expenses: 189000,
        maintenanceScore: 4.2,
        cleanliness: 4.5,
        studentSatisfaction: 4.3
      },
      {
        id: 2,
        name: 'Hall 2',
        warden: 'Dr. Rajesh Kumar',
        totalStudents: 265,
        occupancy: 94.6,
        complaints: 8,
        resolutionRate: 92,
        revenue: 231000,
        expenses: 175000,
        maintenanceScore: 4.4,
        cleanliness: 4.6,
        studentSatisfaction: 4.6
      },
      {
        id: 3,
        name: 'Hall 3',
        warden: 'Dr. Amit Verma',
        totalStudents: 310,
        occupancy: 96.9,
        complaints: 15,
        resolutionRate: 78,
        revenue: 268000,
        expenses: 205000,
        maintenanceScore: 3.8,
        cleanliness: 4.1,
        studentSatisfaction: 4.0
      },
      {
        id: 4,
        name: 'Hall 4',
        warden: 'Dr. Sunita Patel',
        totalStudents: 295,
        occupancy: 98.3,
        complaints: 10,
        resolutionRate: 88,
        revenue: 252000,
        expenses: 192000,
        maintenanceScore: 4.3,
        cleanliness: 4.4,
        studentSatisfaction: 4.4
      },
      {
        id: 5,
        name: 'Hall 5',
        warden: 'Dr. Ravi Nair',
        totalStudents: 275,
        occupancy: 94.8,
        complaints: 7,
        resolutionRate: 95,
        revenue: 238000,
        expenses: 181000,
        maintenanceScore: 4.7,
        cleanliness: 4.8,
        studentSatisfaction: 4.7
      }
    ]);
  }, []);

  const getOverallScore = (hall) => {
    const scores = [
      hall.resolutionRate / 20, // Convert percentage to 5-point scale
      hall.maintenanceScore,
      hall.cleanliness,
      hall.studentSatisfaction
    ];
    return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  };

  const getPerformanceColor = (score) => {
    if (score >= 4.5) return 'excellent';
    if (score >= 4.0) return 'good';
    if (score >= 3.5) return 'average';
    return 'poor';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Layout>
      <div className="hall-reports">
        <div className="reports-header">
          <h1>Hall-wise Performance Reports</h1>
          <div className="report-controls">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-selector"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        {/* Overall Summary */}
        <div className="overall-summary">
          <div className="summary-card">
            <h3>Average Occupancy</h3>
            <p className="summary-value">
              {((hallReports.reduce((sum, hall) => sum + hall.occupancy, 0) / hallReports.length) || 0).toFixed(1)}%
            </p>
          </div>
          <div className="summary-card">
            <h3>Average Resolution Rate</h3>
            <p className="summary-value">
              {((hallReports.reduce((sum, hall) => sum + hall.resolutionRate, 0) / hallReports.length) || 0).toFixed(1)}%
            </p>
          </div>
          <div className="summary-card">
            <h3>Total Revenue</h3>
            <p className="summary-value">
              {formatCurrency(hallReports.reduce((sum, hall) => sum + hall.revenue, 0))}
            </p>
          </div>
          <div className="summary-card">
            <h3>Average Satisfaction</h3>
            <p className="summary-value">
              ⭐ {(hallReports.reduce((sum, hall) => sum + hall.studentSatisfaction, 0) / hallReports.length || 0).toFixed(1)}
            </p>
          </div>
        </div>

        {/* Hall Reports Grid */}
        <div className="hall-reports-grid">
          {hallReports.map(hall => {
            const overallScore = getOverallScore(hall);
            const performance = getPerformanceColor(overallScore);
            
            return (
              <div key={hall.id} className="hall-report-card">
                <div className="hall-card-header">
                  <div className="hall-info">
                    <h3>{hall.name}</h3>
                    <p className="warden-name">Warden: {hall.warden}</p>
                  </div>
                  <div className={`overall-score ${performance}`}>
                    <span className="score">{overallScore}</span>
                    <span className="label">Overall</span>
                  </div>
                </div>

                <div className="hall-stats">
                  <div className="stat-row">
                    <div className="stat">
                      <label>Students</label>
                      <span>{hall.totalStudents}</span>
                    </div>
                    <div className="stat">
                      <label>Occupancy</label>
                      <span>{hall.occupancy}%</span>
                    </div>
                  </div>
                  <div className="stat-row">
                    <div className="stat">
                      <label>Complaints</label>
                      <span>{hall.complaints}</span>
                    </div>
                    <div className="stat">
                      <label>Resolution</label>
                      <span className={`resolution ${getPerformanceColor(hall.resolutionRate/20)}`}>
                        {hall.resolutionRate}%
                      </span>
                    </div>
                  </div>
                  <div className="stat-row">
                    <div className="stat">
                      <label>Revenue</label>
                      <span>{formatCurrency(hall.revenue)}</span>
                    </div>
                    <div className="stat">
                      <label>Profit</label>
                      <span className="profit">
                        {formatCurrency(hall.revenue - hall.expenses)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="hall-ratings">
                  <div className="rating-item">
                    <span>Maintenance</span>
                    <div className="stars">
                      {'⭐'.repeat(Math.floor(hall.maintenanceScore))}
                      <span className="rating-value">{hall.maintenanceScore}</span>
                    </div>
                  </div>
                  <div className="rating-item">
                    <span>Cleanliness</span>
                    <div className="stars">
                      {'⭐'.repeat(Math.floor(hall.cleanliness))}
                      <span className="rating-value">{hall.cleanliness}</span>
                    </div>
                  </div>
                  <div className="rating-item">
                    <span>Satisfaction</span>
                    <div className="stars">
                      {'⭐'.repeat(Math.floor(hall.studentSatisfaction))}
                      <span className="rating-value">{hall.studentSatisfaction}</span>
                    </div>
                  </div>
                </div>

                <div className="hall-actions">
                  <button className="btn btn-outline btn-sm">
                    View Detailed Report
                  </button>
                  <button className="btn btn-primary btn-sm">
                    Compare with Others
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default HallReports;