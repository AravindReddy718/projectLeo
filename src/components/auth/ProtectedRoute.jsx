import { useAuth } from '../../hooks/useAuth'
import { Navigate } from 'react-router-dom'

// Use default export
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user,loading } = useAuth()
   if (loading) {
    return <div>Loading...</div>
  }
  if (!user) {
    return <Navigate to="/login" />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />
  }

  return children
}