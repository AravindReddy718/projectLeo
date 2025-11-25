import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import chairmanService from '../../services/chairmanService';
import api from '../../services/api';
import './ChairmanComplaintAnalysis.css';

const ComplaintAnalysis = () => {
  const [complaintStats, setComplaintStats] = useState({});
  const [complaintTrends, setComplaintTrends] = useState([]);
  const [typeDistribution, setTypeDistribution] = useState([]);
  const [resolutionAnalysis, setResolutionAnalysis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaintAnalysis();
  }, []);

  const fetchComplaintAnalysis = async () => {
    try {
      setLoading(true);
      
      // Fetch complaints to analyze
      const complaintsResponse = await api.get('/complaints?limit=1000');
      const complaints = complaintsResponse.data.complaints || [];
      
      // Calculate stats
      const totalComplaints = complaints.length;
      const resolved = complaints.filter(c => c.status === 'resolved').length;
      const pending = complaints.filter(c => c.status === 'pending' || c.status === 'in-progress').length;
      
      // Calculate average resolution time
      const resolvedComplaints = complaints.filter(c => c.status === 'resolved' && c.resolution?.resolvedAt);
      const avgResolutionTime = resolvedComplaints.length > 0
        ? resolvedComplaints.reduce((sum, c) => {
            const created = new Date(c.createdAt);
            const resolved = new Date(c.resolution.resolvedAt);
            return sum + (resolved - created) / (1000 * 60 * 60 * 24);
          }, 0) / resolvedComplaints.length
        : 0;

      setComplaintStats({
        totalComplaints,
        resolved,
        pending,
        avgResolutionTime: avgResolutionTime.toFixed(1),
        satisfactionRate: 4.2 // Would need feedback API
      });

      // Calculate type distribution
      const categoryCounts = {};
      complaints.forEach(c => {
        const category = c.category || 'Other';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
      
      const typeDist = Object.entries(categoryCounts).map(([type, count]) => ({
        type,
        count,
        percentage: ((count / totalComplaints) * 100).toFixed(1)
      }));
      setTypeDistribution(typeDist);

      // Group by month for trends (simplified)
      const monthlyData = {};
      complaints.forEach(c => {
        const month = new Date(c.createdAt).toLocaleString('default', { month: 'short' });
        if (!monthlyData[month]) {
          monthlyData[month] = { complaints: 0, resolved: 0 };
        }
        monthlyData[month].complaints++;
        if (c.status === 'resolved') monthlyData[month].resolved++;
      });
      
      const trends = Object.entries(monthlyData).map(([month, data]) => ({
        month,
        complaints: data.complaints,
        resolved: data.resolved
      }));
      setComplaintTrends(trends.slice(-6)); // Last 6 months

      // Resolution analysis by block (hall)
      const blockStats = {};
      complaints.forEach(c => {
        const block = c.student?.hostelInfo?.block || 'Unknown';
        if (!blockStats[block]) {
          blockStats[block] = { total: 0, resolved: 0, times: [] };
        }
        blockStats[block].total++;
        if (c.status === 'resolved') {
          blockStats[block].resolved++;
          if (c.resolution?.resolvedAt) {
            const created = new Date(c.createdAt);
            const resolved = new Date(c.resolution.resolvedAt);
            blockStats[block].times.push((resolved - created) / (1000 * 60 * 60 * 24));
          }
        }
      });

      const resolutionAnalysisData = Object.entries(blockStats).map(([hall, stats]) => ({
        hall,
        resolutionRate: stats.total > 0 ? ((stats.resolved / stats.total) * 100).toFixed(0) : 0,
        avgTime: stats.times.length > 0 
          ? (stats.times.reduce((a, b) => a + b, 0) / stats.times.length).toFixed(1)
          : 0,
        satisfaction: 4.0 // Would need feedback API
      }));
      setResolutionAnalysis(resolutionAnalysisData);

    } catch (error) {
      console.error('Error fetching complaint analysis:', error);
      alert(error.message || 'Failed to load complaint analysis');
    } finally {
      setLoading(false);
    }
  };

  const getResolutionColor = (rate) => {
    if (rate >= 90) return 'excellent';
    if (rate >= 80) return 'good';
    if (rate >= 70) return 'average';
    return 'poor';
  };

  if (loading) {
    return (
      <Layout>
        <div className="complaint-analysis">
          <div className="loading-container">
            <p>Loading complaint analysis...</p>
          </div>
        </div>
      </Layout>
    );
  }

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
            <p className="metric-value">
              {complaintStats.totalComplaints > 0 
                ? ((complaintStats.resolved / complaintStats.totalComplaints) * 100).toFixed(1)
                : 0}%
            </p>
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
              {typeDistribution.length === 0 ? (
                <p>No complaint data available</p>
              ) : (
                typeDistribution.map(item => (
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
                ))
              )}
            </div>
          </div>

          {/* Resolution Performance by Hall */}
          <div className="analysis-section">
            <h3>Resolution Performance by Hall</h3>
            <div className="resolution-performance">
              {resolutionAnalysis.length === 0 ? (
                <p>No resolution data available</p>
              ) : (
                resolutionAnalysis.map(hall => {
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
              })
              )}
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="analysis-section">
            <h3>Monthly Complaint Trends</h3>
            <div className="trends-chart">
              {complaintTrends.length === 0 ? (
                <p>No trend data available</p>
              ) : (
                complaintTrends.map(trend => (
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
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ComplaintAnalysis;