import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import './ComplaintManagement.css';

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showATRModal, setShowATRModal] = useState(false);
  const [atrData, setAtrData] = useState({
    actionTaken: '',
    actionBy: '',
    completionDate: '',
    remarks: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Mock data
    const mockComplaints = [
      {
        id: 1,
        type: 'electrical',
        title: 'Fused Tube Light',
        description: 'Tube light in room is not working',
        status: 'pending',
        priority: 'high',
        studentName: 'John Doe',
        roomNo: '101',
        createdAt: '2024-10-23',
        atr: null
      },
      {
        id: 2,
        type: 'plumbing',
        title: 'Leaking Tap',
        description: 'Water tap in bathroom is leaking',
        status: 'resolved',
        priority: 'medium',
        studentName: 'Jane Smith',
        roomNo: '205',
        createdAt: '2024-10-22',
        atr: {
          actionTaken: 'Tap replaced by plumber',
          actionBy: 'Mr. Sharma',
          completionDate: '2024-10-22',
          remarks: 'Issue completely resolved'
        }
      }
    ];
    setComplaints(mockComplaints);
  }, []);

  const filteredComplaints = complaints.filter(complaint => {
    const matchesFilter = filter === 'all' || complaint.status === filter;
    const matchesSearch = complaint.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handlePostATR = (complaint) => {
    setSelectedComplaint(complaint);
    setAtrData({
      actionTaken: '',
      actionBy: '',
      completionDate: new Date().toISOString().split('T')[0],
      remarks: ''
    });
    setShowATRModal(true);
  };

  const submitATR = () => {
    if (atrData.actionTaken.trim() && selectedComplaint) {
      const updatedComplaints = complaints.map(c => 
        c.id === selectedComplaint.id 
          ? { 
              ...c, 
              atr: { ...atrData },
              status: 'resolved'
            }
          : c
      );
      setComplaints(updatedComplaints);
      setShowATRModal(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'status-pending', text: 'Pending' },
      'in-progress': { class: 'status-progress', text: 'In Progress' },
      resolved: { class: 'status-resolved', text: 'Resolved' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { class: 'priority-low', text: 'Low' },
      medium: { class: 'priority-medium', text: 'Medium' },
      high: { class: 'priority-high', text: 'High' }
    };
    const config = priorityConfig[priority] || priorityConfig.medium;
    return <span className={`priority-badge ${config.class}`}>{config.text}</span>;
  };

  const getStats = () => {
    const total = complaints.length;
    const pending = complaints.filter(c => c.status === 'pending').length;
    const inProgress = complaints.filter(c => c.status === 'in-progress').length;
    const resolved = complaints.filter(c => c.status === 'resolved').length;
    return { total, pending, inProgress, resolved };
  };

  const stats = getStats();

  return (
    <Layout>
      <div className="complaint-management">
        <div className="page-header">
          <h1 className="page-title">Complaint Management</h1>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card card-blue">
            <h3>Total Complaints</h3>
            <p className="stat-amount">{stats.total}</p>
          </div>
          <div className="stat-card card-red">
            <h3>Pending</h3>
            <p className="stat-amount">{stats.pending}</p>
          </div>
          <div className="stat-card card-yellow">
            <h3>In Progress</h3>
            <p className="stat-amount">{stats.inProgress}</p>
          </div>
          <div className="stat-card card-green">
            <h3>Resolved</h3>
            <p className="stat-amount">{stats.resolved}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Complaints
            </button>
            <button 
              className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button 
              className={`filter-tab ${filter === 'in-progress' ? 'active' : ''}`}
              onClick={() => setFilter('in-progress')}
            >
              In Progress
            </button>
            <button 
              className={`filter-tab ${filter === 'resolved' ? 'active' : ''}`}
              onClick={() => setFilter('resolved')}
            >
              Resolved
            </button>
          </div>
        </div>

        {/* Complaints Grid */}
        <div className="complaints-grid">
          {filteredComplaints.map(complaint => (
            <div key={complaint.id} className="complaint-card">
              <div className="complaint-header">
                <h3>{complaint.title}</h3>
                <div className="complaint-badges">
                  {getPriorityBadge(complaint.priority)}
                  {getStatusBadge(complaint.status)}
                </div>
              </div>
              
              <div className="complaint-details">
                <p><strong>Student:</strong> {complaint.studentName}</p>
                <p><strong>Room:</strong> {complaint.roomNo}</p>
                <p><strong>Type:</strong> {complaint.type}</p>
                <p><strong>Description:</strong> {complaint.description}</p>
              </div>

              <div className="complaint-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => handlePostATR(complaint)}
                >
                  Post ATR
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ATR Modal */}
        {showATRModal && selectedComplaint && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Post Action Taken Report</h3>
                <button className="modal-close" onClick={() => setShowATRModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Action Taken</label>
                  <textarea
                    value={atrData.actionTaken}
                    onChange={(e) => setAtrData({...atrData, actionTaken: e.target.value})}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Action By</label>
                  <input
                    type="text"
                    value={atrData.actionBy}
                    onChange={(e) => setAtrData({...atrData, actionBy: e.target.value})}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowATRModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={submitATR}>
                  Submit ATR
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ComplaintManagement;