import { useAuth } from '../../hooks/useAuth'
import { Navigate } from 'react-router-dom'

// Use default export
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user } = useAuth()
  console.log('ProtectedRoute check:', { user: user?.role, allowedRoles })
  
  if (!user) {
    console.log('No user found, redirecting to login')
    return <Navigate to="/login" />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log('User role not allowed, redirecting to login')
    return <Navigate to="/login" />
  }

  console.log('User authenticated, rendering children')
  return children
}