import api from './api';

const adminService = {
  // Get dashboard overview with all stats
  getDashboardOverview: async () => {
    try {
      const response = await api.get('/dashboard/overview');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to fetch dashboard overview';
      throw new Error(errorMessage);
    }
  },

  // Get complaint statistics for dashboard
  getComplaintStats: async () => {
    try {
      const response = await api.get('/complaints/stats/dashboard');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to fetch complaint statistics';
      throw new Error(errorMessage);
    }
  },

  // Get monthly statistics
  getMonthlyStats: async (year) => {
    try {
      const response = await api.get(`/dashboard/monthly-stats?year=${year || new Date().getFullYear()}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to fetch monthly statistics';
      throw new Error(errorMessage);
    }
  },

  // Get room occupancy data
  getRoomOccupancy: async () => {
    try {
      const response = await api.get('/dashboard/room-occupancy');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to fetch room occupancy';
      throw new Error(errorMessage);
    }
  },

  // Get performance metrics
  getPerformanceMetrics: async () => {
    try {
      const response = await api.get('/dashboard/performance');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to fetch performance metrics';
      throw new Error(errorMessage);
    }
  },

  // Get all students with pagination
  getStudents: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });
      const response = await api.get(`/students?${params}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to fetch students';
      throw new Error(errorMessage);
    }
  },

  // Get all complaints with pagination
  getComplaints: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });
      const response = await api.get(`/complaints?${params}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to fetch complaints';
      throw new Error(errorMessage);
    }
  },

  // Get all payments with pagination
  getPayments: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });
      const response = await api.get(`/payments?${params}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          'Failed to fetch payments';
      throw new Error(errorMessage);
    }
  },

  // Get financial summary
  getFinancialSummary: async () => {
    try {
      const overview = await adminService.getDashboardOverview();
      return overview.financial;
    } catch (error) {
      throw new Error('Failed to fetch financial summary');
    }
  },

  // Get quick action counts for dashboard
  getQuickActionCounts: async () => {
    try {
      const [overview, complaintStats, performance] = await Promise.all([
        adminService.getDashboardOverview(),
        adminService.getComplaintStats(),
        adminService.getPerformanceMetrics()
      ]);

      return {
        wardenReports: {
          count: overview.overview?.totalUsers || 0,
          pendingTasks: overview.overview?.pendingComplaints || 0,
          description: 'Active wardens and pending tasks'
        },
        studentAnalytics: {
          count: overview.overview?.totalStudents || 0,
          newThisMonth: overview.distributions?.departments?.reduce((sum, dept) => sum + dept.count, 0) || 0,
          description: 'Total students and analytics'
        },
        financialOverview: {
          totalRevenue: overview.financial?.totalRevenue || 0,
          collectedRevenue: overview.financial?.collectedRevenue || 0,
          pendingRevenue: overview.financial?.pendingRevenue || 0,
          collectionRate: performance.paymentStats?.revenueCollectionRate || 0,
          description: 'Financial performance overview'
        },
        complaintAnalysis: {
          totalComplaints: overview.overview?.totalComplaints || 0,
          pendingComplaints: overview.overview?.pendingComplaints || 0,
          resolvedComplaints: overview.overview?.resolvedComplaints || 0,
          resolutionRate: overview.overview?.totalComplaints > 0 
            ? ((overview.overview?.resolvedComplaints / overview.overview?.totalComplaints) * 100).toFixed(1)
            : 0,
          avgResolutionTime: performance.resolutionStats?.avgResolutionTime?.toFixed(1) || 0,
          description: 'Complaint resolution analytics'
        }
      };
    } catch (error) {
      console.error('Error fetching quick action counts:', error);
      return {
        wardenReports: { count: 0, pendingTasks: 0, description: 'Loading...' },
        studentAnalytics: { count: 0, newThisMonth: 0, description: 'Loading...' },
        financialOverview: { totalRevenue: 0, collectedRevenue: 0, pendingRevenue: 0, collectionRate: 0, description: 'Loading...' },
        complaintAnalysis: { totalComplaints: 0, pendingComplaints: 0, resolvedComplaints: 0, resolutionRate: 0, avgResolutionTime: 0, description: 'Loading...' }
      };
    }
  }
};

export default adminService;
