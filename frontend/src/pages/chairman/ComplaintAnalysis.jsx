import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import './ChairmanComplaintAnalysis.css';

const ComplaintAnalysis = () => {
  const [complaintStats, setComplaintStats] = useState({});
  const [complaintTrends, setComplaintTrends] = useState([]);
  const [typeDistribution, setTypeDistribution] = useState([]);
  const [resolutionAnalysis, setResolutionAnalysis] = useState([]);

  useEffect(() => {
    // Mock data - replace with API
    setComplaintStats({
      totalComplaints: 156,
      resolved: 128,
      pending: 28,
      avgResolutionTime: 2.3,
      satisfactionRate: 4.2
    });

    setComplaintTrends([
      { month: 'Jan', complaints: 45, resolved: 38 },
      { month: 'Feb', complaints: 38, resolved: 32 },
      { month: 'Mar', complaints: 42, resolved: 36 },
      { month: 'Apr', complaints: 31, resolved: 28 }
    ]);

    setTypeDistribution([
      { type: 'Electrical', count: 45, percentage: 28.8 },
      { type: 'Plumbing', count: 38, percentage: 24.4 },
      { type: 'Housekeeping', count: 28, percentage: 17.9 },
      { type: 'Furniture', count: 22, percentage: 14.1 },
      { type: 'Internet', count: 15, percentage: 9.6 },
      { type: 'Other', count: 8, percentage: 5.1 }
    ]);

    setResolutionAnalysis([
      { hall: 'Hall 1', resolutionRate: 85, avgTime: 2.1, satisfaction: 4.3 },
      { hall: 'Hall 2', resolutionRate: 92, avgTime: 1.8, satisfaction: 4.6 },
      { hall: 'Hall 3', resolutionRate: 78, avgTime: 2.8, satisfaction: 4.0 },
      { hall: 'Hall 4', resolutionRate: 88, avgTime: 2.2, satisfaction: 4.4 },
      { hall: 'Hall 5', resolutionRate: 95, avgTime: 1.5, satisfaction: 4.7 }
    ]);
  }, []);

  const getResolutionColor = (rate) => {
    if (rate >= 90) return 'excellent';
    if (rate >= 80) return 'good';
    if (rate >= 70) return 'average';
    return 'poor';
  };

  return (
    <Layout>
      <div className="complaint-analysis">
        <div className="analysis-header">
          <h1>Complaint Analysis & Trends</h1>
          <p>Comprehensive analysis of complaint patterns and resolution performance</p>
        </div>

        {/* Key Metrics */}
        <div className="complaint-metrics">
          <div className="metric-card">
            <h3>Total Complaints</h3>
            <p className="metric-value">{complaintStats.totalComplaints}</p>
            <p className="metric-label">This quarter</p>
          </div>
          <div className="metric-card">
            <h3>Resolution Rate</h3>
            <p className="metric-value">{((complaintStats.resolved / complaintStats.totalComplaints) * 100).toFixed(1)}%</p>
            <p className="metric-label">Overall efficiency</p>
          </div>
          <div className="metric-card">
            <h3>Avg. Resolution Time</h3>
            <p className="metric-value">{complaintStats.avgResolutionTime} days</p>
            <p className="metric-label">From submission to resolution</p>
          </div>
          <div className="metric-card">
            <h3>Satisfaction Rate</h3>
            <p className="metric-value">⭐ {complaintStats.satisfactionRate}/5</p>
            <p className="metric-label">Student feedback</p>
          </div>
        </div>

        <div className="analysis-content">
          {/* Complaint Type Distribution */}
          <div className="analysis-section">
            <h3>Complaint Type Distribution</h3>
            <div className="type-distribution">
              {typeDistribution.map(item => (
                <div key={item.type} className="type-item">
                  <div className="type-header">
                    <span className="type-name">{item.type}</span>
                    <span className="type-count">{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resolution Performance by Hall */}
          <div className="analysis-section">
            <h3>Resolution Performance by Hall</h3>
            <div className="resolution-performance">
              {resolutionAnalysis.map(hall => {
                const performance = getResolutionColor(hall.resolutionRate);
                return (
                  <div key={hall.hall} className="hall-performance-card">
                    <div className="hall-header">
                      <h4>{hall.hall}</h4>
                      <span className={`performance-badge ${performance}`}>
                        {hall.resolutionRate}%
                      </span>
                    </div>
                    <div className="performance-stats">
                      <div className="performance-stat">
                        <span>Avg. Resolution Time</span>
                        <strong>{hall.avgTime} days</strong>
                      </div>
                      <div className="performance-stat">
                        <span>Satisfaction</span>
                        <strong>⭐ {hall.satisfaction}/5</strong>
                      </div>
                    </div>
                    <div className="performance-bar">
                      <div 
                        className={`performance-fill ${performance}`}
                        style={{ width: `${hall.resolutionRate}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="analysis-section">
            <h3>Monthly Complaint Trends</h3>
            <div className="trends-chart">
              {complaintTrends.map(trend => (
                <div key={trend.month} className="trend-item">
                  <div className="trend-header">
                    <span className="month">{trend.month}</span>
                    <span className="total">Total: {trend.complaints}</span>
                  </div>
                  <div className="trend-bars">
                    <div className="bar-group">
                      <div className="bar-label">Received</div>
                      <div className="bar received" style={{ height: `${(trend.complaints / 50) * 100}%` }}></div>
                      <span className="bar-value">{trend.complaints}</span>
                    </div>
                    <div className="bar-group">
                      <div className="bar-label">Resolved</div>
                      <div className="bar resolved" style={{ height: `${(trend.resolved / 50) * 100}%` }}></div>
                      <span className="bar-value">{trend.resolved}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ComplaintAnalysis;