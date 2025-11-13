import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import './ChairmanAnalytics.css';

const StudentAnalytics = () => {
  const [analytics, setAnalytics] = useState({});
  const [departmentData, setDepartmentData] = useState([]);
  const [yearWiseData, setYearWiseData] = useState([]);

  useEffect(() => {
    // Mock data - replace with API
    setAnalytics({
      totalStudents: 3247,
      newAdmissions: 856,
      graduatingStudents: 789,
      internationalStudents: 145,
      averageStay: 3.8
    });

    setDepartmentData([
      { department: 'Computer Science', students: 645, percentage: 19.9 },
      { department: 'Electrical', students: 523, percentage: 16.1 },
      { department: 'Mechanical', students: 487, percentage: 15.0 },
      { department: 'Civil', students: 412, percentage: 12.7 },
      { department: 'Chemical', students: 389, percentage: 12.0 },
      { department: 'Others', students: 791, percentage: 24.3 }
    ]);

    setYearWiseData([
      { year: '1st Year', students: 856, percentage: 26.4 },
      { year: '2nd Year', students: 789, percentage: 24.3 },
      { year: '3rd Year', students: 812, percentage: 25.0 },
      { year: '4th Year', students: 790, percentage: 24.3 }
    ]);
  }, []);

  return (
    <Layout>
      <div className="student-analytics">
        <div className="analytics-header">
          <h1>Student Population Analytics</h1>
          <p>Comprehensive overview of student demographics and distribution</p>
        </div>

        {/* Key Metrics */}
        <div className="analytics-metrics">
          <div className="metric-card">
            <h3>Total Students</h3>
            <p className="metric-value">{analytics.totalStudents}</p>
            <p className="metric-change">+5.2% from last year</p>
          </div>
          <div className="metric-card">
            <h3>New Admissions</h3>
            <p className="metric-value">{analytics.newAdmissions}</p>
            <p className="metric-change">Current academic year</p>
          </div>
          <div className="metric-card">
            <h3>International Students</h3>
            <p className="metric-value">{analytics.internationalStudents}</p>
            <p className="metric-change">4.5% of total</p>
          </div>
          <div className="metric-card">
            <h3>Avg. Stay Duration</h3>
            <p className="metric-value">{analytics.averageStay} years</p>
            <p className="metric-change">Per student</p>
          </div>
        </div>

        <div className="analytics-content">
          {/* Department-wise Distribution */}
          <div className="analytics-section">
            <h3>Department-wise Distribution</h3>
            <div className="distribution-chart">
              {departmentData.map(dept => (
                <div key={dept.department} className="distribution-item">
                  <div className="dept-info">
                    <span className="dept-name">{dept.department}</span>
                    <span className="dept-stats">
                      {dept.students} students ({dept.percentage}%)
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${dept.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Year-wise Distribution */}
          <div className="analytics-section">
            <h3>Year-wise Distribution</h3>
            <div className="year-distribution">
              {yearWiseData.map(year => (
                <div key={year.year} className="year-card">
                  <h4>{year.year}</h4>
                  <p className="year-count">{year.students}</p>
                  <p className="year-percentage">{year.percentage}%</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hall Occupancy */}
          <div className="analytics-section">
            <h3>Hall Occupancy Rates</h3>
            <div className="occupancy-grid">
              {[
                { hall: 'Hall 1', capacity: 300, occupied: 280, rate: 93.3 },
                { hall: 'Hall 2', capacity: 280, occupied: 265, rate: 94.6 },
                { hall: 'Hall 3', capacity: 320, occupied: 310, rate: 96.9 },
                { hall: 'Hall 4', capacity: 300, occupied: 295, rate: 98.3 },
                { hall: 'Hall 5', capacity: 290, occupied: 275, rate: 94.8 }
              ].map(hall => (
                <div key={hall.hall} className="occupancy-card">
                  <h4>{hall.hall}</h4>
                  <div className="occupancy-stats">
                    <span>{hall.occupied}/{hall.capacity}</span>
                    <span className={`occupancy-rate ${hall.rate > 95 ? 'high' : 'normal'}`}>
                      {hall.rate}%
                    </span>
                  </div>
                  <div className="capacity-bar">
                    <div 
                      className="capacity-fill"
                      style={{ width: `${hall.rate}%` }}
                    ></div>
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

export default StudentAnalytics;