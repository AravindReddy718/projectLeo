import api from './api';

const chairmanService = {
  // Get dashboard overview
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

  // Get room occupancy
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

  // Get complaint statistics
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
  }
};

export default chairmanService;

