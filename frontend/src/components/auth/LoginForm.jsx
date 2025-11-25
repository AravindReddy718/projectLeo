import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './LoginForm.css'

function LoginForm() {
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent form default submission - CRITICAL for React Router
    
    setLoading(true)
    setError('')
    
    try {
      // Determine if input is email or username
      const isEmail = emailOrUsername.includes('@')
      const loginData = isEmail 
        ? { email: emailOrUsername, password }
        : { username: emailOrUsername, password }
      
      const result = await login(loginData)
      
      if (result && result.success && result.user) {
        console.log('Login successful, user:', result.user)
        
        // Get return path from location state (if redirected from protected route)
        // location.state.from is set by ProtectedRoute when redirecting unauthenticated users
        const returnPath = location.state?.from || `/${result.user.role}/dashboard`
        
        console.log('Navigating to:', returnPath)
        // Use replace to prevent back navigation to login
        navigate(returnPath, { replace: true })
      } else {
        setError('Login failed. Please check your credentials.')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-form-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login to Your Account</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="emailOrUsername">Email or Username</label>
          <input
            id="emailOrUsername"
            type="text"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            placeholder="Enter your email or username"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}

export default LoginForm