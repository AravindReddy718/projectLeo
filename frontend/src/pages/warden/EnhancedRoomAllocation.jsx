import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import api from '../../services/api';
import './EnhancedRoomAllocation.css';

const EnhancedRoomAllocation = () => {
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('all');
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomStats, setRoomStats] = useState({});
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    block: '',
    floor: 1,
    roomType: 'double',
    capacity: 2,
    facilities: {
      hasAC: false,
      hasAttachedBathroom: true,
      hasBalcony: false,
      studyTables: 2,
      wardrobes: 2,
      beds: 2
    },
    rent: {
      monthly: 5000,
      security: 2000,
      maintenance: 500
    }
  });
  const [allocationData, setAllocationData] = useState({
    studentId: '',
    bedNumber: ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoomData();
    fetchStudents();
    fetchRoomStats();
  }, []);

  const fetchRoomData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/rooms');
      setRooms(response.data.rooms || []);
    } catch (error) {
      console.error('Error fetching room data:', error);
      alert(error.response?.data?.message || 'Failed to load room data');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students?limit=1000');
      setStudents(response.data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchRoomStats = async () => {
    try {
      const response = await api.get('/rooms/stats/overview');
      setRoomStats(response.data.overview || {});
    } catch (error) {
      console.error('Error fetching room stats:', error);
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/rooms', newRoom);
      if (response.data.success) {
        alert('Room added successfully!');
        setShowAddRoomModal(false);
        setNewRoom({
          roomNumber: '',
          block: '',
          floor: 1,
          roomType: 'double',
          capacity: 2,
          facilities: {
            hasAC: false,
            hasAttachedBathroom: true,
            hasBalcony: false,
            studyTables: 2,
            wardrobes: 2,
            beds: 2
          },
          rent: {
            monthly: 5000,
            security: 2000,
            maintenance: 500
          }
        });
        fetchRoomData();
        fetchRoomStats();
      }
    } catch (error) {
      console.error('Error adding room:', error);
      alert(error.response?.data?.message || 'Failed to add room');
    }
  };

  const handleAllocateStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/rooms/${selectedRoom._id}/allocate`, allocationData);
      if (response.data.success) {
        alert('Student allocated successfully!');
        setShowAllocateModal(false);
        setSelectedRoom(null);
        setAllocationData({ studentId: '', bedNumber: '' });
        fetchRoomData();
        fetchRoomStats();
      }
    } catch (error) {
      console.error('Error allocating student:', error);
      alert(error.response?.data?.message || 'Failed to allocate student');
    }
  };

  const handleDeallocateStudent = async (roomId, studentId) => {
    if (window.confirm('Are you sure you want to deallocate this student?')) {
      try {
        const response = await api.post(`/rooms/${roomId}/deallocate`, { studentId });
        if (response.data.success) {
          alert('Student deallocated successfully!');
          fetchRoomData();
          fetchRoomStats();
        }
      } catch (error) {
        console.error('Error deallocating student:', error);
        alert(error.response?.data?.message || 'Failed to deallocate student');
      }
    }
  };

  const getAvailableStudents = () => {
    return students.filter(student => 
      !rooms.some(room => 
        room.allocatedStudents?.some(allocation => 
          allocation.student._id === student._id && allocation.status === 'active'
        )
      )
    );
  };

  const getUniqueBlocks = () => {
    const blocks = [...new Set(rooms.map(room => room.block))];
    return blocks.sort();
  };

  const getUniqueFloors = () => {
    const floors = [...new Set(rooms.map(room => room.floor))];
    return floors.sort((a, b) => a - b);
  };

  const filteredRooms = rooms.filter(room => {
    const matchesFilter = filter === 'all' || 
      (filter === 'available' && room.currentOccupancy < room.capacity) ||
      (filter === 'occupied' && room.currentOccupancy >= room.capacity) ||
      (filter === 'maintenance' && room.status === 'maintenance');
    
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.block.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBlock = selectedBlock === 'all' || room.block === selectedBlock;
    const matchesFloor = selectedFloor === 'all' || room.floor.toString() === selectedFloor;
    
    return matchesFilter && matchesSearch && matchesBlock && matchesFloor;
  });

  const getRoomStatusClass = (room) => {
    if (room.status === 'maintenance') return 'maintenance';
    if (room.currentOccupancy >= room.capacity) return 'occupied';
    if (room.currentOccupancy > 0) return 'partially-occupied';
    return 'available';
  };

  const getRoomStatusText = (room) => {
    if (room.status === 'maintenance') return 'Maintenance';
    if (room.currentOccupancy >= room.capacity) return 'Full';
    if (room.currentOccupancy > 0) return 'Partial';
    return 'Available';
  };

  return (
    <Layout>
      <div className="enhanced-room-allocation">
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">Room Management & Allocation</h1>
            <p className="page-subtitle">Manage rooms and allocate students efficiently</p>
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddRoomModal(true)}
            >
              + Add New Room
            </button>
          </div>
        </div>

        {/* Room Statistics */}
        <div className="stats-grid">
          <div className="stat-card card-blue">
            <div className="stat-icon">🏠</div>
            <div className="stat-content">
              <h3>Total Rooms</h3>
              <p className="stat-amount">{roomStats.totalRooms || 0}</p>
            </div>
          </div>
          <div className="stat-card card-green">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>Available</h3>
              <p className="stat-amount">{roomStats.availableRooms || 0}</p>
            </div>
          </div>
          <div className="stat-card card-red">
            <div className="stat-icon">🔴</div>
            <div className="stat-content">
              <h3>Occupied</h3>
              <p className="stat-amount">{roomStats.occupiedRooms || 0}</p>
            </div>
          </div>
          <div className="stat-card card-yellow">
            <div className="stat-icon">🔧</div>
            <div className="stat-content">
              <h3>Maintenance</h3>
              <p className="stat-amount">{roomStats.maintenanceRooms || 0}</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search rooms by number or block..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <label>Status:</label>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All Rooms</option>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Block:</label>
              <select value={selectedBlock} onChange={(e) => setSelectedBlock(e.target.value)}>
                <option value="all">All Blocks</option>
                {getUniqueBlocks().map(block => (
                  <option key={block} value={block}>{block}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Floor:</label>
              <select value={selectedFloor} onChange={(e) => setSelectedFloor(e.target.value)}>
                <option value="all">All Floors</option>
                {getUniqueFloors().map(floor => (
                  <option key={floor} value={floor.toString()}>Floor {floor}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="rooms-grid">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading rooms...</p>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="no-rooms">
              <p>No rooms found matching your criteria</p>
            </div>
          ) : (
            filteredRooms.map(room => (
              <div key={room._id} className={`room-card ${getRoomStatusClass(room)}`}>
                <div className="room-header">
                  <div className="room-title">
                    <h3>Room {room.roomNumber}</h3>
                    <span className="room-block">Block {room.block}</span>
                  </div>
                  <span className={`status-badge status-${getRoomStatusClass(room)}`}>
                    {getRoomStatusText(room)}
                  </span>
                </div>

                <div className="room-details">
                  <div className="detail-row">
                    <span className="label">Floor:</span>
                    <span className="value">{room.floor}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Type:</span>
                    <span className="value">{room.roomType}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Occupancy:</span>
                    <span className="value">{room.currentOccupancy}/{room.capacity}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Rent:</span>
                    <span className="value">₹{room.rent?.monthly || 0}/month</span>
                  </div>
                </div>

                {room.allocatedStudents && room.allocatedStudents.length > 0 && (
                  <div className="allocated-students">
                    <h4>Current Students:</h4>
                    {room.allocatedStudents
                      .filter(allocation => allocation.status === 'active')
                      .map(allocation => (
                      <div key={allocation._id} className="student-item">
                        <div className="student-info">
                          <span className="student-name">
                            {allocation.student?.personalInfo?.firstName} {allocation.student?.personalInfo?.lastName}
                          </span>
                          <span className="student-id">({allocation.student?.studentId})</span>
                          <span className="bed-number">Bed: {allocation.bedNumber}</span>
                        </div>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeallocateStudent(room._id, allocation.student._id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="room-actions">
                  {room.currentOccupancy < room.capacity && room.status === 'available' && (
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setSelectedRoom(room);
                        setShowAllocateModal(true);
                      }}
                    >
                      Allocate Student
                    </button>
                  )}
                  <button className="btn btn-secondary btn-sm">
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Room Modal */}
        {showAddRoomModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Add New Room</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowAddRoomModal(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleAddRoom} className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Room Number *</label>
                    <input
                      type="text"
                      value={newRoom.roomNumber}
                      onChange={(e) => setNewRoom({...newRoom, roomNumber: e.target.value})}
                      required
                      placeholder="e.g., 101, A-201"
                    />
                  </div>
                  <div className="form-group">
                    <label>Block *</label>
                    <input
                      type="text"
                      value={newRoom.block}
                      onChange={(e) => setNewRoom({...newRoom, block: e.target.value})}
                      required
                      placeholder="e.g., A, B, C"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Floor *</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={newRoom.floor}
                      onChange={(e) => setNewRoom({...newRoom, floor: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Room Type *</label>
                    <select
                      value={newRoom.roomType}
                      onChange={(e) => {
                        const type = e.target.value;
                        const capacity = type === 'single' ? 1 : type === 'double' ? 2 : type === 'triple' ? 3 : 4;
                        setNewRoom({
                          ...newRoom, 
                          roomType: type, 
                          capacity,
                          facilities: {
                            ...newRoom.facilities,
                            beds: capacity,
                            studyTables: capacity,
                            wardrobes: capacity
                          }
                        });
                      }}
                    >
                      <option value="single">Single (1 bed)</option>
                      <option value="double">Double (2 beds)</option>
                      <option value="triple">Triple (3 beds)</option>
                      <option value="quad">Quad (4 beds)</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Monthly Rent (₹) *</label>
                    <input
                      type="number"
                      min="0"
                      value={newRoom.rent.monthly}
                      onChange={(e) => setNewRoom({
                        ...newRoom, 
                        rent: {...newRoom.rent, monthly: parseInt(e.target.value)}
                      })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Security Deposit (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={newRoom.rent.security}
                      onChange={(e) => setNewRoom({
                        ...newRoom, 
                        rent: {...newRoom.rent, security: parseInt(e.target.value)}
                      })}
                    />
                  </div>
                </div>

                <div className="facilities-section">
                  <h3>Facilities</h3>
                  <div className="checkbox-group">
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={newRoom.facilities.hasAC}
                        onChange={(e) => setNewRoom({
                          ...newRoom,
                          facilities: {...newRoom.facilities, hasAC: e.target.checked}
                        })}
                      />
                      Air Conditioning
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={newRoom.facilities.hasAttachedBathroom}
                        onChange={(e) => setNewRoom({
                          ...newRoom,
                          facilities: {...newRoom.facilities, hasAttachedBathroom: e.target.checked}
                        })}
                      />
                      Attached Bathroom
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={newRoom.facilities.hasBalcony}
                        onChange={(e) => setNewRoom({
                          ...newRoom,
                          facilities: {...newRoom.facilities, hasBalcony: e.target.checked}
                        })}
                      />
                      Balcony
                    </label>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddRoomModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Room
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Allocate Student Modal */}
        {showAllocateModal && selectedRoom && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Allocate Student to Room {selectedRoom.roomNumber}</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowAllocateModal(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleAllocateStudent} className="modal-body">
                <div className="form-group">
                  <label>Select Student *</label>
                  <select
                    value={allocationData.studentId}
                    onChange={(e) => setAllocationData({...allocationData, studentId: e.target.value})}
                    required
                  >
                    <option value="">Choose a student...</option>
                    {getAvailableStudents().map(student => (
                      <option key={student._id} value={student._id}>
                        {student.personalInfo?.firstName} {student.personalInfo?.lastName} ({student.studentId})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Bed Number (Optional)</label>
                  <select
                    value={allocationData.bedNumber}
                    onChange={(e) => setAllocationData({...allocationData, bedNumber: e.target.value})}
                  >
                    <option value="">Auto-assign bed</option>
                    {Array.from({length: selectedRoom.capacity}, (_, i) => `B${i + 1}`)
                      .filter(bed => !selectedRoom.allocatedStudents?.some(
                        allocation => allocation.bedNumber === bed && allocation.status === 'active'
                      ))
                      .map(bed => (
                        <option key={bed} value={bed}>{bed}</option>
                      ))}
                  </select>
                </div>

                <div className="room-info">
                  <h3>Room Information</h3>
                  <p><strong>Block:</strong> {selectedRoom.block}</p>
                  <p><strong>Floor:</strong> {selectedRoom.floor}</p>
                  <p><strong>Type:</strong> {selectedRoom.roomType}</p>
                  <p><strong>Available Beds:</strong> {selectedRoom.capacity - selectedRoom.currentOccupancy}</p>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAllocateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Allocate Student
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

export default EnhancedRoomAllocation;
