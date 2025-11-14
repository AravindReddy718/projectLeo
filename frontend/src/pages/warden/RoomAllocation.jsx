import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import api from '../../services/api';
import './RoomAllocation.css';

const RoomAllocation = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoomData();
  }, []);

  const fetchRoomData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/room-occupancy');
      const roomDetails = response.data.roomDetails || [];
      
      // Transform room details into room cards
      const roomsList = roomDetails.map(room => {
        const roomNumber = room._id?.roomNumber || 'N/A';
        const block = room._id?.block || 'N/A';
        const count = room.count || 0;
        const capacity = 2; // Assuming standard capacity, can be made dynamic
        
        let status = 'available';
        if (count >= capacity) status = 'occupied';
        else if (count > 0) status = 'partially-occupied';
        
        return {
          id: `${block}-${roomNumber}`,
          number: roomNumber,
          block: block,
          capacity: capacity,
          currentOccupants: count,
          status: status,
          type: 'Standard',
          students: room.students || []
        };
      });
      
      setRooms(roomsList);
    } catch (error) {
      console.error('Error fetching room data:', error);
      alert(error.response?.data?.message || 'Failed to load room data');
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = rooms.filter(room => {
    if (filter === 'all') return true;
    return room.status === filter;
  }).filter(room => 
    room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.block.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="room-allocation">
        <div className="page-header">
          
          <h1 className="page-title">Room Allocation</h1>
        </div>

        {/* Room Stats */}
        <div className="stats-grid">
          <div className="stat-card card-blue">
            <h3>Total Rooms</h3>
            <p className="stat-amount">{rooms.length}</p>
          </div>
          <div className="stat-card card-green">
            <h3>Available</h3>
            <p className="stat-amount">{rooms.filter(r => r.status === 'available').length}</p>
          </div>
          <div className="stat-card card-red">
            <h3>Occupied</h3>
            <p className="stat-amount">{rooms.filter(r => r.status === 'occupied').length}</p>
          </div>
          <div className="stat-card card-yellow">
            <h3>Partial</h3>
            <p className="stat-amount">{rooms.filter(r => r.status === 'partially-occupied').length}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search rooms..."
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
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="rooms-grid">
          {loading ? (
            <div className="loading-container">
              <p>Loading rooms...</p>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="no-rooms">
              <p>No rooms found</p>
            </div>
          ) : (
            filteredRooms.map(room => (
              <div key={room.id} className="room-card">
                <div className="room-header">
                  <h3>Room {room.number} - {room.block}</h3>
                  <span className={`status-badge status-${room.status}`}>
                    {room.status.replace('-', ' ')}
                  </span>
                </div>
                <div className="room-details">
                  <p><strong>Block:</strong> {room.block}</p>
                  <p><strong>Type:</strong> {room.type}</p>
                  <p><strong>Occupancy:</strong> {room.currentOccupants}/{room.capacity}</p>
                  <p><strong>Status:</strong> {room.status.replace('-', ' ')}</p>
                  {room.students && room.students.length > 0 && (
                    <p><strong>Students:</strong> {room.students.length}</p>
                  )}
                </div>
                <div className="room-actions">
                  <button className="btn btn-primary btn-sm">
                    Allocate Student
                  </button>
                  <button className="btn btn-secondary btn-sm">
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RoomAllocation;