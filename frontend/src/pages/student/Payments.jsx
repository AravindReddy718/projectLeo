import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import studentService from '../../services/studentService';
import './Payments.css';

export default function Payments() {
  const [dues, setDues] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch student profile for receipt data
      const profile = await studentService.getOwnProfile();
      setStudentInfo(profile);
      
      // Fetch dues and payment history
      const duesData = await studentService.getPaymentDues();
      const historyData = await studentService.getPaymentHistory();
      
      setDues(Array.isArray(duesData) ? duesData : (duesData.payments || []));
      setPaymentHistory(Array.isArray(historyData) ? historyData : (historyData.payments || []));
    } catch (error) {
      console.error('Error fetching payment data:', error);
      alert(error.message || 'Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (due, item = null) => {
    if (item) {
      setSelectedBill({ 
        ...item, 
        month: due.month,
        paymentId: due._id,
        billType: item.id
      });
    } else {
      // Pay all pending items
      const pendingItems = due.items.filter(i => i.status === 'pending');
      setSelectedBill({ 
        id: 'all', 
        name: 'All Bills', 
        amount: pendingItems.reduce((sum, i) => sum + i.amount, 0),
        month: due.month,
        paymentId: due._id,
        billType: 'all'
      });
    }
    setSelectedMethod(null);
    setShowModal(true);
  };

  const processPayment = async () => {
    if (!selectedMethod || !selectedBill) return;
    
    try {
      setProcessing(true);

      const result = await studentService.processPayment({
        amount: selectedBill.amount,
        description: `${selectedBill.name} - ${selectedBill.month}`,
        paymentMethod: selectedMethod,
        billType: selectedBill.billType
      });

      // Refresh data
      await fetchData();

      // Generate receipt data
      setReceiptData({
        transactionId: result.transactionId || result._id,
        date: new Date().toISOString().split('T')[0],
        amount: selectedBill.amount,
        description: `${selectedBill.name} - ${selectedBill.month}`,
        method: selectedMethod,
        status: 'success',
        studentName: studentInfo ? `${studentInfo.personalInfo?.firstName || ''} ${studentInfo.personalInfo?.lastName || ''}`.trim() : 'Student',
        rollNumber: studentInfo?.academicInfo?.rollNumber || studentInfo?.studentId || 'N/A',
        hall: studentInfo?.hostelInfo?.block || 'N/A',
        roomNo: studentInfo?.hostelInfo?.roomNumber || 'N/A'
      });

      setShowModal(false);
      setShowReceipt(true);
    } catch (error) {
      console.error('Payment error:', error);
      alert(error.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const printReceipt = () => {
    window.print();
  };

  const getDueItems = (due) => {
    // Handle different payment structures
    if (due.items && Array.isArray(due.items)) {
      return due.items;
    }
    // Fallback for old structure
    return [
      { id: 'messCharges', name: 'Mess Charges', amount: due.messCharges?.amount || 0, status: due.messCharges?.status || 'pending' },
      { id: 'roomRent', name: 'Room Rent', amount: due.roomRent?.amount || 0, status: due.roomRent?.status || 'pending' },
      { id: 'amenitiesFee', name: 'Amenities Fee', amount: due.amenitiesFee?.amount || 0, status: due.amenitiesFee?.status || 'pending' },
      ...(due.otherCharges?.amount > 0 ? [{ 
        id: 'otherCharges', 
        name: due.otherCharges.description || 'Other Charges', 
        amount: due.otherCharges.amount, 
        status: due.otherCharges.status 
      }] : [])
    ];
  };

  const totalPending = dues.reduce((sum, due) => 
    sum + getDueItems(due).filter(item => item.status === 'pending').reduce((sum, item) => sum + item.amount, 0), 0
  );

  return (
    <Layout>
      <div className="payments">
        <h1>Payments & Dues</h1>

        {/* Summary */}
        <div className="summary">
          <div className="summary-item">
            <span>Pending Dues</span>
            <strong>₹{totalPending}</strong>
          </div>
          <div className="summary-item">
            <span>Pending Bills</span>
            <strong>{dues.flatMap(d => getDueItems(d)).filter(i => i.status === 'pending').length}</strong>
          </div>
        </div>

        {/* Current Dues */}
        <div className="dues">
          <h2>Current Dues</h2>
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading dues...</p>
            </div>
          ) : dues.filter(d => d.status !== 'paid').length === 0 ? (
            <p className="no-dues">No pending dues. All bills are paid! 🎉</p>
          ) : (
            dues.filter(d => d.status !== 'paid').map(due => {
              const dueItems = getDueItems(due);
              const pendingItems = dueItems.filter(item => item.status === 'pending');
              
              return (
                <div key={due._id || due.id} className="due-card">
                  <div className="due-header">
                    <h3>{due.month || due.description || 'Payment'} • {due.semester || due.period || 'N/A'}</h3>
                    <span className={`status ${due.status}`}>{due.status}</span>
                  </div>
                  
                  {pendingItems.map(item => (
                    <div key={item.id || item._id} className="bill-item">
                      <div>
                        <strong>{item.name || item.description}</strong>
                        <span>₹{item.amount || item.totalAmount || 0}</span>
                      </div>
                      <button 
                        onClick={() => handlePayment(due, item)}
                        disabled={processing}
                      >
                        {processing ? 'Processing...' : 'Pay Now'}
                      </button>
                    </div>
                  ))}

                  {pendingItems.length > 1 && (
                    <button 
                      className="pay-all" 
                      onClick={() => handlePayment(due)}
                      disabled={processing}
                    >
                      Pay All (₹{pendingItems.reduce((sum, i) => sum + (i.amount || i.totalAmount || 0), 0)})
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Payment History */}
        <div className="history">
          <h2>Payment History</h2>
          {paymentHistory.length === 0 ? (
            <p className="no-history">No payment history found.</p>
          ) : (
            paymentHistory.map(payment => (
              <div key={payment._id} className="history-item">
                <div>
                  <strong>{payment.description}</strong>
                  <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span>₹{payment.amount}</span>
                  <span className={`status ${payment.status}`}>{payment.status}</span>
                  <small>{payment.paymentMethod}</small>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Payment Modal */}
        {showModal && selectedBill && (
          <div className="modal">
            <div className="modal-content">
              <h3>Pay {selectedBill.name}</h3>
              <p>Amount: ₹{selectedBill.amount}</p>
              <p>Month: {selectedBill.month}</p>
              
              <div className="methods">
                {['UPI', 'Card', 'Net Banking'].map(method => (
                  <button
                    key={method}
                    className={selectedMethod === method ? 'selected' : ''}
                    onClick={() => setSelectedMethod(method)}
                    disabled={processing}
                  >
                    {method}
                  </button>
                ))}
              </div>

              <div className="modal-actions">
                <button 
                  onClick={() => setShowModal(false)} 
                  disabled={processing}
                >
                  Cancel
                </button>
                <button 
                  onClick={processPayment} 
                  disabled={!selectedMethod || processing}
                  className="pay-button"
                >
                  {processing ? 'Processing...' : `Pay ₹${selectedBill.amount}`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Receipt Modal */}
        {showReceipt && receiptData && (
          <div className="modal">
            <div className="receipt">
              <div className="receipt-header">
                <h2>Payment Receipt</h2>
                <button className="close-btn" onClick={() => setShowReceipt(false)}>×</button>
              </div>
              
              <div className="receipt-body">
                <div className="receipt-info">
                  <div className="info-row">
                    <span>Transaction ID:</span>
                    <strong>{receiptData.transactionId}</strong>
                  </div>
                  <div className="info-row">
                    <span>Date:</span>
                    <span>{receiptData.date}</span>
                  </div>
                  <div className="info-row">
                    <span>Student Name:</span>
                    <span>{receiptData.studentName}</span>
                  </div>
                  <div className="info-row">
                    <span>Roll Number:</span>
                    <span>{receiptData.rollNumber}</span>
                  </div>
                  <div className="info-row">
                    <span>Hall & Room:</span>
                    <span>{receiptData.hall} - {receiptData.roomNo}</span>
                  </div>
                </div>

                <div className="payment-details">
                  <h3>Payment Details</h3>
                  <div className="info-row">
                    <span>Description:</span>
                    <span>{receiptData.description}</span>
                  </div>
                  <div className="info-row">
                    <span>Payment Method:</span>
                    <span>{receiptData.method}</span>
                  </div>
                  <div className="info-row total">
                    <span>Amount Paid:</span>
                    <strong>₹{receiptData.amount}</strong>
                  </div>
                </div>

                <div className="receipt-status">
                  <div className={`status-badge ${receiptData.status}`}>
                    {receiptData.status.toUpperCase()}
                  </div>
                  <p>Payment completed successfully</p>
                </div>
              </div>

              <div className="receipt-actions">
                <button className="btn-print" onClick={printReceipt}>
                  🖨️ Print Receipt
                </button>
                <button className="btn-done" onClick={() => setShowReceipt(false)}>
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}