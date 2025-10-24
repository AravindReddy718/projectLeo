import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    // Mock data - replace with actual API call
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
      },
      {
        id: 3,
        type: 'furniture',
        title: 'Broken Chair',
        description: 'Study chair in room is broken and needs replacement',
        status: 'in-progress',
        priority: 'medium',
        studentName: 'Mike Johnson',
        roomNo: '156',
        createdAt: '2024-10-21',
        atr: null
      },
      {
        id: 4,
        type: 'internet',
        title: 'WiFi Not Working',
        description: 'No internet connectivity in room for 2 days',
        status: 'pending',
        priority: 'high',
        studentName: 'Sarah Wilson',
        roomNo: '302',
        createdAt: '2024-10-23',
        atr: null
      }
    ];
    setComplaints(mockComplaints);
  }, []);

  const filteredComplaints = complaints.filter(complaint => {
    const matchesFilter = filter === 'all' || complaint.status === filter;
    const matchesSearch = complaint.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.roomNo.toLowerCase().includes(searchTerm.toLowerCase());
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
      setAtrData({
        actionTaken: '',
        actionBy: '',
        completionDate: '',
        remarks: ''
      });
      setSelectedComplaint(null);
    }
  };

  const updateComplaintStatus = (complaintId, newStatus) => {
    const updatedComplaints = complaints.map(c =>
      c.id === complaintId ? { ...c, status: newStatus } : c
    );
    setComplaints(updatedComplaints);
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

  const getTypeIcon = (type) => {
    const icons = {
      electrical: '⚡',
      plumbing: '💧',
      furniture: '🪑',
      housekeeping: '🧹',
      internet: '📶',
      other: '❓'
    };
    return icons[type] || icons.other;
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
    <div className="complaint-management">
      <div className="complaint-header">
        <h2>Complaint Management</h2>
        <div className="header-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          <button className="btn-primary">
            Export Report
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">📋</div>
          <div className="stat-info">
            <h3>Total Complaints</h3>
            <p className="stat-number">{stats.total}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pending">⏳</div>
          <div className="stat-info">
            <h3>Pending</h3>
            <p className="stat-number">{stats.pending}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon progress">🔄</div>
          <div className="stat-info">
            <h3>In Progress</h3>
            <p className="stat-number">{stats.inProgress}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon resolved">✅</div>
          <div className="stat-info">
            <h3>Resolved</h3>
            <p className="stat-number">{stats.resolved}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
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
          Pending ({stats.pending})
        </button>
        <button 
          className={`filter-tab ${filter === 'in-progress' ? 'active' : ''}`}
          onClick={() => setFilter('in-progress')}
        >
          In Progress ({stats.inProgress})
        </button>
        <button 
          className={`filter-tab ${filter === 'resolved' ? 'active' : ''}`}
          onClick={() => setFilter('resolved')}
        >
          Resolved ({stats.resolved})
        </button>
      </div>

      {/* Complaints Grid */}
      <div className="complaints-grid">
        {filteredComplaints.map(complaint => (
          <div key={complaint.id} className="complaint-card">
            <div className="complaint-card-header">
              <div className="complaint-type">
                <span className="type-icon">{getTypeIcon(complaint.type)}</span>
                <span className="type-text">{complaint.type}</span>
              </div>
              <div className="complaint-badges">
                {getPriorityBadge(complaint.priority)}
                {getStatusBadge(complaint.status)}
              </div>
            </div>
            
            <div className="complaint-title">
              <h3>{complaint.title}</h3>
            </div>

            <div className="complaint-details">
              <div className="detail-row">
                <span className="label">Student:</span>
                <span className="value">{complaint.studentName}</span>
              </div>
              <div className="detail-row">
                <span className="label">Room No:</span>
                <span className="value">{complaint.roomNo}</span>
              </div>
              <div className="detail-row">
                <span className="label">Date:</span>
                <span className="value">{complaint.createdAt}</span>
              </div>
            </div>

            <div className="complaint-description">
              <p>{complaint.description}</p>
            </div>

            {complaint.atr && (
              <div className="atr-section">
                <h4>Action Taken Report</h4>
                <div className="atr-details">
                  <p><strong>Action Taken:</strong> {complaint.atr.actionTaken}</p>
                  <p><strong>Action By:</strong> {complaint.atr.actionBy}</p>
                  <p><strong>Completed On:</strong> {complaint.atr.completionDate}</p>
                  {complaint.atr.remarks && <p><strong>Remarks:</strong> {complaint.atr.remarks}</p>}
                </div>
              </div>
            )}

            <div className="complaint-actions">
              {complaint.status !== 'resolved' && (
                <>
                  <button 
                    className="btn-primary btn-sm"
                    onClick={() => handlePostATR(complaint)}
                  >
                    Post ATR
                  </button>
                  {complaint.status === 'pending' && (
                    <button 
                      className="btn-warning btn-sm"
                      onClick={() => updateComplaintStatus(complaint.id, 'in-progress')}
                    >
                      Mark In Progress
                    </button>
                  )}
                  {complaint.status === 'in-progress' && (
                    <button 
                      className="btn-secondary btn-sm"
                      onClick={() => updateComplaintStatus(complaint.id, 'pending')}
                    >
                      Mark Pending
                    </button>
                  )}
                </>
              )}
              <button className="btn-outline btn-sm">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredComplaints.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No complaints found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* ATR Modal */}
      {showATRModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Post Action Taken Report</h3>
              <button 
                className="modal-close"
                onClick={() => setShowATRModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="complaint-info">
                <h4>{selectedComplaint?.title}</h4>
                <div className="complaint-meta">
                  <p><strong>Student:</strong> {selectedComplaint?.studentName} (Room: {selectedComplaint?.roomNo})</p>
                  <p><strong>Description:</strong> {selectedComplaint?.description}</p>
                </div>
              </div>
              
              <div className="atr-form">
                <div className="form-group">
                  <label>Action Taken *</label>
                  <textarea
                    value={atrData.actionTaken}
                    onChange={(e) => setAtrData({...atrData, actionTaken: e.target.value})}
                    placeholder="Describe the actions taken to resolve this complaint..."
                    rows="3"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Action By *</label>
                    <input
                      type="text"
                      value={atrData.actionBy}
                      onChange={(e) => setAtrData({...atrData, actionBy: e.target.value})}
                      placeholder="Name of person who resolved"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Completion Date *</label>
                    <input
                      type="date"
                      value={atrData.completionDate}
                      onChange={(e) => setAtrData({...atrData, completionDate: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Remarks</label>
                  <textarea
                    value={atrData.remarks}
                    onChange={(e) => setAtrData({...atrData, remarks: e.target.value})}
                    placeholder="Any additional remarks..."
                    rows="2"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowATRModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={submitATR}
                disabled={!atrData.actionTaken.trim() || !atrData.actionBy.trim() || !atrData.completionDate}
              >
                Submit ATR & Mark Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintManagement;