// import React, { useState, useEffect } from 'react';

// const StudentManagement = () => {
//   const [students, setStudents] = useState([
//     {
//       id: 'STU001',
//       name: 'John Doe',
//       email: 'john@email.com',
//       phone: '+91 9876543210',
//       roomNumber: '101',
//       course: 'Computer Science',
//       year: '3rd Year',
//       status: 'Active'
//     },
//     {
//       id: 'STU002',
//       name: 'Jane Smith',
//       email: 'jane@email.com',
//       phone: '+91 9876543211',
//       roomNumber: '102',
//       course: 'Electrical Engineering',
//       year: '2nd Year',
//       status: 'Active'
//     },
//     {
//       id: 'STU003',
//       name: 'Mike Johnson',
//       email: 'mike@email.com',
//       phone: '+91 9876543212',
//       roomNumber: '201',
//       course: 'Mechanical Engineering',
//       year: '4th Year',
//       status: 'Inactive'
//     }
//   ]);
  
//   const [showModal, setShowModal] = useState(false);
//   const [editingStudent, setEditingStudent] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('All');
  
//   const [newStudent, setNewStudent] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     roomNumber: '',
//     course: '',
//     year: '1st Year',
//     status: 'Active'
//   });

//   // Generate unique student ID
//   const generateStudentId = () => {
//     const nextId = students.length + 1;
//     return `STU${nextId.toString().padStart(3, '0')}`;
//   };

//   // Handle add student
//   const handleAddStudent = () => {
//     if (!newStudent.name || !newStudent.email || !newStudent.roomNumber) {
//       alert('Please fill in all required fields');
//       return;
//     }

//     const student = {
//       id: generateStudentId(),
//       ...newStudent
//     };

//     setStudents([...students, student]);
//     resetForm();
//     setShowModal(false);
//   };

//   // Handle edit student
//   const handleEditStudent = (student) => {
//     setEditingStudent(student);
//     setNewStudent({
//       name: student.name,
//       email: student.email,
//       phone: student.phone,
//       roomNumber: student.roomNumber,
//       course: student.course,
//       year: student.year,
//       status: student.status
//     });
//     setShowModal(true);
//   };

//   // Handle update student
//   const handleUpdateStudent = () => {
//     if (!newStudent.name || !newStudent.email || !newStudent.roomNumber) {
//       alert('Please fill in all required fields');
//       return;
//     }

//     const updatedStudents = students.map(student =>
//       student.id === editingStudent.id
//         ? { ...student, ...newStudent }
//         : student
//     );

//     setStudents(updatedStudents);
//     resetForm();
//     setShowModal(false);
//   };

//   // Handle delete student
//   const handleDeleteStudent = (studentId) => {
//     if (window.confirm('Are you sure you want to delete this student?')) {
//       const updatedStudents = students.filter(student => student.id !== studentId);
//       setStudents(updatedStudents);
//     }
//   };

