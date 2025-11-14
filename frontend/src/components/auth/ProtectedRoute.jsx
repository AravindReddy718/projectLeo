import { useAuth } from '../../hooks/useAuth'
import { Navigate, useLocation } from 'react-router-dom'

// Use default export
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  
  // Wait for auth check to complete
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    )
  }
  
  // No user - redirect to login with return path
  if (!user) {
    // Store the attempted location so we can redirect back after login
    const returnPath = location.pathname + location.search
    return <Navigate to="/login" state={{ from: returnPath }} replace />
  }

  // User role not allowed - redirect to login
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />
  }

  // User is authenticated and has correct role
  return children
}