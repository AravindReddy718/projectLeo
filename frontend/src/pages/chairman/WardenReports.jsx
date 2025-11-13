import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import './ChairmanReports.css';

const WardenReports = () => {
  const [wardenReports, setWardenReports] = useState([]);
  const [selectedWarden, setSelectedWarden] = useState(null);
  const [timeRange, setTimeRange] = useState('monthly');

  useEffect(() => {
    // Mock data - replace with API
    setWardenReports([
      {
        id: 1,
        name: 'Dr. Priya Sharma',
        hall: 'Hall 5',
        contact: 'priya.sharma@iit.ac.in',
        performance: 92,
        totalComplaints: 45,
        resolvedComplaints: 42,
        pendingComplaints: 3,
        avgResolutionTime: 1.8,
        studentSatisfaction: 4.5,
        lastReport: '2024-01-15'
      },
      {
        id: 2,
        name: 'Dr. Rajesh Kumar',
        hall: 'Hall 3',
        contact: 'rajesh.kumar@iit.ac.in',
        performance: 85,
        totalComplaints: 38,
        resolvedComplaints: 32,
        pendingComplaints: 6,
        avgResolutionTime: 2.5,
        studentSatisfaction: 4.2,
        lastReport: '2024-01-14'
      }
    ]);
  }, []);

  const getPerformanceStatus = (score) => {
    if (score >= 90) return { class: 'excellent', label: 'Excellent' };
    if (score >= 80) return { class: 'good', label: 'Good' };
    if (score >= 70) return { class: 'average', label: 'Average' };
    return { class: 'poor', label: 'Needs Improvement' };
  };

  return (
    <Layout>
      <div className="chairman-reports">
        <div className="reports-header">
          <h1>Warden Performance Reports</h1>
          <div className="report-controls">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-selector"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
        </div>

        <div className="reports-grid">
          {wardenReports.map(warden => {
            const performance = getPerformanceStatus(warden.performance);
            return (
              <div key={warden.id} className="warden-report-card">
                <div className="report-header">
                  <div className="warden-info">
                    <h3>{warden.name}</h3>
                    <p className="warden-hall">{warden.hall}</p>
                    <p className="warden-contact">{warden.contact}</p>
                  </div>
                  <div className={`performance-score ${performance.class}`}>
                    <span className="score">{warden.performance}%</span>
                    <span className="label">{performance.label}</span>
                  </div>
                </div>

                <div className="report-stats">
                  <div className="stat-row">
                    <div className="stat">
                      <label>Total Complaints</label>
                      <span className="value">{warden.totalComplaints}</span>
                    </div>
                    <div className="stat">
                      <label>Resolved</label>
                      <span className="value success">{warden.resolvedComplaints}</span>
                    </div>
                  </div>
                  <div className="stat-row">
                    <div className="stat">
                      <label>Pending</label>
                      <span className="value warning">{warden.pendingComplaints}</span>
                    </div>
                    <div className="stat">
                      <label>Avg. Resolution</label>
                      <span className="value">{warden.avgResolutionTime} days</span>
                    </div>
                  </div>
                  <div className="stat-row">
                    <div className="stat">
                      <label>Satisfaction</label>
                      <span className="value rating">⭐ {warden.studentSatisfaction}/5</span>
                    </div>
                  </div>
                </div>

                <div className="report-actions">
                  <button className="btn btn-outline btn-sm">
                    View Detailed Report
                  </button>
                  <button className="btn btn-primary btn-sm">
                    Download PDF
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Statistics */}
        <div className="summary-section">
          <h3>Overall Performance Summary</h3>
          <div className="summary-cards">
            <div className="summary-card">
              <h4>Average Resolution Rate</h4>
              <p className="summary-value">
                {((wardenReports.reduce((sum, w) => sum + w.performance, 0) / wardenReports.length) || 0).toFixed(1)}%
              </p>
            </div>
            <div className="summary-card">
              <h4>Total Complaints Handled</h4>
              <p className="summary-value">
                {wardenReports.reduce((sum, w) => sum + w.totalComplaints, 0)}
              </p>
            </div>
            <div className="summary-card">
              <h4>Average Satisfaction</h4>
              <p className="summary-value">
                ⭐ {(wardenReports.reduce((sum, w) => sum + w.studentSatisfaction, 0) / wardenReports.length || 0).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WardenReports;