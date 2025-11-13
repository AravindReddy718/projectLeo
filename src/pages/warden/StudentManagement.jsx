import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import './StudentManagement.css';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    hall: 'all',
    department: 'all',
    status: 'all'
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Mock data with all profile fields
    const mockStudents = [
      {
        id: '2024CS10001',
        name: 'Amit Kumar',
        rollNumber: '2024CS10001',
        admissionNo: 'ADM202400125',
        email: 'amit.kumar@iit.ac.in',
        contactNumber: '9876543210',
        permanentAddress: '123 Main Street, Delhi, India - 110001',
        hall: 'Hall 5',
        roomNo: 'G-102',
        roomRent: 750,
        amenitiesFee: 300,
        wardenName: 'Dr. Priya Sharma',
        wardenContact: 'warden.h5@iit.ac.in',
        department: 'Computer Science',
        course: 'B.Tech',
        semester: '3rd',
        bloodGroup: 'O+',
        emergencyContact: '9876543211',
        parentName: 'Rajesh Kumar',
        status: 'Active'
      }
    ];
    setStudents(mockStudents);
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHall = filters.hall === 'all' || student.hall === filters.hall;
    const matchesDept = filters.department === 'all' || student.department === filters.department;
    const matchesStatus = filters.status === 'all' || student.status === filters.status;
    return matchesSearch && matchesHall && matchesDept && matchesStatus;
  });

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  return (
    <Layout>
      <div className="students-content">
        <div className="page-header">
          <h1 className="page-title">Student Management</h1>
        </div>

        {/* Search and Filters */}
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filter-grid">
            <div className="filter-group">
              <label>Hall</label>
              <select 
                value={filters.hall}
                onChange={(e) => setFilters({...filters, hall: e.target.value})}
              >
                <option value="all">All Halls</option>
                <option value="Hall 5">Hall 5</option>
                <option value="Hall 3">Hall 3</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Department</label>
              <select 
                value={filters.department}
                onChange={(e) => setFilters({...filters, department: e.target.value})}
              >
                <option value="all">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Status</label>
              <select 
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Name</th>
                <th>Department</th>
                <th>Hall & Room</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>{student.rollNumber}</td>
                  <td>
                    <div className="student-info">
                      <div className="student-avatar">
                        {student.name.charAt(0)}
                      </div>
                      {student.name}
                    </div>
                  </td>
                  <td>{student.department}</td>
                  <td>
                    <span className="room-badge">{student.hall} - {student.roomNo}</span>
                  </td>
                  <td>{student.contactNumber}</td>
                  <td>
                    <span className={`status-badge status-${student.status.toLowerCase()}`}>
                      {student.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleViewDetails(student)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Student Details Modal */}
        {showModal && selectedStudent && (
          <div className="modal-overlay">
            <div className="modal student-details-modal">
              <div className="modal-header">
                <h3>Student Profile - {selectedStudent.name}</h3>
                <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="profile-section">
                  <h4>Personal Information</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Full Name</label>
                      <span>{selectedStudent.name}</span>
                    </div>
                    <div className="info-item">
                      <label>Roll Number</label>
                      <span>{selectedStudent.rollNumber}</span>
                    </div>
                    <div className="info-item">
                      <label>Email</label>
                      <span>{selectedStudent.email}</span>
                    </div>
                    <div className="info-item">
                      <label>Contact</label>
                      <span>{selectedStudent.contactNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="profile-section">
                  <h4>Academic Information</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Department</label>
                      <span>{selectedStudent.department}</span>
                    </div>
                    <div className="info-item">
                      <label>Course</label>
                      <span>{selectedStudent.course}</span>
                    </div>
                    <div className="info-item">
                      <label>Semester</label>
                      <span>{selectedStudent.semester}</span>
                    </div>
                  </div>
                </div>

                <div className="profile-section">
                  <h4>Hall Information</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Hall</label>
                      <span>{selectedStudent.hall}</span>
                    </div>
                    <div className="info-item">
                      <label>Room Number</label>
                      <span>{selectedStudent.roomNo}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StudentManagement;