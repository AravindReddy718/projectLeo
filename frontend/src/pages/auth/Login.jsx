import React from 'react'
import LoginForm from '../../components/auth/LoginForm'
import './Login.css'

function Login() {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <i className="fas fa-university"></i>
          </div>
          <h1>IIT Hostel Management</h1>
          <p>Portal System</p>
        </div>
        
        <LoginForm />
        
        <div className="login-footer">
          <p><strong>Test Credentials:</strong></p>
          <div className="credentials">
            <p>student@iit.ac.in | warden@iit.ac.in | admin@iit.ac.in</p>
            <p><strong>Password:</strong> password123</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login