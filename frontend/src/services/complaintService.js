import api from './api';

const complaintService = {
  // Get all complaints (with optional filters)
  getComplaints: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/complaints?${params}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch complaints');
    }
  },

  // Get complaint by ID
  getComplaintById: async (id) => {
    try {
      const response = await api.get(`/complaints/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch complaint');
    }
  },

  // Create new complaint
  createComplaint: async (complaintData) => {
    try {
      const response = await api.post('/complaints', complaintData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create complaint');
    }
  },

  // Update complaint (for warden ATR)
  updateComplaint: async (id, updateData) => {
    try {
      const response = await api.put(`/complaints/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update complaint');
    }
  },

  // Get complaints for a specific student
  getStudentComplaints: async (studentId) => {
    try {
      const response = await api.get(`/complaints?studentId=${studentId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch student complaints');
    }
  }
};

export default complaintService;