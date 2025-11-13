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

// Warden Pages
import WardenDashboard from './pages/warden/Dashboard';
import ComplaintManagement from './pages/warden/ComplaintManagement';
import StudentManagement from './pages/warden/StudentManagement';
import RoomAllocation from './pages/warden/RoomAllocation';

// Chairman Pages
import ChairmanDashboard from './pages/chairman/Dashboard';
import WardenReports from './pages/chairman/WardenReports';
import StudentAnalytics from './pages/chairman/StudentAnalytics';
import FinancialReports from './pages/chairman/FinancialReports';
import ComplaintAnalysis from './pages/chairman/ComplaintAnalysis';
import HallReports from './pages/chairman/HallReports';

export default function AppRouter() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Login Route - Redirect to dashboard if already logged in */}
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
      
      {/* Warden Routes */}
      <Route path="/warden/dashboard" element={
        <ProtectedRoute allowedRoles={['warden']}>
          <WardenDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/warden/complaints" element={
        <ProtectedRoute allowedRoles={['warden']}>
          <ComplaintManagement />
        </ProtectedRoute>
      } />
      
      <Route path="/warden/students" element={
        <ProtectedRoute allowedRoles={['warden']}>
          <StudentManagement />
        </ProtectedRoute>
      } />
      
      <Route path="/warden/room-allocation" element={
        <ProtectedRoute allowedRoles={['warden']}>
          <RoomAllocation />
        </ProtectedRoute>
      } />
      
      {/* Chairman Routes */}
      <Route path="/chairman/dashboard" element={
        <ProtectedRoute allowedRoles={['chairman']}>
          <ChairmanDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/chairman/warden-reports" element={
        <ProtectedRoute allowedRoles={['chairman']}>
          <WardenReports />
        </ProtectedRoute>
      } />
      
      <Route path="/chairman/student-analytics" element={
        <ProtectedRoute allowedRoles={['chairman']}>
          <StudentAnalytics />
        </ProtectedRoute>
      } />
      
      <Route path="/chairman/financial-reports" element={
        <ProtectedRoute allowedRoles={['chairman']}>
          <FinancialReports />
        </ProtectedRoute>
      } />
      
      <Route path="/chairman/complaint-analysis" element={
        <ProtectedRoute allowedRoles={['chairman']}>
          <ComplaintAnalysis />
        </ProtectedRoute>
      } />
      
      <Route path="/chairman/hall-reports" element={
        <ProtectedRoute allowedRoles={['chairman']}>
          <HallReports />
        </ProtectedRoute>
      } />
      
      {/* Mess Manager Route */}
      <Route path="/mess-manager/dashboard" element={
        <ProtectedRoute allowedRoles={['mess-manager']}>
          <div className="p-6">
            <h1 className="text-2xl font-bold">Mess Manager Dashboard - Coming Soon</h1>
          </div>
        </ProtectedRoute>
      } />
      
      {/* Default redirect */}
      <Route path="/dashboard" element={
        user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <Navigate to="/login" replace />
      } />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}