import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Notices.css';

export default function Notices() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([
    {
      id: 1,
      title: 'Hostel Fee Payment Reminder',
      content: 'All students are reminded to pay their hostel fees for November 2024 by the end of this month. Late payment will incur additional charges.',
      date: '2024-11-10',
      priority: 'high',
      category: 'Payment',
      author: 'Hostel Administration'
    },
    {
      id: 2,
      title: 'Mess Menu Changes',
      content: 'Due to festival celebrations, there will be special meals served on November 15th and 16th. Regular menu will resume from November 17th.',
      date: '2024-11-08',
      priority: 'medium',
      category: 'Mess',
      author: 'Mess Committee'
    },
    {
      id: 3,
      title: 'Room Inspection Schedule',
      content: 'Room inspections will be conducted from November 20th to November 25th. Please ensure your rooms are clean and tidy.',
      date: '2024-11-07',
      priority: 'medium',
      category: 'Maintenance',
      author: 'Warden Office'
    },
    {
      id: 4,
      title: 'Wi-Fi Maintenance',
      content: 'Wi-Fi services will be temporarily unavailable on November 18th from 2:00 AM to 6:00 AM for routine maintenance.',
      date: '2024-11-06',
      priority: 'low',
      category: 'Technical',
      author: 'IT Department'
    },
    {
      id: 5,
      title: 'Cultural Event Registration',
      content: 'Registration is now open for the annual cultural fest. Interested students can register at the hostel office by November 30th.',
      date: '2024-11-05',
      priority: 'medium',
      category: 'Events',
      author: 'Cultural Committee'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotices = notices.filter(notice => {
    const matchesFilter = filter === 'all' || notice.category.toLowerCase() === filter.toLowerCase();
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="notices-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/student/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>Notices & Announcements</h1>
      </div>

      <div className="notices-container">
        <div className="notices-controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search notices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-buttons">
            <button 
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={filter === 'payment' ? 'active' : ''}
              onClick={() => setFilter('payment')}
            >
              Payment
            </button>
            <button 
              className={filter === 'mess' ? 'active' : ''}
              onClick={() => setFilter('mess')}
            >
              Mess
            </button>
            <button 
              className={filter === 'maintenance' ? 'active' : ''}
              onClick={() => setFilter('maintenance')}
            >
              Maintenance
            </button>
            <button 
              className={filter === 'events' ? 'active' : ''}
              onClick={() => setFilter('events')}
            >
              Events
            </button>
          </div>
        </div>

        <div className="notices-list">
          {filteredNotices.length > 0 ? (
            filteredNotices.map(notice => (
              <div key={notice.id} className="notice-card">
                <div className="notice-header">
                  <div className="notice-meta">
                    <span 
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(notice.priority) }}
                    >
                      {notice.priority.toUpperCase()}
                    </span>
                    <span className="category-badge">{notice.category}</span>
                  </div>
                  <span className="notice-date">{formatDate(notice.date)}</span>
                </div>
                
                <h3 className="notice-title">{notice.title}</h3>
                <p className="notice-content">{notice.content}</p>
                
                <div className="notice-footer">
                  <span className="notice-author">By: {notice.author}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-notices">
              <p>No notices found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
