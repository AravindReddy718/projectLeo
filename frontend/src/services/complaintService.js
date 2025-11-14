import api from './api';

const complaintService = {
  // Get all complaints (with optional filters)
  getComplaints: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const queryString = params ? `?${params}` : '';
      const response = await api.get(`/complaints${queryString}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to fetch complaints';
      throw new Error(errorMessage);
    }
  },

  // Get complaint by ID
  getComplaintById: async (id) => {
    try {
      const response = await api.get(`/complaints/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to fetch complaint';
      throw new Error(errorMessage);
    }
  },

  // Create new complaint
  createComplaint: async (complaintData) => {
    try {
      const response = await api.post('/complaints', complaintData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to create complaint';
      throw new Error(errorMessage);
    }
  },

  // Update complaint (for warden ATR)
  updateComplaint: async (id, updateData) => {
    try {
      const response = await api.put(`/complaints/${id}`, updateData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to update complaint';
      throw new Error(errorMessage);
    }
  },

  // Get complaints for a specific student
  getStudentComplaints: async (studentId) => {
    try {
      const response = await api.get(`/complaints?studentId=${studentId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to fetch student complaints';
      throw new Error(errorMessage);
    }
  }
};

export default complaintService;