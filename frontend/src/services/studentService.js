import api from './api';

const studentService = {
  // Get student dashboard data
  getDashboard: async (studentId) => {
    try {
      const response = await api.get(`/dashboard/${studentId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch dashboard data');
    }
  },

  // Get student recent complaints
  getRecentComplaints: async (studentId, limit = 3) => {
    try {
      const response = await api.get(`/dashboard/${studentId}/complaints?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch recent complaints');
    }
  },

  // Get student profile
  getProfile: async (studentId) => {
    try {
      const response = await api.get(`/students/${studentId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch profile');
    }
  },

  // Update student profile
  updateProfile: async (studentId, profileData) => {
    try {
      const response = await api.put(`/students/${studentId}`, profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update profile');
    }
  },

  // Get room allotment details
  getRoomAllotment: async (studentId) => {
    try {
      const response = await api.get(`/room-allotment/${studentId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch room allotment');
    }
  },

  // Get payment dues
  getPaymentDues: async () => {
    try {
      const response = await api.get('/payments/dues');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch payment dues');
    }
  },

  // Get payment history
  getPaymentHistory: async () => {
    try {
      const response = await api.get('/payments/history');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch payment history');
    }
  },

  // Process payment
  processPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments/pay', paymentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to process payment');
    }
  }
};

export default studentService;