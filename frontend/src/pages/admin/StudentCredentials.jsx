import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import studentService from '../../services/studentService';
import './StudentCredentials.css';

const StudentCredentials = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [createForm, setCreateForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    firstName: '',
    lastName: '',
    department: '',
    rollNumber: '',
    year: 1,
    semester: 1,
    roomNumber: '',
    block: '',
    phone: ''
  });
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    isActive: true
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching students...');
      const response = await studentService.getAllStudents();
      console.log('📋 Students response:', response);
      const studentsList = response.students || response;
      console.log('👥 Students list:', studentsList);
      console.log('📊 Total students found:', studentsList.length);
      setStudents(Array.isArray(studentsList) ? studentsList : []);
    } catch (error) {
      console.error('❌ Error fetching students:', error);
      console.error('Fetch error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      alert(error.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const validateCreateForm = () => {
    const newErrors = {};
    
    if (!createForm.username.trim()) newErrors.username = 'Username is required';
    if (!createForm.email.trim()) newErrors.email = 'Email is required';
    if (!createForm.email.includes('@')) newErrors.email = 'Invalid email format';
    if (!createForm.password) newErrors.password = 'Password is required';
    if (createForm.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (createForm.password !== createForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!createForm.studentId.trim()) newErrors.studentId = 'Student ID is required';
    if (!createForm.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!createForm.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!createForm.department.trim()) newErrors.department = 'Department is required';
    if (!createForm.rollNumber.trim()) newErrors.rollNumber = 'Roll number is required';
    if (!createForm.roomNumber.trim()) newErrors.roomNumber = 'Room number is required';
    if (!createForm.block.trim()) newErrors.block = 'Block is required';
    if (!createForm.phone.trim()) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEditForm = () => {
    const newErrors = {};
    
    if (!editForm.username.trim()) newErrors.username = 'Username is required';
    if (!editForm.email.trim()) newErrors.email = 'Email is required';
    if (!editForm.email.includes('@')) newErrors.email = 'Invalid email format';
    if (editForm.password && editForm.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (editForm.password && editForm.password !== editForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    
    console.log('🚀 Starting student creation process...');
    console.log('📝 Form data:', createForm);
    console.log('🎯 Event target:', e.target);
    console.log('🔄 Current loading state:', loading);
    
    if (!validateCreateForm()) {
      console.log('❌ Form validation failed');
      console.log('🔍 Validation errors:', errors);
      return;
    }

    console.log('✅ Form validation passed');

    try {
      setLoading(true);
      console.log('⏳ Setting loading state...');
      
      const studentData = {
        studentId: createForm.studentId,
        personalInfo: {
          firstName: createForm.firstName,
          lastName: createForm.lastName
        },
        contactInfo: {
          email: createForm.email,
          phone: createForm.phone
        },
        academicInfo: {
          rollNumber: createForm.rollNumber,
          department: createForm.department,
          year: createForm.year,
          semester: createForm.semester
        },
        hostelInfo: {
          roomNumber: createForm.roomNumber,
          block: createForm.block
        },
        userCredentials: {
          username: createForm.username,
          email: createForm.email,
          password: createForm.password
        }
      };

      console.log('📤 Sending student data:', studentData);
      const result = await studentService.createStudent(studentData);
      console.log('✅ Student creation result:', result);
      
      alert('Student credentials created successfully!');
      setShowCreateModal(false);
      resetCreateForm();
      console.log('🔄 Refreshing student list...');
      fetchStudents();
    } catch (error) {
      console.error('❌ Error creating student:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      // Show more specific error messages
      let errorMessage = 'Failed to create student credentials';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.join(', ');
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied. Admin privileges required.';
      }
      
      alert(errorMessage);
      console.log('🔄 Error occurred, not refreshing student list');
    } finally {
      setLoading(false);
      console.log('✅ Loading state cleared');
    }
  };

  const handleEditCredentials = async (e) => {
    e.preventDefault();
    
    console.log('🔄 Starting credential update...');
    console.log('Selected student:', selectedStudent);
    console.log('Edit form data:', editForm);
    
    if (!validateEditForm()) {
      console.log('❌ Edit form validation failed');
      return;
    }

    try {
      setLoading(true);
      
      const updateData = {
        username: editForm.username,
        email: editForm.email,
        isActive: editForm.isActive
      };

      if (editForm.password) {
        updateData.password = editForm.password;
        console.log('🔑 Password will be updated');
      }

      console.log('📤 Sending credential update:', updateData);
      const result = await studentService.updateStudentCredentials(selectedStudent._id, updateData);
      console.log('✅ Credential update result:', result);
      
      alert('Student credentials updated successfully!');
      setShowEditModal(false);
      setSelectedStudent(null);
      resetEditForm();
      fetchStudents();
    } catch (error) {
      console.error('❌ Error updating credentials:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      // Show more specific error messages
      let errorMessage = 'Failed to update student credentials';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.join(', ');
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied. Admin privileges required.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Student not found.';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to deactivate this student account?')) {
      return;
    }

    try {
      setLoading(true);
      await studentService.updateStudentCredentials(studentId, { isActive: false });
      alert('Student account deactivated successfully!');
      fetchStudents();
    } catch (error) {
      console.error('Error deactivating student:', error);
      alert(error.message || 'Failed to deactivate student account');
    } finally {
      setLoading(false);
    }
  };

  const handleActivateStudent = async (studentId) => {
    try {
      setLoading(true);
      await studentService.updateStudentCredentials(studentId, { isActive: true });
      alert('Student account activated successfully!');
      fetchStudents();
    } catch (error) {
      console.error('Error activating student:', error);
      alert(error.message || 'Failed to activate student account');
    } finally {
      setLoading(false);
    }
  };

  const resetCreateForm = () => {
    setCreateForm({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      studentId: '',
      firstName: '',
      lastName: '',
      department: '',
      rollNumber: '',
      year: 1,
      semester: 1,
      roomNumber: '',
      block: '',
      phone: ''
    });
    setErrors({});
  };

  const resetEditForm = () => {
    setEditForm({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      isActive: true
    });
    setErrors({});
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setEditForm({
      username: student.user?.username || '',
      email: student.user?.email || student.contactInfo?.email || '',
      password: '',
      confirmPassword: '',
      isActive: student.user?.isActive !== false
    });
    setShowEditModal(true);
  };

  const filteredStudents = students.filter(student => {
    const fullName = `${student.personalInfo?.firstName || ''} ${student.personalInfo?.lastName || ''}`.trim();
    const searchLower = searchTerm.toLowerCase();
    return (
      fullName.toLowerCase().includes(searchLower) ||
      student.studentId?.toLowerCase().includes(searchLower) ||
      student.academicInfo?.rollNumber?.toLowerCase().includes(searchLower) ||
      student.user?.username?.toLowerCase().includes(searchLower) ||
      student.user?.email?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Layout>
      <div className="student-credentials-content">
        <div className="page-header">
          <h1 className="page-title">Student Credential Management</h1>
          <p className="page-subtitle">Create and manage student login credentials</p>
        </div>

        <div className="actions-bar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search students by name, ID, roll number, username, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            + Create Student Account
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => {
              console.log('🧪 Debug - Current form state:', createForm);
              console.log('🧪 Debug - Current errors:', errors);
              console.log('🧪 Debug - Students list:', students);
            }}
            style={{ marginLeft: '10px' }}
          >
            🐛 Debug Info
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student Info</th>
                <th>Login Credentials</th>
                <th>Academic Info</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                    Loading students...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                    No students found
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => {
                  const fullName = `${student.personalInfo?.firstName || ''} ${student.personalInfo?.lastName || ''}`.trim();
                  const isActive = student.user?.isActive !== false;
                  
                  return (
                    <tr key={student._id}>
                      <td>
                        <div className="student-info">
                          <div className="student-avatar">
                            {fullName.charAt(0) || 'S'}
                          </div>
                          <div>
                            <div className="student-name">{fullName || 'Unknown Student'}</div>
                            <div className="student-id">ID: {student.studentId}</div>
                            <div className="student-roll">Roll: {student.academicInfo?.rollNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="credentials-info">
                          <div><strong>Username:</strong> {student.user?.username || 'N/A'}</div>
                          <div><strong>Email:</strong> {student.user?.email || student.contactInfo?.email || 'N/A'}</div>
                        </div>
                      </td>
                      <td>
                        <div className="academic-info">
                          <div>{student.academicInfo?.department || 'N/A'}</div>
                          <div>Year {student.academicInfo?.year || 'N/A'}, Sem {student.academicInfo?.semester || 'N/A'}</div>
                          <div>{student.hostelInfo?.block || 'N/A'} - {student.hostelInfo?.roomNumber || 'N/A'}</div>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${isActive ? 'status-active' : 'status-inactive'}`}>
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn btn-sm btn-outline"
                            onClick={() => openEditModal(student)}
                          >
                            Edit Credentials
                          </button>
                          {isActive ? (
                            <button 
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeactivateStudent(student._id)}
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button 
                              className="btn btn-sm btn-success"
                              onClick={() => handleActivateStudent(student._id)}
                            >
                              Activate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Create Student Modal */}
        {showCreateModal && (
          <div className="modal-overlay">
            <div className="modal create-student-modal">
              <div className="modal-header">
                <h3>Create New Student Account</h3>
                <button className="modal-close" onClick={() => setShowCreateModal(false)}>×</button>
              </div>
              <form onSubmit={handleCreateStudent}>
                <div className="modal-body">
                  <div className="form-section">
                    <h4>Login Credentials</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Username *</label>
                        <input
                          type="text"
                          value={createForm.username}
                          onChange={(e) => setCreateForm({...createForm, username: e.target.value})}
                          placeholder="Enter username"
                          className={errors.username ? 'error' : ''}
                        />
                        {errors.username && <span className="error-text">{errors.username}</span>}
                      </div>
                      <div className="form-group">
                        <label>Email *</label>
                        <input
                          type="email"
                          value={createForm.email}
                          onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                          placeholder="Enter email address"
                          className={errors.email ? 'error' : ''}
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                      </div>
                      <div className="form-group" style={{backgroundColor: '#f0f8ff', padding: '10px', border: '2px solid #3182ce'}}>
                        <label style={{color: '#3182ce', fontWeight: 'bold'}}>Password * (REQUIRED)</label>
                        <input
                          type="password"
                          value={createForm.password}
                          onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                          placeholder="Enter password (min 6 characters)"
                          className={errors.password ? 'error' : ''}
                          style={{border: '2px solid #3182ce'}}
                        />
                        {errors.password && <span className="error-text">{errors.password}</span>}
                      </div>
                      <div className="form-group" style={{backgroundColor: '#f0f8ff', padding: '10px', border: '2px solid #3182ce'}}>
                        <label style={{color: '#3182ce', fontWeight: 'bold'}}>Confirm Password * (REQUIRED)</label>
                        <input
                          type="password"
                          value={createForm.confirmPassword}
                          onChange={(e) => setCreateForm({...createForm, confirmPassword: e.target.value})}
                          placeholder="Confirm password (must match above)"
                          className={errors.confirmPassword ? 'error' : ''}
                          style={{border: '2px solid #3182ce'}}
                        />
                        {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h4>Personal Information</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Student ID *</label>
                        <input
                          type="text"
                          value={createForm.studentId}
                          onChange={(e) => setCreateForm({...createForm, studentId: e.target.value})}
                          placeholder="Enter student ID"
                          className={errors.studentId ? 'error' : ''}
                        />
                        {errors.studentId && <span className="error-text">{errors.studentId}</span>}
                      </div>
                      <div className="form-group">
                        <label>First Name *</label>
                        <input
                          type="text"
                          value={createForm.firstName}
                          onChange={(e) => setCreateForm({...createForm, firstName: e.target.value})}
                          placeholder="Enter first name"
                          className={errors.firstName ? 'error' : ''}
                        />
                        {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                      </div>
                      <div className="form-group">
                        <label>Last Name *</label>
                        <input
                          type="text"
                          value={createForm.lastName}
                          onChange={(e) => setCreateForm({...createForm, lastName: e.target.value})}
                          placeholder="Enter last name"
                          className={errors.lastName ? 'error' : ''}
                        />
                        {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                      </div>
                      <div className="form-group">
                        <label>Phone Number *</label>
                        <input
                          type="tel"
                          value={createForm.phone}
                          onChange={(e) => setCreateForm({...createForm, phone: e.target.value})}
                          placeholder="Enter phone number"
                          className={errors.phone ? 'error' : ''}
                        />
                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h4>Academic Information</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Roll Number *</label>
                        <input
                          type="text"
                          value={createForm.rollNumber}
                          onChange={(e) => setCreateForm({...createForm, rollNumber: e.target.value})}
                          placeholder="Enter roll number"
                          className={errors.rollNumber ? 'error' : ''}
                        />
                        {errors.rollNumber && <span className="error-text">{errors.rollNumber}</span>}
                      </div>
                      <div className="form-group">
                        <label>Department *</label>
                        <select
                          value={createForm.department}
                          onChange={(e) => setCreateForm({...createForm, department: e.target.value})}
                          className={errors.department ? 'error' : ''}
                        >
                          <option value="">Select Department</option>
                          <option value="Computer Science">Computer Science</option>
                          <option value="Electrical Engineering">Electrical Engineering</option>
                          <option value="Mechanical Engineering">Mechanical Engineering</option>
                          <option value="Civil Engineering">Civil Engineering</option>
                          <option value="Chemical Engineering">Chemical Engineering</option>
                        </select>
                        {errors.department && <span className="error-text">{errors.department}</span>}
                      </div>
                      <div className="form-group">
                        <label>Year *</label>
                        <select
                          value={createForm.year}
                          onChange={(e) => setCreateForm({...createForm, year: parseInt(e.target.value)})}
                        >
                          <option value={1}>1st Year</option>
                          <option value={2}>2nd Year</option>
                          <option value={3}>3rd Year</option>
                          <option value={4}>4th Year</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Semester *</label>
                        <select
                          value={createForm.semester}
                          onChange={(e) => setCreateForm({...createForm, semester: parseInt(e.target.value)})}
                        >
                          <option value={1}>1st Semester</option>
                          <option value={2}>2nd Semester</option>
                          <option value={3}>3rd Semester</option>
                          <option value={4}>4th Semester</option>
                          <option value={5}>5th Semester</option>
                          <option value={6}>6th Semester</option>
                          <option value={7}>7th Semester</option>
                          <option value={8}>8th Semester</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h4>Hostel Information</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Block *</label>
                        <select
                          value={createForm.block}
                          onChange={(e) => setCreateForm({...createForm, block: e.target.value})}
                          className={errors.block ? 'error' : ''}
                        >
                          <option value="">Select Block</option>
                          <option value="Hall 3">Hall 3</option>
                          <option value="Hall 5">Hall 5</option>
                        </select>
                        {errors.block && <span className="error-text">{errors.block}</span>}
                      </div>
                      <div className="form-group">
                        <label>Room Number *</label>
                        <input
                          type="text"
                          value={createForm.roomNumber}
                          onChange={(e) => setCreateForm({...createForm, roomNumber: e.target.value})}
                          placeholder="Enter room number"
                          className={errors.roomNumber ? 'error' : ''}
                        />
                        {errors.roomNumber && <span className="error-text">{errors.roomNumber}</span>}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={loading}
                    onClick={() => console.log('🖱️ Submit button clicked!')}
                  >
                    {loading ? 'Creating...' : 'Create Student Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Credentials Modal */}
        {showEditModal && selectedStudent && (
          <div className="modal-overlay">
            <div className="modal edit-credentials-modal">
              <div className="modal-header">
                <h3>Edit Student Credentials - {selectedStudent.personalInfo?.firstName} {selectedStudent.personalInfo?.lastName}</h3>
                <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
              </div>
              <form onSubmit={handleEditCredentials}>
                <div className="modal-body">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Username *</label>
                      <input
                        type="text"
                        value={editForm.username}
                        onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                        placeholder="Enter username"
                        className={errors.username ? 'error' : ''}
                      />
                      {errors.username && <span className="error-text">{errors.username}</span>}
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        placeholder="Enter email address"
                        className={errors.email ? 'error' : ''}
                      />
                      {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>
                    <div className="form-group">
                      <label>New Password (leave blank to keep current)</label>
                      <input
                        type="password"
                        value={editForm.password}
                        onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                        placeholder="Enter new password"
                        className={errors.password ? 'error' : ''}
                      />
                      {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>
                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input
                        type="password"
                        value={editForm.confirmPassword}
                        onChange={(e) => setEditForm({...editForm, confirmPassword: e.target.value})}
                        placeholder="Confirm new password"
                        className={errors.confirmPassword ? 'error' : ''}
                      />
                      {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={editForm.isActive}
                        onChange={(e) => setEditForm({...editForm, isActive: e.target.checked})}
                      />
                      Account is active
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Credentials'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StudentCredentials;
