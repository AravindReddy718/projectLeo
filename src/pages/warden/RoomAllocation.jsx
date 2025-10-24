import React, { useState, useEffect } from 'react';
import './RoomAllocation.css';

const RoomAllocation = () => {
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [showVacateModal, setShowVacateModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockRooms = [
      { id: '101', number: '101', capacity: 2, currentOccupants: 2, status: 'occupied', type: 'Standard', floor: '1', wing: 'A' },
      { id: '102', number: '102', capacity: 2, currentOccupants: 1, status: 'partially-occupied', type: 'Standard', floor: '1', wing: 'A' },
      { id: '103', number: '103', capacity: 2, currentOccupants: 0, status: 'available', type: 'Standard', floor: '1', wing: 'A' },
      { id: '201', number: '201', capacity: 3, currentOccupants: 3, status: 'occupied', type: 'Deluxe', floor: '2', wing: 'B' },
      { id: '202', number: '202', capacity: 3, currentOccupants: 0, status: 'available', type: 'Deluxe', floor: '2', wing: 'B' },
      { id: '301', number: '301', capacity: 1, currentOccupants: 1, status: 'occupied', type: 'Single', floor: '3', wing: 'C' },
      { id: '302', number: '302', capacity: 1, currentOccupants: 0, status: 'available', type: 'Single', floor: '3', wing: 'C' },
    ];

    const mockStudents = [
      { id: 'STU001', name: 'John Doe', email: 'john@email.com', course: 'Computer Science', year: '3rd', status: 'unallocated' },
      { id: 'STU002', name: 'Jane Smith', email: 'jane@email.com', course: 'Electrical Engineering', year: '2nd', status: 'unallocated' },
      { id: 'STU003', name: 'Mike Johnson', email: 'mike@email.com', course: 'Mechanical Engineering', year: '1st', status: 'unallocated' },
      { id: 'STU004', name: 'Sarah Wilson', email: 'sarah@email.com', course: 'Civil Engineering', year: '4th', status: 'allocated', room: '101' },
      { id: 'STU005', name: 'David Brown', email: 'david@email.com', course: 'Chemical Engineering', year: '2nd', status: 'allocated', room: '101' },
    ];

    setRooms(mockRooms);
    setStudents(mockStudents);
  }, []);

  const filteredRooms = rooms.filter(room => {
    if (filter === 'all') return true;
    return room.status === filter;
  }).filter(room => 
    room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.wing.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unallocatedStudents = students.filter(student => student.status === 'unallocated');

  const handleAllocateRoom = (room) => {
    setSelectedRoom(room);
    setShowAllocationModal(true);
  };

  const handleVacateRoom = (room) => {
    setSelectedRoom(room);
    setShowVacateModal(true);
  };

  const confirmAllocation = () => {
    if (selectedStudent && selectedRoom) {
      const updatedRooms = rooms.map(room =>
        room.id === selectedRoom.id
          ? { ...room, currentOccupants: room.currentOccupants + 1, status: room.capacity === room.currentOccupants + 1 ? 'occupied' : 'partially-occupied' }
          : room
      );

      const updatedStudents = students.map(student =>
        student.id === selectedStudent
          ? { ...student, status: 'allocated', room: selectedRoom.number }
          : student
      );

      setRooms(updatedRooms);
      setStudents(updatedStudents);
      setShowAllocationModal(false);
      setSelectedStudent('');
      setSelectedRoom(null);
    }
  };

  const confirmVacation = () => {
    if (selectedRoom) {
      const updatedRooms = rooms.map(room =>
        room.id === selectedRoom.id
          ? { ...room, currentOccupants: room.currentOccupants - 1, status: room.currentOccupants - 1 === 0 ? 'available' : 'partially-occupied' }
          : room
      );

      const updatedStudents = students.map(student =>
        student.room === selectedRoom.number
          ? { ...student, status: 'unallocated', room: '' }
          : student
      );

      setRooms(updatedRooms);
      setStudents(updatedStudents);
      setShowVacateModal(false);
      setSelectedRoom(null);
    }
  };

  const getRoomStatus = (room) => {
    const statusConfig = {
      available: { class: 'status-available', text: 'Available', icon: '🟢' },
      occupied: { class: 'status-occupied', text: 'Occupied', icon: '🔴' },
      'partially-occupied': { class: 'status-partial', text: 'Partial', icon: '🟡' }
    };
    return statusConfig[room.status] || statusConfig.available;
  };

  const getRoomOccupants = (roomNumber) => {
    return students.filter(student => student.room === roomNumber);
  };

  return (
    <div className="room-allocation">
      <div className="room-header">
        <h2>Room Allocation System</h2>
        <div className="header-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by room number or wing..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Rooms
            </button>
            <button 
              className={`filter-tab ${filter === 'available' ? 'active' : ''}`}
              onClick={() => setFilter('available')}
            >
              Available
            </button>
            <button 
              className={`filter-tab ${filter === 'occupied' ? 'active' : ''}`}
              onClick={() => setFilter('occupied')}
            >
              Occupied
            </button>
            <button 
              className={`filter-tab ${filter === 'partially-occupied' ? 'active' : ''}`}
              onClick={() => setFilter('partially-occupied')}
            >
              Partial
            </button>
          </div>
        </div>
      </div>

      <div className="room-stats">
        <div className="stat-item">
          <span className="stat-number">{rooms.filter(r => r.status === 'available').length}</span>
          <span className="stat-label">Available</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{rooms.filter(r => r.status === 'occupied').length}</span>
          <span className="stat-label">Occupied</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{rooms.filter(r => r.status === 'partially-occupied').length}</span>
          <span className="stat-label">Partial</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{unallocatedStudents.length}</span>
          <span className="stat-label">Unallocated Students</span>
        </div>
      </div>

      <div className="rooms-grid">
        {filteredRooms.map(room => {
          const status = getRoomStatus(room);
          const occupants = getRoomOccupants(room.number);
          
          return (
            <div key={room.id} className="room-card">
              <div className="room-header">
                <div className="room-info">
                  <h3>Room {room.number}</h3>
                  <span className="room-type">{room.type}</span>
                </div>
                <div className={`room-status ${status.class}`}>
                  <span className="status-icon">{status.icon}</span>
                  <span className="status-text">{status.text}</span>
                </div>
              </div>

              <div className="room-details">
                <div className="detail-item">
                  <span className="label">Wing:</span>
                  <span className="value">{room.wing}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Floor:</span>
                  <span className="value">{room.floor}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Capacity:</span>
                  <span className="value">{room.currentOccupants}/{room.capacity}</span>
                </div>
              </div>

              {occupants.length > 0 && (
                <div className="occupants-list">
                  <h4>Current Occupants:</h4>
                  {occupants.map(occupant => (
                    <div key={occupant.id} className="occupant">
                      <span className="occupant-name">{occupant.name}</span>
                      <span className="occupant-course">{occupant.course}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="room-actions">
                {room.status !== 'occupied' && room.currentOccupants < room.capacity && (
                  <button 
                    className="btn-primary btn-sm"
                    onClick={() => handleAllocateRoom(room)}
                  >
                    Allocate Student
                  </button>
                )}
                {room.currentOccupants > 0 && (
                  <button 
                    className="btn-warning btn-sm"
                    onClick={() => handleVacateRoom(room)}
                  >
                    Vacate Room
                  </button>
                )}
                <button className="btn-secondary btn-sm">
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Allocation Modal */}
      {showAllocationModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Allocate Student to Room {selectedRoom?.number}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAllocationModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="room-info-card">
                <h4>Room Information</h4>
                <p><strong>Type:</strong> {selectedRoom?.type}</p>
                <p><strong>Capacity:</strong> {selectedRoom?.capacity}</p>
                <p><strong>Current Occupants:</strong> {selectedRoom?.currentOccupants}</p>
                <p><strong>Wing:</strong> {selectedRoom?.wing}, Floor: {selectedRoom?.floor}</p>
              </div>
              
              <div className="student-selection">
                <label htmlFor="studentSelect">Select Student:</label>
                <select
                  id="studentSelect"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                >
                  <option value="">Choose a student...</option>
                  {unallocatedStudents.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} - {student.course} ({student.year} Year)
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowAllocationModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={confirmAllocation}
                disabled={!selectedStudent}
              >
                Confirm Allocation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vacate Modal */}
      {showVacateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Vacate Room {selectedRoom?.number}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowVacateModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="warning-message">
                <span className="warning-icon">⚠️</span>
                <p>This action will remove all students from Room {selectedRoom?.number}. Are you sure you want to proceed?</p>
              </div>
              <div className="current-occupants">
                <h4>Current Occupants:</h4>
                {getRoomOccupants(selectedRoom?.number).map(occupant => (
                  <div key={occupant.id} className="occupant-item">
                    <span>{occupant.name}</span>
                    <span>{occupant.course}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowVacateModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-danger"
                onClick={confirmVacation}
              >
                Confirm Vacation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomAllocation;