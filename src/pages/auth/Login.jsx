import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'  // Fixed import path
import { useNavigate } from 'react-router-dom'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [hall, setHall] = useState('')
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
          <h1>🏛️ IIT Hostel Management</h1>
          <p>Portal System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>📧 Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-group">
            <label>🔒 Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="input-group">
            <label>🏠 Hall</label>
            <select value={hall} onChange={(e) => setHall(e.target.value)} required>
              <option value="">Select Hall</option>
              <option value="Hall 1">Hall 1</option>
              <option value="Hall 2">Hall 2</option>
              <option value="Hall 5">Hall 5</option>
              <option value="Hall 7">Hall 7</option>
            </select>
          </div>

          <button type="submit" className="login-btn">
            Sign In
          </button>
        </form>

        <div className="login-footer">
          <p>Test Credentials:</p>
          <p>student@iit.ac.in / clerk@iit.ac.in / warden@iit.ac.in</p>
          <p>Password: password</p>
        </div>
      </div>
    </div>
  )
}

export default Login