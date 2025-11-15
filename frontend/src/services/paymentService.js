import api from './api';

const paymentService = {
  // Get all payments (filtered by role)
  getAllPayments: async (params = {}) => {
    try {
      const response = await api.get('/payments', { params });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to fetch payments';
      throw new Error(errorMessage);
    }
  },

  // Get payment by ID
  getPaymentById: async (paymentId) => {
    try {
      const response = await api.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to fetch payment details';
      throw new Error(errorMessage);
    }
  },

  // Create new payment (warden/admin only)
  createPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments', paymentData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to create payment';
      throw new Error(errorMessage);
    }
  },

  // Update payment (warden/admin only)
  updatePayment: async (paymentId, paymentData) => {
    try {
      const response = await api.put(`/payments/${paymentId}`, paymentData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to update payment';
      throw new Error(errorMessage);
    }
  },

  // Mark payment as paid by warden/admin
  markPaymentAsPaid: async (paymentId, paymentDetails) => {
    try {
      const response = await api.post(`/payments/${paymentId}/pay`, paymentDetails);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to mark payment as paid';
      throw new Error(errorMessage);
    }
  },

  // Student clears their own payment
  clearPayment: async (paymentId, paymentDetails) => {
    try {
      const response = await api.post(`/payments/${paymentId}/student-pay`, paymentDetails);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to clear payment';
      throw new Error(errorMessage);
    }
  },

  // Get overdue payments (warden/admin only)
  getOverduePayments: async (params = {}) => {
    try {
      const response = await api.get('/payments/overdue/list', { params });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to fetch overdue payments';
      throw new Error(errorMessage);
    }
  },

  // Get payment statistics (warden/admin only)
  getPaymentStats: async () => {
    try {
      const response = await api.get('/payments/stats/dashboard');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to fetch payment statistics';
      throw new Error(errorMessage);
    }
  },

  // Generate receipt (warden/admin only)
  generateReceipt: async (paymentId) => {
    try {
      const response = await api.post(`/payments/${paymentId}/receipt`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to generate receipt';
      throw new Error(errorMessage);
    }
  },

  // Delete payment (admin only)
  deletePayment: async (paymentId) => {
    try {
      const response = await api.delete(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to delete payment';
      throw new Error(errorMessage);
    }
  }
};

export default paymentService;
