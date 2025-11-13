import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import './RoomAllocation.css';

const RoomAllocation = () => {
  const [rooms, setRooms] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Mock data
    const mockRooms = [
      { id: '101', number: '101', capacity: 2, currentOccupants: 2, status: 'occupied', type: 'Standard' },
      { id: '102', number: '102', capacity: 2, currentOccupants: 1, status: 'partially-occupied', type: 'Standard' },
      { id: '103', number: '103', capacity: 2, currentOccupants: 0, status: 'available', type: 'Standard' },
    ];
    setRooms(mockRooms);
  }, []);

  const filteredRooms = rooms.filter(room => {
    if (filter === 'all') return true;
    return room.status === filter;
  }).filter(room => 
    room.number.toLowerCase().includes(searchTerm.toLowerCase())
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
          {filteredRooms.map(room => (
            <div key={room.id} className="room-card">
              <div className="room-header">
                <h3>Room {room.number}</h3>
                <span className={`status-badge status-${room.status}`}>
                  {room.status}
                </span>
              </div>
              <div className="room-details">
                <p><strong>Type:</strong> {room.type}</p>
                <p><strong>Capacity:</strong> {room.currentOccupants}/{room.capacity}</p>
                <p><strong>Status:</strong> {room.status}</p>
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
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default RoomAllocation;