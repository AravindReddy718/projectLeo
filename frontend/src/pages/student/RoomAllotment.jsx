import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import studentService from '../../services/studentService';
import './RoomAllotment.css';

export default function RoomAllotment() {
  const [allotment, setAllotment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRoomAllotment();   
  }, []);

  const fetchRoomAllotment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get student profile which contains room allotment info
      const studentData = await studentService.getOwnProfile();
      
      // Transform student data into allotment format
      if (studentData && studentData.hostelInfo) {
        setAllotment({
          studentName: `${studentData.personalInfo?.firstName || ''} ${studentData.personalInfo?.lastName || ''}`.trim(),
          rollNumber: studentData.academicInfo?.rollNumber || studentData.studentId,
          hall: studentData.hostelInfo.block || 'N/A',
          roomNo: studentData.hostelInfo.roomNumber || 'N/A',
          roomType: 'Standard',
          roomRent: 750, // This should come from fees or a separate API
          dateOfAllotment: studentData.hostelInfo.checkInDate || new Date(),
          validUntil: studentData.hostelInfo.checkOutDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          wardenName: 'Hall Warden' // This should come from API
        });
      } else {
        throw new Error('Room allotment information not available');
      }
    } catch (error) {
      console.error('Error fetching room allotment:', error);
      setError(error.message || 'Failed to fetch room allotment');
    } finally {
      setLoading(false);
    }
  };

  const printAllotment = () => {
    window.print();
  };

  const downloadPDF = () => {
    // In real app, this would generate and download PDF
    alert('PDF download functionality would be implemented here');
  };

  const shareViaEmail = () => {
    // In real app, this would share via email
    alert('Email sharing functionality would be implemented here');
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading room allotment...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="allotment-container">
          <div className="error-container">
            <h2>Room Allotment Not Available</h2>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchRoomAllotment}>
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!allotment) {
    return (
      <Layout>
        <div className="allotment-container">
          <div className="error-container">
            <h2>No Room Allotment Found</h2>
            <p>Your room allotment information is not available. Please contact the hostel office.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="allotment-container">
        <div className="allotment-header">
          <h1>Room Allotment Letter</h1>
          <button className="btn btn-primary" onClick={printAllotment}>
            🖨️ Print Letter
          </button>
        </div>

        <div className="allotment-letter print-format">
          <div className="letter-header">
            <h2>INDIAN INSTITUTE OF TECHNOLOGY</h2>
            <h3>HOSTEL MANAGEMENT CENTER</h3>
            <div className="institute-seal">
              <div className="seal">IIT SEAL</div>
            </div>
          </div>

          <div className="letter-title">
            <h1>ROOM ALLOTMENT LETTER</h1>
          </div>

          <div className="letter-content">
            <div className="letter-meta">
              <p><strong>Date:</strong> {new Date(allotment.dateOfAllotment).toLocaleDateString()}</p>
              <p><strong>Ref No:</strong> ALLOT/{allotment.hall}/{allotment.roomNo}/2024</p>
            </div>

            <div className="addressee">
              <p>To,</p>
              <p><strong>{allotment.studentName}</strong></p>
              <p>Roll No: {allotment.rollNumber}</p>
            </div>

            <div className="letter-body">
              <p>Dear <strong>{allotment.studentName}</strong>,</p>
              
              <p>
                We are pleased to inform you that you have been allotted accommodation 
                in the institute hostel for the academic year 2024-25. The details of 
                your accommodation are as follows:
              </p>

              <div className="allotment-details">
                <div className="detail-row">
                  <span><strong>Hall of Residence:</strong></span>
                  <span>{allotment.hall}</span>
                </div>
                <div className="detail-row">
                  <span><strong>Room Number:</strong></span>
                  <span>{allotment.roomNo}</span>
                </div>
                <div className="detail-row">
                  <span><strong>Room Type:</strong></span>
                  <span>{allotment.roomType}</span>
                </div>
                <div className="detail-row">
                  <span><strong>Monthly Rent:</strong></span>
                  <span>₹{allotment.roomRent} per month</span>
                </div>
                <div className="detail-row">
                  <span><strong>Date of Allotment:</strong></span>
                  <span>{new Date(allotment.dateOfAllotment).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span><strong>Valid Until:</strong></span>
                  <span>{new Date(allotment.validUntil).toLocaleDateString()}</span>
                </div>
              </div>

              <p>
                Please note the following important points:
              </p>
              <ul className="important-points">
                <li>You must report to the Hall Warden within 3 days of receiving this letter</li>
                <li>Carry this allotment letter and your institute ID card when reporting</li>
                <li>Room rent is payable monthly along with mess charges</li>
                <li>Any damage to room property will be charged separately</li>
                <li>Follow all hostel rules and regulations strictly</li>
              </ul>

              <p>
                For any queries regarding your accommodation, please contact the 
                Hall Warden or Hall Office.
              </p>

              <p>Welcome to IIT Hostels and wish you a pleasant stay!</p>
            </div>

            <div className="letter-footer">
              <div className="signature-section">
                <div className="warden-details">
                  <p><strong>{allotment.wardenName}</strong></p>
                  <p>Warden, {allotment.hall}</p>
                  <p>IIT Hostel Management Center</p>
                </div>
                <div className="signature-space">
                  <p>Signature: ________________</p>
                  <p>Date: ________________</p>
                </div>
              </div>

              <div className="official-stamp">
                <div className="stamp-area">
                  <p>OFFICIAL STAMP</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="allotment-actions">
          <button className="btn btn-success" onClick={downloadPDF}>
            Download PDF
          </button>
          <button className="btn btn-secondary" onClick={shareViaEmail}>
            Share via Email
          </button>
          <button className="btn btn-primary" onClick={printAllotment}>
            🖨️ Print Letter
          </button>
        </div>
      </div>
    </Layout>
  );
}