import React, { useState, useEffect } from 'react';
import paymentService from '../../services/paymentService';
import studentService from '../../services/studentService';
import './PaymentManagement.css';

export default function PaymentManagement() {
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  const [createForm, setCreateForm] = useState({
    student: '',
    type: 'hostel_fees',
    amount: '',
    dueDate: '',
    description: '',
    academicYear: '2024-25',
    semester: 1,
    lateFee: 0,
    discount: 0,
    notes: ''
  });

  const [paymentForm, setPaymentForm] = useState({
    paymentMethod: 'cash',
    transactionId: '',
    receiptNumber: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching payment management data...');
      
      // Fetch students and payments
      const studentsData = await studentService.getAllStudents();
      const paymentsData = await paymentService.getAllPayments();
      
      console.log('👥 Students:', studentsData);
      console.log('💳 Payments:', paymentsData);
      
      setStudents(Array.isArray(studentsData.students) ? studentsData.students : []);
      setPayments(Array.isArray(paymentsData.payments) ? paymentsData.payments : []);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      alert(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePayment = async (e) => {
    e.preventDefault();
    
    if (!createForm.student || !createForm.amount || !createForm.dueDate || !createForm.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setProcessing(true);
      console.log('💳 Creating new payment...', createForm);

      const result = await paymentService.createPayment({
        student: createForm.student,
        type: createForm.type,
        amount: parseFloat(createForm.amount),
        dueDate: createForm.dueDate,
        description: createForm.description,
        academicYear: createForm.academicYear,
        semester: parseInt(createForm.semester),
        lateFee: parseFloat(createForm.lateFee) || 0,
        discount: parseFloat(createForm.discount) || 0,
        notes: createForm.notes
      });

      console.log('✅ Payment created successfully:', result);
      
      alert('Payment due created successfully!');
      setShowCreateModal(false);
      resetCreateForm();
      fetchData();
    } catch (error) {
      console.error('❌ Error creating payment:', error);
      alert(error.message || 'Failed to create payment');
    } finally {
      setProcessing(false);
    }
  };

  const handleMarkAsPaid = async (e) => {
    e.preventDefault();
    
    if (!paymentForm.paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    try {
      setProcessing(true);
      console.log('💰 Marking payment as paid...', selectedPayment._id);

      const result = await paymentService.markPaymentAsPaid(selectedPayment._id, {
        paymentMethod: paymentForm.paymentMethod,
        transactionId: paymentForm.transactionId,
        receiptNumber: paymentForm.receiptNumber || `RCP-${Date.now()}`
      });

      console.log('✅ Payment marked as paid:', result);
      
      alert('Payment marked as paid successfully!');
      setShowPaymentModal(false);
      setSelectedPayment(null);
      resetPaymentForm();
      fetchData();
    } catch (error) {
      console.error('❌ Error marking payment as paid:', error);
      alert(error.message || 'Failed to mark payment as paid');
    } finally {
      setProcessing(false);
    }
  };

  const resetCreateForm = () => {
    setCreateForm({
      student: '',
      type: 'hostel_fees',
      amount: '',
      dueDate: '',
      description: '',
      academicYear: '2024-25',
      semester: 1,
      lateFee: 0,
      discount: 0,
      notes: ''
    });
  };

  const resetPaymentForm = () => {
    setPaymentForm({
      paymentMethod: 'cash',
      transactionId: '',
      receiptNumber: ''
    });
  };

  const openPaymentModal = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s._id === studentId);
    return student ? `${student.personalInfo?.firstName || ''} ${student.personalInfo?.lastName || ''}`.trim() : 'Unknown Student';
  };

  const pendingPayments = payments.filter(p => p.status === 'pending');
  const paidPayments = payments.filter(p => p.status === 'paid');
  const overduePayments = payments.filter(p => p.status === 'pending' && new Date(p.dueDate) < new Date());

  return (
    <div className="payment-management">
      <div className="page-header">
        <h1>Payment Management</h1>
        <p>Manage student payment dues and track payment status</p>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Pending Payments</h3>
          <div className="stat-value">{pendingPayments.length}</div>
          <div className="stat-amount">₹{pendingPayments.reduce((sum, p) => sum + p.totalAmount, 0)}</div>
        </div>
        <div className="stat-card">
          <h3>Paid Payments</h3>
          <div className="stat-value">{paidPayments.length}</div>
          <div className="stat-amount">₹{paidPayments.reduce((sum, p) => sum + p.totalAmount, 0)}</div>
        </div>
        <div className="stat-card overdue">
          <h3>Overdue Payments</h3>
          <div className="stat-value">{overduePayments.length}</div>
          <div className="stat-amount">₹{overduePayments.reduce((sum, p) => sum + p.totalAmount, 0)}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="actions-bar">
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          + Create Payment Due
        </button>
        <button 
          className="btn btn-secondary"
          onClick={fetchData}
          disabled={loading}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Payments Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Payment Details</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="loading-cell">
                  <div className="loading-spinner"></div>
                  Loading payments...
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-cell">
                  No payments found
                </td>
              </tr>
            ) : (
              payments.map(payment => (
                <tr key={payment._id}>
                  <td>
                    <div className="student-info">
                      <strong>{getStudentName(payment.student?._id || payment.student)}</strong>
                      <small>{payment.student?.studentId}</small>
                    </div>
                  </td>
                  <td>
                    <div className="payment-info">
                      <strong>{payment.description}</strong>
                      <small>{payment.type.replace('_', ' ').toUpperCase()}</small>
                    </div>
                  </td>
                  <td>
                    <div className="amount-info">
                      <strong>₹{payment.totalAmount}</strong>
                      {payment.lateFee > 0 && <small>Late Fee: ₹{payment.lateFee}</small>}
                      {payment.discount > 0 && <small>Discount: ₹{payment.discount}</small>}
                    </div>
                  </td>
                  <td>
                    <div className="date-info">
                      {new Date(payment.dueDate).toLocaleDateString()}
                      {new Date(payment.dueDate) < new Date() && payment.status === 'pending' && (
                        <span className="overdue-badge">OVERDUE</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${payment.status}`}>
                      {payment.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {payment.status === 'pending' && (
                        <button 
                          className="btn btn-sm btn-success"
                          onClick={() => openPaymentModal(payment)}
                        >
                          Mark Paid
                        </button>
                      )}
                      {payment.status === 'paid' && (
                        <button 
                          className="btn btn-sm btn-outline"
                          onClick={() => alert('Receipt functionality coming soon!')}
                        >
                          Receipt
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Payment Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Create Payment Due</h3>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreatePayment}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Student *</label>
                    <select
                      value={createForm.student}
                      onChange={(e) => setCreateForm({...createForm, student: e.target.value})}
                      required
                    >
                      <option value="">Select Student</option>
                      {students.map(student => (
                        <option key={student._id} value={student._id}>
                          {student.personalInfo?.firstName} {student.personalInfo?.lastName} ({student.studentId})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Payment Type *</label>
                    <select
                      value={createForm.type}
                      onChange={(e) => setCreateForm({...createForm, type: e.target.value})}
                      required
                    >
                      <option value="hostel_fees">Hostel Fees</option>
                      <option value="mess_fees">Mess Fees</option>
                      <option value="electricity">Electricity</option>
                      <option value="water">Water</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="fine">Fine</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Amount *</label>
                    <input
                      type="number"
                      value={createForm.amount}
                      onChange={(e) => setCreateForm({...createForm, amount: e.target.value})}
                      placeholder="Enter amount"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="form-group">
                    <label>Due Date *</label>
                    <input
                      type="date"
                      value={createForm.dueDate}
                      onChange={(e) => setCreateForm({...createForm, dueDate: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Academic Year</label>
                    <input
                      type="text"
                      value={createForm.academicYear}
                      onChange={(e) => setCreateForm({...createForm, academicYear: e.target.value})}
                      placeholder="2024-25"
                    />
                  </div>

                  <div className="form-group">
                    <label>Semester</label>
                    <select
                      value={createForm.semester}
                      onChange={(e) => setCreateForm({...createForm, semester: e.target.value})}
                    >
                      {[1,2,3,4,5,6,7,8].map(sem => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Late Fee</label>
                    <input
                      type="number"
                      value={createForm.lateFee}
                      onChange={(e) => setCreateForm({...createForm, lateFee: e.target.value})}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="form-group">
                    <label>Discount</label>
                    <input
                      type="number"
                      value={createForm.discount}
                      onChange={(e) => setCreateForm({...createForm, discount: e.target.value})}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                    placeholder="Enter payment description"
                    required
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    value={createForm.notes}
                    onChange={(e) => setCreateForm({...createForm, notes: e.target.value})}
                    placeholder="Additional notes (optional)"
                    rows="2"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={processing}>
                  {processing ? 'Creating...' : 'Create Payment Due'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mark as Paid Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Mark Payment as Paid</h3>
              <button className="modal-close" onClick={() => setShowPaymentModal(false)}>×</button>
            </div>
            <form onSubmit={handleMarkAsPaid}>
              <div className="modal-body">
                <div className="payment-summary">
                  <h4>Payment Details</h4>
                  <p><strong>Student:</strong> {getStudentName(selectedPayment.student?._id || selectedPayment.student)}</p>
                  <p><strong>Description:</strong> {selectedPayment.description}</p>
                  <p><strong>Amount:</strong> ₹{selectedPayment.totalAmount}</p>
                </div>

                <div className="form-group">
                  <label>Payment Method *</label>
                  <select
                    value={paymentForm.paymentMethod}
                    onChange={(e) => setPaymentForm({...paymentForm, paymentMethod: e.target.value})}
                    required
                  >
                    <option value="cash">Cash</option>
                    <option value="online">Online</option>
                    <option value="cheque">Cheque</option>
                    <option value="dd">Demand Draft</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Transaction ID</label>
                  <input
                    type="text"
                    value={paymentForm.transactionId}
                    onChange={(e) => setPaymentForm({...paymentForm, transactionId: e.target.value})}
                    placeholder="Enter transaction ID (optional)"
                  />
                </div>

                <div className="form-group">
                  <label>Receipt Number</label>
                  <input
                    type="text"
                    value={paymentForm.receiptNumber}
                    onChange={(e) => setPaymentForm({...paymentForm, receiptNumber: e.target.value})}
                    placeholder="Auto-generated if empty"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPaymentModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success" disabled={processing}>
                  {processing ? 'Processing...' : 'Mark as Paid'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
