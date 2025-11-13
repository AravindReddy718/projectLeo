import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import './Profile.css';

const API_BASE_URL = 'http://localhost:5000/api';
// Change this line to use your actual student ID
const studentId = '690256e03cf868dd730c2b15';

export default function Profile() {
  const [student, setStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // Get student ID from auth (mock for now)
  const studentId = '65a1b2c3d4e5f67890123456';

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/students/${studentId}`);
      if (!response.ok) throw new Error('Failed to fetch student profile');
      const studentData = await response.json();
      setStudent(studentData);
      
      // Set profile photo if exists
      if (studentData.profilePhoto) {
        setProfilePhoto(studentData.profilePhoto);
      }
    } catch (error) {
      console.error('Error fetching student profile:', error);
      alert('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!student) return;
    
    try {
      setSaving(true);
      const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: student.name,
          contactNumber: student.contactNumber,
          permanentAddress: student.permanentAddress,
          bloodGroup: student.bloodGroup,
          emergencyContact: student.emergencyContact,
          parentName: student.parentName
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const updatedStudent = await response.json();
      setStudent(updatedStudent);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // In a real app, you would upload to cloud storage and get URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhoto(e.target.result);
        // Here you would call API to update profile photo URL
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    // Here you would call API to remove profile photo
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </Layout>
    );
  }

  if (!student) {
    return (
      <Layout>
        <div className="error-container">
          <h2>Error Loading Profile</h2>
          <p>Failed to load student profile. Please try again.</p>
          <button className="btn btn-primary" onClick={fetchStudentProfile}>
            Try Again
          </button>
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
            disabled={saving}
          >
            {isEditing ? (saving ? 'Saving...' : '💾 Save Changes') : '✏️ Edit Profile'}
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
              <div className="status-badge">{student.isActive ? 'Active' : 'Inactive'}</div>
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
                      disabled={saving}
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
                      disabled={saving}
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
                      disabled={saving}
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
                  <label>Room Type</label>
                  <span className="info-value">{student.roomType}</span>
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
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={student.parentName || ''} 
                      onChange={(e) => setStudent({...student, parentName: e.target.value})}
                      className="edit-input"
                      disabled={saving}
                    />
                  ) : (
                    <span className="info-value">{student.parentName || 'Not provided'}</span>
                  )}
                </div>
                <div className="info-item">
                  <label>Emergency Contact</label>
                  {isEditing ? (
                    <input 
                      type="tel" 
                      value={student.emergencyContact || ''} 
                      onChange={(e) => setStudent({...student, emergencyContact: e.target.value})}
                      className="edit-input"
                      disabled={saving}
                    />
                  ) : (
                    <span className="info-value phone">{student.emergencyContact || 'Not provided'}</span>
                  )}
                </div>
                <div className="info-item">
                  <label>Blood Group</label>
                  {isEditing ? (
                    <select 
                      value={student.bloodGroup || ''} 
                      onChange={(e) => setStudent({...student, bloodGroup: e.target.value})}
                      className="edit-input"
                      disabled={saving}
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  ) : (
                    <span className="info-value blood-group">{student.bloodGroup || 'Not provided'}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="action-buttons">
              <button 
                className="btn-cancel" 
                onClick={() => setIsEditing(false)}
                disabled={saving}
              >
                ❌ Cancel
              </button>
              <button 
                className="btn-save-changes" 
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : '💾 Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}