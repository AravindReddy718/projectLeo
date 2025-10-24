import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import ComplaintManagement from './ComplaintManagement';
import RoomAllocation from './RoomAllocation';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    pendingComplaints: 0,
    totalExpenses: 0,
    activeStaff: 0,
    occupiedRooms: 0,
    availableRooms: 0
  });

  // Staff management state
  const [staff, setStaff] = useState([
    {
      id: 'STF001',
      name: 'Raj Kumar',
      role: 'Attendant',
      dailyWage: 500,
      attendance: '25/30 days',
      monthlySalary: 15000,
      lastPaid: '2024-09-30',
      status: 'active'
    },
    {
      id: 'STF002',
      name: 'Suresh Patel',
      role: 'Cleaner',
      dailyWage: 400,
      attendance: '28/30 days',
      monthlySalary: 11200,
      lastPaid: '2024-09-30',
      status: 'active'
    }
  ]);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    paymentMethod: 'bank_transfer',
    paymentDate: new Date().toISOString().split('T')[0]
  });
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    setDashboardStats({
      totalStudents: 245,
      pendingComplaints: 12,
      totalExpenses: 15420,
      activeStaff: staff.length,
      occupiedRooms: 180,
      availableRooms: 45
    });
  }, [staff]);

  // Handle pay salary
  const handlePaySalary = (staffMember) => {
    setSelectedStaff(staffMember);
    setPaymentData({
      amount: staffMember.monthlySalary,
      paymentMethod: 'bank_transfer',
      paymentDate: new Date().toISOString().split('T')[0]
    });
    setShowPaymentModal(true);
  };

  // Process payment
  const processPayment = () => {
    if (!selectedStaff) return;

    // Update staff record
    const updatedStaff = staff.map(s =>
      s.id === selectedStaff.id
        ? { ...s, lastPaid: paymentData.paymentDate }
        : s
    );

    setStaff(updatedStaff);

    // Generate receipt data
    const receipt = {
      receiptNo: 'RCP' + Date.now(),
      staff: selectedStaff,
      payment: paymentData,
      issuedDate: new Date().toISOString().split('T')[0],
      issuedBy: 'Warden'
    };

    setReceiptData(receipt);
    setShowPaymentModal(false);
    setShowReceipt(true);

    // Update dashboard expenses
    setDashboardStats(prev => ({
      ...prev,
      totalExpenses: prev.totalExpenses + paymentData.amount
    }));
  };

  // Print receipt
  const printReceipt = () => {
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Salary Receipt - ${receiptData.staff.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .receipt { border: 2px solid #000; padding: 20px; max-width: 500px; }
            .header { text-align: center; margin-bottom: 20px; }
            .details { margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 8px 0; }
            .total { font-weight: bold; border-top: 1px solid #000; padding-top: 10px; }
            .footer { text-align: center; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h2>HOSTEL MANAGEMENT SYSTEM</h2>
              <h3>Salary Payment Receipt</h3>
            </div>
            <div class="details">
              <div class="detail-row">
                <strong>Receipt No:</strong>
                <span>${receiptData.receiptNo}</span>
              </div>
              <div class="detail-row">
                <strong>Date:</strong>
                <span>${receiptData.issuedDate}</span>
              </div>
              <div class="detail-row">
                <strong>Staff Name:</strong>
                <span>${receiptData.staff.name}</span>
              </div>
              <div class="detail-row">
                <strong>Staff ID:</strong>
                <span>${receiptData.staff.id}</span>
              </div>
              <div class="detail-row">
                <strong>Role:</strong>
                <span>${receiptData.staff.role}</span>
              </div>
              <div class="detail-row">
                <strong>Payment Method:</strong>
                <span>${receiptData.payment.paymentMethod.toUpperCase()}</span>
              </div>
              <div class="detail-row total">
                <strong>Amount Paid:</strong>
                <span>₹${receiptData.payment.amount.toLocaleString()}</span>
              </div>
            </div>
            <div class="footer">
              <p>_________________________</p>
              <p>Authorized Signature</p>
              <p>Issued By: ${receiptData.issuedBy}</p>
            </div>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  // Mark attendance
  const handleMarkAttendance = (staffId) => {
    const updatedStaff = staff.map(s =>
      s.id === staffId
        ? { ...s, attendance: '30/30 days' }
        : s
    );
    setStaff(updatedStaff);
    alert('Attendance marked successfully!');
  };

  const renderDashboard = () => (
    <div className="dashboard-content">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon students">👨‍🎓</div>
          <div className="stat-info">
            <h3>Total Students</h3>
            <p className="stat-number">{dashboardStats.totalStudents}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon complaints">⚠️</div>
          <div className="stat-info">
            <h3>Pending Complaints</h3>
            <p className="stat-number">{dashboardStats.pendingComplaints}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon expenses">💰</div>
          <div className="stat-info">
            <h3>Monthly Expenses</h3>
            <p className="stat-number">₹{dashboardStats.totalExpenses.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon staff">👥</div>
          <div className="stat-info">
            <h3>Active Staff</h3>
            <p className="stat-number">{dashboardStats.activeStaff}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon rooms">🏠</div>
          <div className="stat-info">
            <h3>Occupied Rooms</h3>
            <p className="stat-number">{dashboardStats.occupiedRooms}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon available">🟢</div>
          <div className="stat-info">
            <h3>Available Rooms</h3>
            <p className="stat-number">{dashboardStats.availableRooms}</p>
          </div>
        </div>
      </div>

      <div className="recent-activities">
        <h3>Recent Activities</h3>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-badge new">New</span>
            <span>New complaint #CMP-0012 submitted by Student A</span>
            <span className="activity-time">2 hours ago</span>
          </div>
          <div className="activity-item">
            <span className="activity-badge room">Room</span>
            <span>Student John Doe allocated to Room 205</span>
            <span className="activity-time">3 hours ago</span>
          </div>
          <div className="activity-item">
            <span className="activity-badge resolved">Resolved</span>
            <span>Complaint #CMP-0011 marked as resolved</span>
            <span className="activity-time">5 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="students-content">
      <div className="content-header">
        <h2>Student Management</h2>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Room No.</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>STU001</td>
              <td>John Doe</td>
              <td>101</td>
              <td>john@email.com</td>
              <td><span className="status-active">Active</span></td>
              <td>
                <button className="btn-sm btn-edit">Edit</button>
                <button className="btn-sm btn-delete">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderExpenses = () => (
    <div className="expenses-content">
      <div className="content-header">
        <h2>Expense Management</h2>
        <button className="btn-primary">Add Expense</button>
      </div>
      <div className="expense-summary">
        <div className="summary-card">
          <h4>Monthly Total</h4>
          <p className="amount">₹{dashboardStats.totalExpenses.toLocaleString()}</p>
        </div>
        <div className="summary-card">
          <h4>Staff Salary</h4>
          <p className="amount">₹{staff.reduce((sum, s) => sum + s.monthlySalary, 0).toLocaleString()}</p>
        </div>
        <div className="summary-card">
          <h4>Maintenance</h4>
          <p className="amount">₹8,200</p>
        </div>
        <div className="summary-card">
          <h4>Utilities</h4>
          <p className="amount">₹3,500</p>
        </div>
      </div>
    </div>
  );

  const renderFinancials = () => (
    <div className="financials-content">
      <div className="content-header">
        <h2>Financial Statements</h2>
        <div className="header-actions">
          <select className="select-month">
            <option>October 2024</option>
            <option>September 2024</option>
            <option>August 2024</option>
          </select>
          <button className="btn-primary">Generate Annual Report</button>
        </div>
      </div>
      <div className="financial-stats">
        {/* Financial statements content */}
      </div>
    </div>
  );

  const renderStaff = () => (
    <div className="staff-content">
      <div className="content-header">
        <h2>Staff Management</h2>
        
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Staff ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Daily Wage</th>
              <th>Monthly Salary</th>
              <th>Attendance</th>
              <th>Last Paid</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(staffMember => (
              <tr key={staffMember.id}>
                <td>{staffMember.id}</td>
                <td>{staffMember.name}</td>
                <td>{staffMember.role}</td>
                <td>₹{staffMember.dailyWage}</td>
                <td>₹{staffMember.monthlySalary.toLocaleString()}</td>
                <td>{staffMember.attendance}</td>
                <td>{staffMember.lastPaid}</td>
                <td>
                  
                  <button 
                    className="btn-sm btn-success"
                    onClick={() => handlePaySalary(staffMember)}
                  >
                    Pay Salary
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedStaff && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Process Salary Payment</h3>
              <button 
                className="modal-close"
                onClick={() => setShowPaymentModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="payment-info">
                <h4>Payment Details for {selectedStaff.name}</h4>
                <p><strong>Staff ID:</strong> {selectedStaff.id}</p>
                <p><strong>Role:</strong> {selectedStaff.role}</p>
                <p><strong>Monthly Salary:</strong> ₹{selectedStaff.monthlySalary.toLocaleString()}</p>
              </div>

              <div className="form-group">
                <label>Payment Amount (₹)</label>
                <input
                  type="number"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({...paymentData, amount: parseInt(e.target.value) || 0})}
                />
              </div>

              <div className="form-group">
                <label>Payment Method</label>
                <select
                  value={paymentData.paymentMethod}
                  onChange={(e) => setPaymentData({...paymentData, paymentMethod: e.target.value})}
                >
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>

              <div className="form-group">
                <label>Payment Date</label>
                <input
                  type="date"
                  value={paymentData.paymentDate}
                  onChange={(e) => setPaymentData({...paymentData, paymentDate: e.target.value})}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={processPayment}
              >
                Process Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && receiptData && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Payment Receipt</h3>
              <button 
                className="modal-close"
                onClick={() => setShowReceipt(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="receipt-content">
                <div className="receipt-header">
                  <h3>HOSTEL MANAGEMENT SYSTEM</h3>
                  <p>Salary Payment Receipt</p>
                </div>
                
                <div className="receipt-details">
                  <p><strong>Receipt No:</strong> {receiptData.receiptNo}</p>
                  <p><strong>Date:</strong> {receiptData.issuedDate}</p>
                  <p><strong>Staff Name:</strong> {receiptData.staff.name}</p>
                  <p><strong>Staff ID:</strong> {receiptData.staff.id}</p>
                  <p><strong>Role:</strong> {receiptData.staff.role}</p>
                  <p><strong>Payment Method:</strong> {receiptData.payment.paymentMethod.toUpperCase()}</p>
                  <p className="total-amount"><strong>Amount Paid:</strong> ₹{receiptData.payment.amount.toLocaleString()}</p>
                </div>

                <div className="receipt-footer">
                  <p>_________________________</p>
                  <p>Authorized Signature</p>
                  <p>Issued By: {receiptData.issuedBy}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowReceipt(false)}
              >
                Close
              </button>
              <button 
                className="btn-primary"
                onClick={printReceipt}
              >
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="warden-dashboard">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Warden Dashboard</h2>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-item ${activeTab === 'complaints' ? 'active' : ''}`}
            onClick={() => setActiveTab('complaints')}
          >
            ⚠️ Complaints
          </button>
          <button 
            className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            👨‍🎓 Students
          </button>
          <button 
            className={`nav-item ${activeTab === 'rooms' ? 'active' : ''}`}
            onClick={() => setActiveTab('rooms')}
          >
            🏠 Room Allocation
          </button>
          <button 
            className={`nav-item ${activeTab === 'staff' ? 'active' : ''}`}
            onClick={() => setActiveTab('staff')}
          >
            👥 Staff
          </button>
          <button 
            className={`nav-item ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('expenses')}
          >
            💰 Expenses
          </button>
          <button 
            className={`nav-item ${activeTab === 'financials' ? 'active' : ''}`}
            onClick={() => setActiveTab('financials')}
          >
            📈 Financials
          </button>
        </nav>
      </div>

      <div className="main-content">
        <header className="top-header">
          <div className="header-left">
            <h1>Hostel Management System</h1>
          </div>
          <div className="header-right">
            <div className="user-profile">
              <span>Warden</span>
              <div className="avatar">W</div>
            </div>
          </div>
        </header>

        <div className="content-area">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'complaints' && <ComplaintManagement />}
          {activeTab === 'students' && renderStudents()}
          {activeTab === 'rooms' && <RoomAllocation />}
          {activeTab === 'staff' && renderStaff()}
          {activeTab === 'expenses' && renderExpenses()}
          {activeTab === 'financials' && renderFinancials()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;