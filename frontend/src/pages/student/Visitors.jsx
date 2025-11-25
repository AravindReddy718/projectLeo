import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Visitors.css';

export default function Visitors() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('log');
  const [visitors, setVisitors] = useState([
    {
      id: 1,
      visitorName: 'Rajesh Kumar',
      relationship: 'Father',
      visitDate: '2024-11-12',
      visitTime: '14:30',
      purpose: 'Family visit',
      status: 'completed',
      checkIn: '14:30',
      checkOut: '17:15'
    },
    {
      id: 2,
      visitorName: 'Priya Sharma',
      relationship: 'Sister',
      visitDate: '2024-11-10',
      visitTime: '11:00',
      purpose: 'Personal visit',
      status: 'completed',
      checkIn: '11:00',
      checkOut: '13:45'
    },
    {
      id: 3,
      visitorName: 'Dr. Anil Verma',
      relationship: 'Family Doctor',
      visitDate: '2024-11-08',
      visitTime: '16:00',
      purpose: 'Medical consultation',
      status: 'completed',
      checkIn: '16:00',
      checkOut: '16:30'
    }
  ]);

  const [newVisitor, setNewVisitor] = useState({
    visitorName: '',
    relationship: '',
    visitDate: '',
    visitTime: '',
    purpose: '',
    contactNumber: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVisitor(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const visitor = {
      id: visitors.length + 1,
      ...newVisitor,
      status: 'pending',
      checkIn: null,
      checkOut: null
    };
    setVisitors(prev => [visitor, ...prev]);
    setNewVisitor({
      visitorName: '',
      relationship: '',
      visitDate: '',
      visitTime: '',
      purpose: '',
      contactNumber: ''
    });
    alert('Visitor request submitted successfully!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="visitors-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/student/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>Visitor Management</h1>
      </div>

      <div className="visitors-container">
        <div className="tab-navigation">
          <button 
            className={activeTab === 'log' ? 'active' : ''}
            onClick={() => setActiveTab('log')}
          >
            Visitor Log
          </button>
          <button 
            className={activeTab === 'request' ? 'active' : ''}
            onClick={() => setActiveTab('request')}
          >
            Request Visit
          </button>
        </div>

        {activeTab === 'log' && (
          <div className="visitor-log">
            <div className="log-header">
              <h2>Your Visitor History</h2>
              <p>Track all your visitor requests and their status</p>
            </div>

            <div className="visitors-list">
              {visitors.length > 0 ? (
                visitors.map(visitor => (
                  <div key={visitor.id} className="visitor-card">
                    <div className="visitor-info">
                      <div className="visitor-main">
                        <h3 className="visitor-name">{visitor.visitorName}</h3>
                        <p className="visitor-relationship">{visitor.relationship}</p>
                      </div>
                      
                      <div className="visit-details">
                        <div className="detail-item">
                          <span className="label">Date:</span>
                          <span className="value">{formatDate(visitor.visitDate)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Time:</span>
                          <span className="value">{visitor.visitTime}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Purpose:</span>
                          <span className="value">{visitor.purpose}</span>
                        </div>
                        {visitor.checkIn && (
                          <div className="detail-item">
                            <span className="label">Duration:</span>
                            <span className="value">{visitor.checkIn} - {visitor.checkOut}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="visitor-status">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(visitor.status) }}
                      >
                        {visitor.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-visitors">
                  <p>No visitor records found.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'request' && (
          <div className="visitor-request">
            <div className="request-header">
              <h2>Request Visitor Permission</h2>
              <p>Fill out the form below to request permission for a visitor</p>
            </div>

            <form onSubmit={handleSubmit} className="visitor-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="visitorName">Visitor Name *</label>
                  <input
                    type="text"
                    id="visitorName"
                    name="visitorName"
                    value={newVisitor.visitorName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter visitor's full name"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="relationship">Relationship *</label>
                  <select
                    id="relationship"
                    name="relationship"
                    value={newVisitor.relationship}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select relationship</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Uncle">Uncle</option>
                    <option value="Aunt">Aunt</option>
                    <option value="Friend">Friend</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="visitDate">Visit Date *</label>
                  <input
                    type="date"
                    id="visitDate"
                    name="visitDate"
                    value={newVisitor.visitDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="visitTime">Visit Time *</label>
                  <input
                    type="time"
                    id="visitTime"
                    name="visitTime"
                    value={newVisitor.visitTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contactNumber">Contact Number</label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={newVisitor.contactNumber}
                  onChange={handleInputChange}
                  placeholder="Visitor's contact number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="purpose">Purpose of Visit *</label>
                <textarea
                  id="purpose"
                  name="purpose"
                  value={newVisitor.purpose}
                  onChange={handleInputChange}
                  required
                  placeholder="Briefly describe the purpose of visit"
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-button">
                  Submit Request
                </button>
              </div>
            </form>

            <div className="visitor-guidelines">
              <h3>Visitor Guidelines</h3>
              <ul>
                <li>All visitor requests must be submitted at least 24 hours in advance</li>
                <li>Visitors must carry valid ID proof for verification</li>
                <li>Visiting hours: 10:00 AM to 6:00 PM on weekdays, 9:00 AM to 7:00 PM on weekends</li>
                <li>Maximum 2 visitors allowed at a time</li>
                <li>Students are responsible for their visitors' conduct</li>
                <li>Visitors must register at the security desk upon arrival</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
