import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import './Payments.css';

export default function Payments() {
  const [dues, setDues] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    // Mock data
    setDues([{
      id: 1,
      month: 'October 2024',
      items: [
        { id: 'mess', name: 'Mess Charges', amount: 1800, status: 'pending' },
        { id: 'rent', name: 'Room Rent', amount: 750, status: 'pending' },
        { id: 'amenities', name: 'Amenities Fee', amount: 300, status: 'pending' }
      ],
      total: 2850,
      status: 'pending'
    }]);

    setPaymentHistory([{
      id: 1, date: '2024-09-28', amount: 2850, description: 'Full Payment - September 2024',
      method: 'UPI', status: 'success', transactionId: 'TXN20240928123456'
    }]);
  }, []);

  const handlePayment = (due, item = null) => {
    setSelectedBill(item ? { ...item, month: due.month } : { 
      id: 'all', 
      name: 'All Bills', 
      amount: due.items.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0),
      month: due.month 
    });
    setSelectedMethod(null);
    setShowModal(true);
  };

  const processPayment = () => {
    if (!selectedMethod) return;
    
    const transactionId = 'TXN' + Date.now();
    const paymentDate = new Date().toISOString().split('T')[0];
    
    // Update dues
    const updatedDues = dues.map(due => {
      if (due.month === selectedBill.month) {
        const updatedItems = due.items.map(item => 
          selectedBill.id === 'all' || item.id === selectedBill.id 
            ? { ...item, status: 'paid' } 
            : item
        );
        const allPaid = updatedItems.every(item => item.status === 'paid');
        return { ...due, items: updatedItems, status: allPaid ? 'paid' : 'partial' };
      }
      return due;
    });

    setDues(updatedDues);

    // Add to payment history
    const newPayment = {
      id: paymentHistory.length + 1,
      date: paymentDate,
      amount: selectedBill.amount,
      description: `${selectedBill.name} - ${selectedBill.month}`,
      method: selectedMethod,
      status: 'success',
      transactionId: transactionId
    };

    setPaymentHistory([newPayment, ...paymentHistory]);

    // Generate receipt data
    setReceiptData({
      ...newPayment,
      studentName: "Amit Kumar",
      rollNumber: "2024CS10001",
      hall: "Hall 5",
      roomNo: "G-102"
    });

    setShowModal(false);
    setShowReceipt(true);
  };

  const printReceipt = () => {
    window.print();
  };

  const totalPending = dues.reduce((sum, due) => 
    sum + due.items.filter(item => item.status === 'pending').reduce((sum, item) => sum + item.amount, 0), 0
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
            <strong>{dues.flatMap(d => d.items).filter(i => i.status === 'pending').length}</strong>
          </div>
        </div>

        {/* Current Dues */}
        <div className="dues">
          <h2>Current Dues</h2>
          {dues.filter(d => d.status !== 'paid').map(due => (
            <div key={due.id} className="due-card">
              <div className="due-header">
                <h3>{due.month}</h3>
                <span className={`status ${due.status}`}>{due.status}</span>
              </div>
              
              {due.items.filter(item => item.status === 'pending').map(item => (
                <div key={item.id} className="bill-item">
                  <div>
                    <strong>{item.name}</strong>
                    <span>₹{item.amount}</span>
                  </div>
                  <button onClick={() => handlePayment(due, item)}>Pay Now</button>
                </div>
              ))}

              <button className="pay-all" onClick={() => handlePayment(due)}>
                Pay All (₹{due.items.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0)})
              </button>
            </div>
          ))}
        </div>

        {/* Payment History */}
        <div className="history">
          <h2>Payment History</h2>
          {paymentHistory.map(payment => (
            <div key={payment.id} className="history-item">
              <div>
                <strong>{payment.description}</strong>
                <span>{payment.date}</span>
              </div>
              <div>
                <span>₹{payment.amount}</span>
                <span className={`status ${payment.status}`}>{payment.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Modal */}
        {showModal && selectedBill && (
          <div className="modal">
            <div className="modal-content">
              <h3>Pay {selectedBill.name}</h3>
              <p>Amount: ₹{selectedBill.amount}</p>
              
              <div className="methods">
                {['UPI', 'Card', 'Net Banking'].map(method => (
                  <button
                    key={method}
                    className={selectedMethod === method ? 'selected' : ''}
                    onClick={() => setSelectedMethod(method)}
                  >
                    {method}
                  </button>
                ))}
              </div>

              <div className="modal-actions">
                <button onClick={() => setShowModal(false)}>Cancel</button>
                <button onClick={processPayment} disabled={!selectedMethod}>
                  Pay ₹{selectedBill.amount}
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