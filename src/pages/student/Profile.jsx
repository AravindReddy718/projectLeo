import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import './Profile.css';

export default function Profile() {
  const [student, setStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setStudent({
      name: "Amit Kumar",
      rollNumber: "2024CS10001",
      admissionNo: "ADM202400125",
      email: "amit.kumar@iit.ac.in",
      contactNumber: "9876543210",
      permanentAddress: "123 Main Street, Delhi, India - 110001",
      hall: "Hall 5",
      roomNo: "G-102",
      roomRent: 750,
      amenitiesFee: 300,
      wardenName: "Dr. Priya Sharma",
      wardenContact: "warden.h5@iit.ac.in",
      department: "Computer Science",
      course: "B.Tech",
      semester: "3rd",
      bloodGroup: "O+",
      emergencyContact: "9876543211",
      parentName: "Rajesh Kumar"
    });
  }, []);

  const handleSave = () => {
    setIsEditing(false);
    // In real app, you would save to backend here
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhoto(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
  };

  if (!student) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <button 
            className="btn-back"
            onClick={() => navigate('/student/dashboard')}
          >
            ← Back to Dashboard
          </button>
          <h1 className="profile-title">Student Profile</h1>
          <button 
            className={`btn-save ${isEditing ? 'editing' : ''}`}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
          >
            {isEditing ? '💾 Save Changes' : '✏️ Edit Profile'}
          </button>
        </div>

        <div className="profile-content">
          {/* Profile Photo Section */}
          <div className="photo-section">
            <div className="photo-container">
              <div className="photo-wrapper">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="profile-photo" />
                ) : (
                  <div className="photo-placeholder">
                    <span className="placeholder-icon">👤</span>
                    <span className="placeholder-text">Add Photo</span>
                  </div>
                )}
                {isEditing && (
                  <div className="photo-overlay">
                    <label htmlFor="photo-upload" className="upload-btn">
                      📷 Change
                    </label>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      style={{ display: 'none' }}
                    />
                    {profilePhoto && (
                      <button className="remove-btn" onClick={handleRemovePhoto}>
                        🗑️ Remove
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="photo-info">
              <h2>{student.name}</h2>
              <p className="student-id">{student.rollNumber}</p>
              <p className="student-course">{student.department} • {student.course}</p>
              <div className="status-badge">Active</div>
            </div>
          </div>

          {/* Profile Sections Grid */}
          <div className="profile-sections">
            {/* Personal Information */}
            <div className="profile-card">
              <div className="card-header">
                <h3>👤 Personal Information</h3>
                <div className="card-badge">Required</div>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <label>Full Name</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={student.name} 
                      onChange={(e) => setStudent({...student, name: e.target.value})} 
                      className="edit-input"
                    />
                  ) : (
                    <span className="info-value">{student.name}</span>
                  )}
                </div>

                <div className="info-item">
                  <label>Roll Number</label>
                  <span className="info-value code">{student.rollNumber}</span>
                </div>

                <div className="info-item">
                  <label>Admission Number</label>
                  <span className="info-value code">{student.admissionNo}</span>
                </div>

                <div className="info-item">
                  <label>Email Address</label>
                  <span className="info-value email">{student.email}</span>
                </div>

                <div className="info-item">
                  <label>Contact Number</label>
                  {isEditing ? (
                    <input 
                      type="tel" 
                      value={student.contactNumber} 
                      onChange={(e) => setStudent({...student, contactNumber: e.target.value})}
                      className="edit-input"
                    />
                  ) : (
                    <span className="info-value phone">{student.contactNumber}</span>
                  )}
                </div>

                <div className="info-item full-width">
                  <label>Permanent Address</label>
                  {isEditing ? (
                    <textarea 
                      value={student.permanentAddress} 
                      onChange={(e) => setStudent({...student, permanentAddress: e.target.value})}
                      className="edit-textarea"
                      rows="3"
                    />
                  ) : (
                    <span className="info-value address">{student.permanentAddress}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="profile-card">
              <div className="card-header">
                <h3>🎓 Academic Information</h3>
                <div className="card-badge">Academic</div>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <label>Department</label>
                  <span className="info-value">{student.department}</span>
                </div>
                <div className="info-item">
                  <label>Course</label>
                  <span className="info-value">{student.course}</span>
                </div>
                <div className="info-item">
                  <label>Semester</label>
                  <span className="info-value badge">{student.semester}</span>
                </div>
              </div>
            </div>

            {/* Hall Information */}
            <div className="profile-card">
              <div className="card-header">
                <h3>🏠 Hall Information</h3>
                <div className="card-badge">Residential</div>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <label>Hall</label>
                  <span className="info-value hall">{student.hall}</span>
                </div>
                <div className="info-item">
                  <label>Room Number</label>
                  <span className="info-value room">{student.roomNo}</span>
                </div>
                <div className="info-item">
                  <label>Room Rent</label>
                  <span className="info-value price">₹{student.roomRent}/month</span>
                </div>
                <div className="info-item">
                  <label>Amenities Fee</label>
                  <span className="info-value price">₹{student.amenitiesFee}/month</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="profile-card">
              <div className="card-header">
                <h3>📞 Contact Information</h3>
                <div className="card-badge">Emergency</div>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <label>Warden Name</label>
                  <span className="info-value">{student.wardenName}</span>
                </div>
                <div className="info-item">
                  <label>Warden Contact</label>
                  <span className="info-value email">{student.wardenContact}</span>
                </div>
                <div className="info-item">
                  <label>Parent/Guardian</label>
                  <span className="info-value">{student.parentName}</span>
                </div>
                <div className="info-item">
                  <label>Emergency Contact</label>
                  <span className="info-value phone">{student.emergencyContact}</span>
                </div>
                <div className="info-item">
                  <label>Blood Group</label>
                  <span className="info-value blood-group">{student.bloodGroup}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="action-buttons">
              <button className="btn-cancel" onClick={() => setIsEditing(false)}>
                ❌ Cancel
              </button>
              <button className="btn-save-changes" onClick={handleSave}>
                💾 Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}