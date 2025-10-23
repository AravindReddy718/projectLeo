import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Mock authentication
    const mockUsers = {
      'student@iit.ac.in': { role: 'student', name: 'Aravind', hall: 'Hall 5' },
      'clerk@iit.ac.in': { role: 'clerk', name: 'Hemanth', hall: 'Hall 5' },
      'warden@iit.ac.in': { role: 'warden', name: 'Venkatesh', hall: 'Hall 5' },
      'mess@iit.ac.in': { role: 'mess-manager', name: 'Ashok', hall: 'Hall 5' },
      'chairman@iit.ac.in': { role: 'chairman', name: 'Khaja', hall: 'All' }
    }

    const user = mockUsers[email]
    if (user && password === 'password') {
      login(user)
      navigate(`/${user.role}/dashboard`)
    } else {
      alert('Invalid credentials. Use: student@iit.ac.in / clerk@iit.ac.in / warden@iit.ac.in | Password: password')
    }
  }

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

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Sign In
          </button>
        </form>

        <div className="login-footer">
          <p><strong>Test Credentials:</strong></p>
          <div className="credentials">
            <p>student@iit.ac.in | clerk@iit.ac.in | warden@iit.ac.in</p>
            <p><strong>Password:</strong> password</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login