import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import './Complaints.css';

const API_BASE_URL = 'http://localhost:5000/api';
// Change this line to use your actual student ID
const studentId = '690256e03cf868dd730c2b15';

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    type: '',
    title: '',
    description: '',
    priority: 'medium'
  });

  // Get student ID from auth (mock for now)
  const studentId = '65a1b2c3d4e5f67890123456';

  // Fetch complaints from API
  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/complaints?studentId=${studentId}`);
      if (!response.ok) throw new Error('Failed to fetch complaints');
      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      alert('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    
    try {
      setFormLoading(true);
      const response = await fetch(`${API_BASE_URL}/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newComplaint,
          studentId: studentId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit complaint');
      }

      const savedComplaint = await response.json();
      
      // Update local state with the saved complaint
      setComplaints([savedComplaint, ...complaints]);
      setNewComplaint({ type: '', title: '', description: '', priority: 'medium' });
      setShowForm(false);
      alert('Complaint submitted successfully!');
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert(error.message || 'Failed to submit complaint');
    } finally {
      setFormLoading(false);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout>
      <div className="complaints-container">
        <div className="complaints-header">
          <h1 className="complaints-title">Complaints Management</h1>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
            disabled={loading || formLoading}
          >
            {formLoading ? 'Loading...' : '+ Raise New Complaint'}
          </button>
        </div>

        {/* Complaint Form */}
        {showForm && (
          <div className="complaint-form-container">
            <h3>Raise New Complaint</h3>
            <form onSubmit={handleSubmitComplaint} className="complaint-form">
              <div className="form-group">
                <label>Complaint Type *</label>
                <select 
                  value={newComplaint.type} 
                  onChange={(e) => setNewComplaint({...newComplaint, type: e.target.value})}
                  required
                  disabled={formLoading}
                >
                  <option value="">Select Type</option>
                  <option value="electrical">Electrical</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="housekeeping">Housekeeping</option>
                  <option value="furniture">Furniture</option>
                  <option value="internet">Internet</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Priority *</label>
                <select 
                  value={newComplaint.priority} 
                  onChange={(e) => setNewComplaint({...newComplaint, priority: e.target.value})}
                  disabled={formLoading}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label>Title *</label>
                <input 
                  type="text" 
                  value={newComplaint.title}
                  onChange={(e) => setNewComplaint({...newComplaint, title: e.target.value})}
                  placeholder="Brief description of the issue"
                  required
                  disabled={formLoading}
                />
              </div>

              <div className="form-group">
                <label>Detailed Description *</label>
                <textarea 
                  value={newComplaint.description}
                  onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                  placeholder="Provide detailed information about the issue..."
                  rows="4"
                  required
                  disabled={formLoading}
                />
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-success" 
                  disabled={formLoading}
                >
                  {formLoading ? 'Submitting...' : 'Submit Complaint'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowForm(false)} 
                  disabled={formLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Complaints List */}
        <div className="complaints-list">
          <h3>Your Complaints</h3>
          {loading && complaints.length === 0 ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading complaints...</p>
            </div>
          ) : complaints.length === 0 ? (
            <p className="no-complaints">No complaints found. Raise your first complaint!</p>
          ) : (
            complaints.map(complaint => (
              <div key={complaint._id} className="complaint-card">
                <div className="complaint-header">
                  <div className="complaint-meta">
                    <h4>{complaint.title}</h4>
                    <div className="complaint-badges">
                      {getPriorityBadge(complaint.priority)}
                      {getStatusBadge(complaint.status)}
                    </div>
                  </div>
                  <span className="complaint-date">{formatDate(complaint.createdAt)}</span>
                </div>
                
                <div className="complaint-body">
                  <p><strong>Type:</strong> <span className="complaint-type-badge">{complaint.type}</span></p>
                  <p><strong>Description:</strong> {complaint.description}</p>
                  {complaint.assignedTo && (
                    <p><strong>Assigned To:</strong> {complaint.assignedTo}</p>
                  )}
                  {complaint.resolutionNotes && (
                    <p><strong>Resolution Notes:</strong> {complaint.resolutionNotes}</p>
                  )}
                </div>

                {complaint.atr && (
                  <div className="atr-section">
                    <h5>Action Taken Report (ATR)</h5>
                    <p><strong>Action Taken:</strong> {complaint.atr.actionTaken}</p>
                    <p><strong>Action By:</strong> {complaint.atr.actionBy}</p>
                    <p><strong>Completed On:</strong> {formatDate(complaint.atr.completionDate)}</p>
                    {complaint.atr.remarks && <p><strong>Remarks:</strong> {complaint.atr.remarks}</p>}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}