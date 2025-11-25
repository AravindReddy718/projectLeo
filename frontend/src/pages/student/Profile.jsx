import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import studentService from '../../services/studentService';
import './Profile.css';

export default function Profile() {
  const [student, setStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      const studentData = await studentService.getOwnProfile();
      console.log('Student profile data:', studentData);
      setStudent(studentData);
      
      // Set profile photo if exists
      if (studentData.profilePhoto) {
        setProfilePhoto(studentData.profilePhoto);
      }
    } catch (error) {
      console.error('Error fetching student profile:', error);
      alert(error.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!student) return;
    
    try {
      setSaving(true);
      const updateData = {
        contactInfo: {
          phone: student.contactInfo?.phone,
          parentPhone: student.contactInfo?.parentPhone,
          emergencyContact: student.contactInfo?.emergencyContact
        }
      };
      
      console.log('Updating profile with user ID:', student.user._id);
      console.log('Update data:', updateData);
      
      await studentService.updateProfile(student.user._id, updateData);
      await fetchStudentProfile(); // Refresh profile
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
              <h2>{student.personalInfo?.firstName || ''} {student.personalInfo?.lastName || ''}</h2>
              <p className="student-id">{student.studentId}</p>
              <p className="student-course">{student.academicInfo?.department || 'N/A'} • {student.academicInfo?.year || 'N/A'} Year</p>
              <div className="status-badge">{student.status || 'Active'}</div>
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
                  <span className="info-value">
                    {student.personalInfo?.firstName || ''} {student.personalInfo?.lastName || ''}
                  </span>
                </div>

                <div className="info-item">
                  <label>Student ID</label>
                  <span className="info-value code">{student.studentId}</span>
                </div>

                <div className="info-item">
                  <label>Roll Number</label>
                  <span className="info-value code">{student.academicInfo?.rollNumber || 'N/A'}</span>
                </div>

                <div className="info-item">
                  <label>Email Address</label>
                  <span className="info-value email">{student.contactInfo?.email || student.user?.email || 'N/A'}</span>
                </div>

                <div className="info-item">
                  <label>Contact Number</label>
                  {isEditing ? (
                    <input 
                      type="tel" 
                      value={student.contactInfo?.phone || ''} 
                      onChange={(e) => setStudent({
                        ...student, 
                        contactInfo: { ...student.contactInfo, phone: e.target.value }
                      })}
                      className="edit-input"
                      disabled={saving}
                    />
                  ) : (
                    <span className="info-value phone">{student.contactInfo?.phone || 'N/A'}</span>
                  )}
                </div>

                <div className="info-item">
                  <label>Date of Birth</label>
                  <span className="info-value">
                    {student.personalInfo?.dateOfBirth 
                      ? new Date(student.personalInfo.dateOfBirth).toLocaleDateString() 
                      : 'N/A'}
                  </span>
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
                  <span className="info-value">{student.academicInfo?.department || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <label>Year</label>
                  <span className="info-value badge">{student.academicInfo?.year || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <label>Semester</label>
                  <span className="info-value badge">{student.academicInfo?.semester || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <label>CGPA</label>
                  <span className="info-value badge">{student.academicInfo?.cgpa || 'N/A'}</span>
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
                  <label>Block</label>
                  <span className="info-value hall">{student.hostelInfo?.block || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <label>Room Number</label>
                  <span className="info-value room">{student.hostelInfo?.roomNumber || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <label>Floor</label>
                  <span className="info-value">{student.hostelInfo?.floor || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <label>Bed Number</label>
                  <span className="info-value">{student.hostelInfo?.bedNumber || 'N/A'}</span>
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
                  <label>Parent Phone</label>
                  {isEditing ? (
                    <input 
                      type="tel" 
                      value={student.contactInfo?.parentPhone || ''} 
                      onChange={(e) => setStudent({
                        ...student, 
                        contactInfo: { ...student.contactInfo, parentPhone: e.target.value }
                      })}
                      className="edit-input"
                      disabled={saving}
                    />
                  ) : (
                    <span className="info-value phone">{student.contactInfo?.parentPhone || 'Not provided'}</span>
                  )}
                </div>
                <div className="info-item">
                  <label>Emergency Contact Name</label>
                  <span className="info-value">
                    {student.contactInfo?.emergencyContact?.name || 'Not provided'}
                  </span>
                </div>
                <div className="info-item">
                  <label>Emergency Contact Phone</label>
                  {isEditing ? (
                    <input 
                      type="tel" 
                      value={student.contactInfo?.emergencyContact?.phone || ''} 
                      onChange={(e) => setStudent({
                        ...student, 
                        contactInfo: { 
                          ...student.contactInfo, 
                          emergencyContact: { 
                            ...student.contactInfo?.emergencyContact, 
                            phone: e.target.value 
                          }
                        }
                      })}
                      className="edit-input"
                      disabled={saving}
                    />
                  ) : (
                    <span className="info-value phone">
                      {student.contactInfo?.emergencyContact?.phone || 'Not provided'}
                    </span>
                  )}
                </div>
                <div className="info-item">
                  <label>Blood Group</label>
                  <span className="info-value blood-group">
                    {student.personalInfo?.bloodGroup || 'Not provided'}
                  </span>
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