//   // Handle input change
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewStudent(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Reset form
//   const resetForm = () => {
//     setNewStudent({
//       name: '',
//       email: '',
//       phone: '',
//       roomNumber: '',
//       course: '',
//       year: '1st Year',
//       status: 'Active'
//     });
//     setEditingStudent(null);
//   };

//   // Close modal
//   const handleCloseModal = () => {
//     setShowModal(false);
//     resetForm();
//   };

//   // Filter students based on search and status
//   const filteredStudents = students.filter(student => {
//     const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          student.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = filterStatus === 'All' || student.status === filterStatus;
//     return matchesSearch && matchesStatus;
//   });

//   return (
//     <div className="students-content">
//       <div className="content-header">
//         <h2>Student Management</h2>
//         <div className="header-actions">
//           <div className="search-box">
//             <input
//               type="text"
//               placeholder="Search students..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <span className="search-icon">🔍</span>
//           </div>
//           <select 
//             className="filter-select"
//             value={filterStatus}
//             onChange={(e) => setFilterStatus(e.target.value)}
//           >
//             <option value="All">All Status</option>
//             <option value="Active">Active</option>
//             <option value="Inactive">Inactive</option>
//             <option value="Graduated">Graduated</option>
//           </select>
//           <button 
//             className="btn-primary" 
//             onClick={() => setShowModal(true)}
//           >
//             + Add Student
//           </button>
//         </div>
//       </div>

//       <div className="table-container">
//         <table className="data-table">
//           <thead>
//             <tr>
//               <th>Student ID</th>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Phone</th>
//               <th>Room No.</th>
//               <th>Course</th>
//               <th>Year</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredStudents.map(student => (
//               <tr key={student.id}>
//                 <td>{student.id}</td>
//                 <td>
//                   <div className="student-info">
//                     <div className="student-avatar">
//                       {student.name.charAt(0)}
//                     </div>
//                     {student.name}
//                   </div>
//                 </td>
//                 <td>{student.email}</td>
//                 <td>{student.phone}</td>
//                 <td>
//                   <span className="room-badge">{student.roomNumber}</span>
//                 </td>
//                 <td>{student.course}</td>
//                 <td>{student.year}</td>
//                 <td>
//                   <span className={`status-badge status-${student.status.toLowerCase()}`}>
//                     {student.status}
//                   </span>
//                 </td>
//                 <td>
//                   <div className="action-buttons">
//                     <button 
//                       className="btn-icon btn-edit"
//                       onClick={() => handleEditStudent(student)}
//                       title="Edit"
//                     >
//                       ✏️
//                     </button>
//                     <button 
//                       className="btn-icon btn-delete"
//                       onClick={() => handleDeleteStudent(student.id)}
//                       title="Delete"
//                     >
//                       🗑️
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
        
//         {filteredStudents.length === 0 && (
//           <div className="empty-state">
//             <div className="empty-icon">👨‍🎓</div>
//             <h3>No students found</h3>
//             <p>Try adjusting your search or add a new student.</p>
//           </div>
//         )}
//       </div>

//       {/* Add/Edit Student Modal */}
//       {showModal && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <div className="modal-header">
//               <h3>{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
//               <button className="modal-close" onClick={handleCloseModal}>×</button>
//             </div>
//             <div className="modal-body">
//               <div className="form-row">
//                 <div className="form-group">
//                   <label>Full Name *</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={newStudent.name}
//                     onChange={handleInputChange}
//                     placeholder="Enter student name"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Email Address *</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={newStudent.email}
//                     onChange={handleInputChange}
//                     placeholder="Enter email address"
//                   />
//                 </div>
//               </div>
              
//               <div className="form-row">
//                 <div className="form-group">
//                   <label>Phone Number</label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={newStudent.phone}
//                     onChange={handleInputChange}
//                     placeholder="Enter phone number"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Room Number *</label>
//                   <input
//                     type="text"
//                     name="roomNumber"
//                     value={newStudent.roomNumber}
//                     onChange={handleInputChange}
//                     placeholder="Enter room number"
//                   />
//                 </div>
//               </div>

//               <div className="form-row">
//                 <div className="form-group">
//                   <label>Course</label>
//                   <input
//                     type="text"
//                     name="course"
//                     value={newStudent.course}
//                     onChange={handleInputChange}
//                     placeholder="Enter course name"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Year</label>
//                   <select
//                     name="year"
//                     value={newStudent.year}
//                     onChange={handleInputChange}
//                   >
//                     <option value="1st Year">1st Year</option>
//                     <option value="2nd Year">2nd Year</option>
//                     <option value="3rd Year">3rd Year</option>
//                     <option value="4th Year">4th Year</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label>Status</label>
//                 <select
//                   name="status"
//                   value={newStudent.status}
//                   onChange={handleInputChange}
//                 >
//                   <option value="Active">Active</option>
//                   <option value="Inactive">Inactive</option>
//                   <option value="Graduated">Graduated</option>
//                 </select>
//               </div>
//             </div>
//             <div className="modal-footer">
//               <button className="btn-secondary" onClick={handleCloseModal}>
//                 Cancel
//               </button>
//               <button 
//                 className="btn-primary"
//                 onClick={editingStudent ? handleUpdateStudent : handleAddStudent}
//               >
//                 {editingStudent ? 'Update Student' : 'Add Student'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StudentManagement;