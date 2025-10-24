import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import './Complaints.css';

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    type: '',
    title: '',
    description: '',
    priority: 'medium'
  });

  useEffect(() => {
    // Mock data - replace with API call
    setComplaints([
      {
        id: 1,
        type: 'electrical',
        title: 'Fused Tube Light',
        description: 'Tube light in room is not working',
        status: 'pending',
        priority: 'high',
        createdAt: '2024-10-20',
        atr: null
      },
      {
        id: 2,
        type: 'plumbing',
        title: 'Leaking Tap',
        description: 'Water tap in bathroom is leaking',
        status: 'resolved',
        priority: 'medium',
        createdAt: '2024-10-15',
        atr: {
          actionTaken: 'Tap replaced by plumber',
          actionBy: 'Mr. Sharma',
          completionDate: '2024-10-18',
          remarks: 'Issue resolved'
        }
      }
    ]);
  }, []);

  const handleSubmitComplaint = (e) => {
    e.preventDefault();
    // API call to submit complaint
    const complaint = {
      id: complaints.length + 1,
      ...newComplaint,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setComplaints([complaint, ...complaints]);
    setNewComplaint({ type: '', title: '', description: '', priority: 'medium' });
    setShowForm(false);
    alert('Complaint submitted successfully!');
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

  return (
    <Layout>
      <div className="complaints-container">
        <div className="complaints-header">
          <h1 className="complaints-title">Complaints Management</h1>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            + Raise New Complaint
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
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-success">Submit Complaint</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Complaints List */}
        <div className="complaints-list">
          <h3>Your Complaints</h3>
          {complaints.length === 0 ? (
            <p className="no-complaints">No complaints found.</p>
          ) : (
            complaints.map(complaint => (
              <div key={complaint.id} className="complaint-card">
                <div className="complaint-header">
                  <div className="complaint-meta">
                    <h4>{complaint.title}</h4>
                    <div className="complaint-badges">
                      {getPriorityBadge(complaint.priority)}
                      {getStatusBadge(complaint.status)}
                    </div>
                  </div>
                  <span className="complaint-date">{complaint.createdAt}</span>
                </div>
                
                <div className="complaint-body">
                  <p><strong>Type:</strong> {complaint.type}</p>
                  <p><strong>Description:</strong> {complaint.description}</p>
                </div>

                {complaint.atr && (
                  <div className="atr-section">
                    <h5>Action Taken Report (ATR)</h5>
                    <p><strong>Action Taken:</strong> {complaint.atr.actionTaken}</p>
                    <p><strong>Action By:</strong> {complaint.atr.actionBy}</p>
                    <p><strong>Completed On:</strong> {complaint.atr.completionDate}</p>
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