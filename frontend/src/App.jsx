import React, { useEffect } from 'react'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import AppRouter from './router'
import './App.css'

// Component to handle auth logout events from API interceptor
function AuthEventHandler() {
  const navigate = useNavigate()
  
  useEffect(() => {
    // Expose navigate function globally for API interceptor (fallback)
    window.__REACT_ROUTER_HISTORY__ = {
      replace: (path) => navigate(path, { replace: true }),
      push: (path) => navigate(path)
    }
    
    // Listen for auth logout events
    const handleAuthLogout = (event) => {
      const { redirectTo } = event.detail || {}
      if (redirectTo) {
        navigate(redirectTo, { replace: true })
      }
    }
    
    window.addEventListener('auth:logout', handleAuthLogout)
    
    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout)
      delete window.__REACT_ROUTER_HISTORY__
    }
  }, [navigate])
  
  return null
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AuthEventHandler />
        <AppRouter />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App