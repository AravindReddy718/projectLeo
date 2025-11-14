import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import complaintService from '../../services/complaintService';
import './ComplaintManagement.css';

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showATRModal, setShowATRModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [atrData, setAtrData] = useState({
    actionTaken: '',
    actionBy: '',
    completionDate: '',
    remarks: ''
  });
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, [filter, categoryFilter, priorityFilter]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (filter !== 'all') filters.status = filter;
      if (categoryFilter !== 'all') filters.category = categoryFilter;
      if (priorityFilter !== 'all') filters.priority = priorityFilter;
      
      const response = await complaintService.getComplaints({ ...filters, limit: 100 });
      const complaintsList = response.complaints || response.data || response;
      
      if (Array.isArray(complaintsList)) {
        setComplaints(complaintsList);
      } else {
        console.warn('Unexpected response format:', response);
        setComplaints([]);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setComplaints([]);
      alert(error.message || 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedComplaints = complaints
    .filter(complaint => {
      if (!complaint) return false;
      
      const matchesFilter = filter === 'all' || complaint.status === filter;
      const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter;
      const matchesPriority = priorityFilter === 'all' || complaint.priority === priorityFilter;
      
      const studentName = complaint.student 
        ? `${complaint.student.personalInfo?.firstName || ''} ${complaint.student.personalInfo?.lastName || ''}`.trim()
        : 'Unknown Student';
      
      const matchesSearch = !searchTerm || 
        studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (complaint.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (complaint.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (complaint.student?.studentId || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesFilter && matchesCategory && matchesPriority && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
        case 'status':
          const statusOrder = { pending: 3, 'in-progress': 2, resolved: 1 };
          return (statusOrder[b.status] || 1) - (statusOrder[a.status] || 1);
        default:
          return 0;
      }
    });

  const handlePostATR = (complaint) => {
    setSelectedComplaint(complaint);
    setAtrData({
      actionTaken: '',
      actionBy: '',
      completionDate: '',
      remarks: ''
    });
    setShowATRModal(true);
  };

  const handleStatusUpdate = async (complaintId, status) => {
    try {
      setLoading(true);
      await complaintService.updateComplaint(complaintId, { status });
      await fetchComplaints();
      alert('Complaint status updated successfully!');
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const submitATR = async () => {
    if (!atrData.actionTaken.trim() || !selectedComplaint) {
      alert('Please fill in the action taken field');
      return;
    }

    try {
      setLoading(true);
      // Update complaint with ATR and resolve it
      const updateData = {
        status: 'resolved',
        resolutionNotes: `${atrData.actionTaken}\n\nAction By: ${atrData.actionBy || 'Warden'}\nCompletion Date: ${atrData.completionDate || new Date().toISOString().split('T')[0]}\nRemarks: ${atrData.remarks || 'N/A'}`,
        notes: atrData.actionTaken
      };

      await complaintService.updateComplaint(selectedComplaint._id, updateData);
      
      // Refresh complaints list
      await fetchComplaints();
      setShowATRModal(false);
      setSelectedComplaint(null);
      setAtrData({
        actionTaken: '',
        actionBy: '',
        completionDate: '',
        remarks: ''
      });
      alert('ATR submitted successfully!');
    } catch (error) {
      console.error('Error submitting ATR:', error);
      alert(error.message || 'Failed to submit ATR');
    } finally {
      setLoading(false);
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

        {/* Enhanced Search and Filters */}
        <div className="filters-section">
          <div className="search-and-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by student name, ID, title, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
            
            <div className="view-controls">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                ⊞
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                ☰
              </button>
            </div>
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <label>Status:</label>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Category:</label>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="all">All Categories</option>
                <option value="electrical">Electrical</option>
                <option value="plumbing">Plumbing</option>
                <option value="furniture">Furniture</option>
                <option value="cleanliness">Cleanliness</option>
                <option value="food">Food</option>
                <option value="internet">Internet</option>
                <option value="security">Security</option>
                <option value="medical">Medical</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Priority:</label>
              <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="priority">Priority</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="results-summary">
          <span>Showing {filteredAndSortedComplaints.length} of {complaints.length} complaints</span>
          {searchTerm && <span className="search-indicator">Filtered by: "{searchTerm}"</span>}
        </div>

        {/* Complaints Display */}
        <div className={`complaints-container ${viewMode}`}>
          {loading && complaints.length === 0 ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading complaints...</p>
            </div>
          ) : filteredAndSortedComplaints.length === 0 ? (
            <div className="no-complaints">
              <div className="no-complaints-icon">📋</div>
              <h3>No complaints found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            filteredAndSortedComplaints.map(complaint => {
              if (!complaint) return null;
              
              const studentName = complaint.student 
                ? `${complaint.student.personalInfo?.firstName || ''} ${complaint.student.personalInfo?.lastName || ''}`.trim() || 'Unknown Student'
                : 'Unknown Student';
              const roomNo = complaint.student?.hostelInfo?.roomNumber || 'N/A';
              const studentId = complaint.student?.studentId || 'N/A';
              const createdDate = complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'N/A';
              
              return (
                <div key={complaint._id} className={`complaint-card ${viewMode}-view`}>
                  <div className="complaint-header">
                    <div className="complaint-title-section">
                      <h3 className="complaint-title">{complaint.title || 'Untitled Complaint'}</h3>
                      <div className="complaint-meta">
                        <span className="complaint-id">#{complaint._id?.slice(-6) || 'N/A'}</span>
                        <span className="complaint-date">{createdDate}</span>
                      </div>
                    </div>
                    <div className="complaint-badges">
                      {getPriorityBadge(complaint.priority)}
                      {getStatusBadge(complaint.status)}
                    </div>
                  </div>
                  
                  <div className="complaint-details">
                    <div className="student-info">
                      <div className="info-row">
                        <span className="info-label">Student:</span>
                        <span className="info-value">{studentName}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">ID:</span>
                        <span className="info-value">{studentId}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Room:</span>
                        <span className="info-value">{roomNo}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Category:</span>
                        <span className="info-value category-tag">{complaint.category || 'N/A'}</span>
                      </div>
                    </div>
                    
                    <div className="complaint-description">
                      <h4>Description:</h4>
                      <p>{complaint.description || 'No description provided'}</p>
                    </div>
                    
                    {complaint.location && (
                      <div className="location-info">
                        <h4>Location Details:</h4>
                        <p>{complaint.location.description || `Room ${complaint.location.roomNumber || roomNo}, Block ${complaint.location.block || 'N/A'}`}</p>
                      </div>
                    )}
                    
                    {complaint.resolution?.resolutionNotes && (
                      <div className="resolution-section">
                        <h4>Resolution:</h4>
                        <p>{complaint.resolution.resolutionNotes}</p>
                        {complaint.resolution.resolvedBy && (
                          <p className="resolved-by">Resolved by: {complaint.resolution.resolvedBy.username || 'Warden'}</p>
                        )}
                        {complaint.resolution.resolvedAt && (
                          <p className="resolved-date">Resolved on: {new Date(complaint.resolution.resolvedAt).toLocaleDateString('en-IN')}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="complaint-actions">
                    {complaint.status !== 'resolved' && (
                      <>
                        <button 
                          className="btn btn-secondary"
                          onClick={() => handleStatusUpdate(complaint._id, 'in-progress')}
                          disabled={loading}
                        >
                          Mark In Progress
                        </button>
                        <button 
                          className="btn btn-primary"
                          onClick={() => handlePostATR(complaint)}
                          disabled={loading}
                        >
                          Post ATR & Resolve
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
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
                  <label htmlFor="actionTaken">ACTION TAKEN *</label>
                  <textarea
                    id="actionTaken"
                    value={atrData.actionTaken}
                    onChange={(e) => setAtrData({...atrData, actionTaken: e.target.value})}
                    rows="5"
                    placeholder="Describe the action taken to resolve this complaint..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="actionBy">ACTION BY</label>
                  <input
                    id="actionBy"
                    type="text"
                    value={atrData.actionBy}
                    onChange={(e) => setAtrData({...atrData, actionBy: e.target.value})}
                    placeholder="Enter your name or designation"
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