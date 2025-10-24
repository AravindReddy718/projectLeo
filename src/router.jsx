import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import LandingPage from './pages/LandingPage'
import Login from './pages/auth/Login'
import StudentDashboard from './pages/student/Dashboard'
import ClerkDashboard from './pages/clerk/Dashboard'
import WardenDashboard from './pages/warden/dashboard'
import ProtectedRoute from './components/auth/ProtectedRoute'

export default function AppRouter() {
  const { user } = useAuth()

  return (
    <Routes>
      {/* Landing Page - Public route */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Login Page - Always show login page when navigating to /login */}
      <Route path="/login" element={<Login />} />
      
      {/* Role-based Dashboard Routes */}
      <Route path="/student/dashboard" element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/clerk/dashboard" element={
        <ProtectedRoute allowedRoles={['clerk']}>
          <ClerkDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/warden/dashboard" element={
        <ProtectedRoute allowedRoles={['warden']}>
          <WardenDashboard />
        </ProtectedRoute>
      } />
      
      {/* Add other roles as needed */}
      <Route path="/mess-manager/dashboard" element={
        <ProtectedRoute allowedRoles={['mess-manager']}>
          <div className="p-6">
            <h1 className="text-2xl font-bold">Mess Manager Dashboard - Coming Soon</h1>
          </div>
        </ProtectedRoute>
      } />
      
      {/* Default redirect - only redirect to dashboard if user exists */}
      <Route path="/dashboard" element={
        user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <Navigate to="/login" replace />
      } />
      
      {/* Catch all route - redirect to landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}