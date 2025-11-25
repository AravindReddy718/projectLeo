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
          <p><strong>Login Information:</strong></p>
          <div className="credentials">
            <p><strong>Admin:</strong> admin / admin123</p>
            <p><strong>Warden:</strong> warden / warden123</p>
            <p><strong>Students:</strong> Use credentials provided by admin</p>
            <p><em>You can use either email or username to login</em></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login