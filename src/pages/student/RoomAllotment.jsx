import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import './RoomAllotment.css';

export default function RoomAllotment() {
  const [allotment, setAllotment] = useState(null);

  useEffect(() => {
    // Mock data - replace with API call
    setAllotment({
      studentName: "Amit Kumar",
      rollNumber: "2024CS10001",
      admissionNo: "ADM202400125",
      hall: "Hall 5",
      roomNo: "G-102",
      roomType: "Single Occupancy",
      roomRent: 1200,
      dateOfAllotment: "2024-08-01",
      validUntil: "2025-05-31",
      wardenName: "Dr. Priya Sharma",
      wardenSignature: "Dr. Priya Sharma"
    });
  }, []);

  const printAllotment = () => {
    window.print();
  };

  if (!allotment) {
    return <div>Loading...</div>;
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
              <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>Ref No:</strong> ALLOT/{allotment.hall}/{allotment.roomNo}/2024</p>
            </div>

            <div className="addressee">
              <p>To,</p>
              <p><strong>{allotment.studentName}</strong></p>
              <p>Roll No: {allotment.rollNumber}</p>
              <p>Admission No: {allotment.admissionNo}</p>
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
                  <span>{allotment.dateOfAllotment}</span>
                </div>
                <div className="detail-row">
                  <span><strong>Valid Until:</strong></span>
                  <span>{allotment.validUntil}</span>
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
          <button className="btn btn-success" onClick={printAllotment}>
            Download PDF
          </button>
          <button className="btn btn-secondary">
            Share via Email
          </button>
        </div>
      </div>
    </Layout>
  );
}