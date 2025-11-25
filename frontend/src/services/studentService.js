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
      const response = await api.put(`/students/profile/${studentId}`, profileData);
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
  },

  // Get all students (warden/admin only)
  getAllStudents: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const queryString = params ? `?${params}` : '';
      const response = await api.get(`/students${queryString}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to fetch students';
      throw new Error(errorMessage);
    }
  },

  // Get student by ID
  getStudentById: async (id) => {
    try {
      const response = await api.get(`/students/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to fetch student';
      throw new Error(errorMessage);
    }
  },

  // Get own profile
  getOwnProfile: async () => {
    try {
      const response = await api.get('/students/profile/me');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to fetch profile';
      throw new Error(errorMessage);
    }
  },

  // Create new student with credentials (admin only)
  createStudent: async (studentData) => {
    try {
      const response = await api.post('/students', studentData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to create student';
      throw new Error(errorMessage);
    }
  },

  // Update student credentials (admin only)
  updateStudentCredentials: async (studentId, credentialsData) => {
    try {
      const response = await api.put(`/students/${studentId}/credentials`, credentialsData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to update student credentials';
      throw new Error(errorMessage);
    }
  }
};

export default studentService;