import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import './Payments.css';

const API_BASE_URL = 'http://localhost:5000/api';
// Change this line to use your actual student ID
const studentId = '690256e03cf868dd730c2b15';

export default function Payments() {
  const [dues, setDues] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Get student ID from auth (mock for now)
  const studentId = '65a1b2c3d4e5f67890123456';

  useEffect(() => {
    fetchDues();
    fetchPaymentHistory();
  }, []);

  const fetchDues = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/payments/dues?studentId=${studentId}`);
      if (!response.ok) throw new Error('Failed to fetch dues');
      const data = await response.json();
      setDues(data);
    } catch (error) {
      console.error('Error fetching dues:', error);
      alert('Failed to load dues');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/history?studentId=${studentId}`);
      if (!response.ok) throw new Error('Failed to fetch payment history');
      const data = await response.json();
      setPaymentHistory(data);
    } catch (error) {
      console.error('Error fetching payment history:', error);
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
      
      const response = await fetch(`${API_BASE_URL}/payments/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: studentId,
          paymentId: selectedBill.paymentId,
          amount: selectedBill.amount,
          description: `${selectedBill.name} - ${selectedBill.month}`,
          paymentMethod: selectedMethod,
          billType: selectedBill.billType
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment failed');
      }

      const result = await response.json();

      // Refresh data
      await fetchDues();
      await fetchPaymentHistory();

      // Generate receipt data
      setReceiptData({
        transactionId: result.transactionId,
        date: new Date().toISOString().split('T')[0],
        amount: selectedBill.amount,
        description: `${selectedBill.name} - ${selectedBill.month}`,
        method: selectedMethod,
        status: 'success',
        studentName: "Amit Kumar", // This should come from student data
        rollNumber: "2024CS10001",
        hall: "Hall 5",
        roomNo: "G-102"
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
    return [
      { id: 'messCharges', name: 'Mess Charges', amount: due.messCharges.amount, status: due.messCharges.status },
      { id: 'roomRent', name: 'Room Rent', amount: due.roomRent.amount, status: due.roomRent.status },
      { id: 'amenitiesFee', name: 'Amenities Fee', amount: due.amenitiesFee.amount, status: due.amenitiesFee.status },
      ...(due.otherCharges.amount > 0 ? [{ 
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
                <div key={due._id} className="due-card">
                  <div className="due-header">
                    <h3>{due.month} • {due.semester}</h3>
                    <span className={`status ${due.status}`}>{due.status}</span>
                  </div>
                  
                  {pendingItems.map(item => (
                    <div key={item.id} className="bill-item">
                      <div>
                        <strong>{item.name}</strong>
                        <span>₹{item.amount}</span>
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
                      Pay All (₹{pendingItems.reduce((sum, i) => sum + i.amount, 0)})
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