import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Login from './pages/auth/Login'
import StudentDashboard from './pages/student/Dashboard'
import ClerkDashboard from './pages/clerk/Dashboard'
import WardenDashboard from './pages/warden/dashboard'
import ProtectedRoute from './components/auth/ProtectedRoute'  // Default import
// ...existing code...
import LandingPage from './pages/LandingPage' // added import
// ...existing code...

export default function AppRouter() {
  const { user } = useAuth()

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <Login />
      } />
      
      {/* Role-based Dashboard Routes */}
      <Route path="/student/dashboard" element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentDashboard />
        </ProtectedRoute>
      } />
      {/* ...existing routes... */}
      
      {/* Default route: show landing page to unauthenticated users */}
      <Route path="/" element={
        user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <LandingPage />
      } />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}