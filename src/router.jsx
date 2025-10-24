import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LandingPage from './pages/LandingPage';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import StudentComplaints from './pages/student/Complaints';
import StudentPayments from './pages/student/Payments';
import StudentRoomAllotment from './pages/student/RoomAllotment';

// Clerk Pages
import ClerkDashboard from './pages/clerk/Dashboard';

// Warden Pages
import WardenDashboard from './pages/warden/Dashboard';

export default function AppRouter() {
  const { user} = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/login" element={
        user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <Login />
      } />
      
      {/* Student Routes */}
      <Route path="/student/dashboard" element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/student/profile" element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentProfile />
        </ProtectedRoute>
      } />
      
      <Route path="/student/complaints" element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentComplaints />
        </ProtectedRoute>
      } />
      
      <Route path="/student/payments" element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentPayments />
        </ProtectedRoute>
      } />
      
      <Route path="/student/room-allotment" element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentRoomAllotment />
        </ProtectedRoute>
      } />
      
      {/* Clerk Routes */}
      <Route path="/clerk/dashboard" element={
        <ProtectedRoute allowedRoles={['clerk']}>
          <ClerkDashboard />
        </ProtectedRoute>
      } />
      
      {/* Warden Routes */}
      <Route path="/warden/dashboard" element={
        <ProtectedRoute allowedRoles={['warden']}>
          <WardenDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/" element={
        user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <Navigate to="/login" replace />
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}