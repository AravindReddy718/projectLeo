import api from './api';

// Real authentication service connected to backend API
const authService = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      // Store user data and token in localStorage
      const userData = {
        user: response.data.user,
        token: response.data.token
      };
      localStorage.setItem('hmc-user', JSON.stringify(userData));
      
      return {
        success: true,
        user: response.data.user,
        token: response.data.token
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('hmc-user');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('hmc-user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('hmc-user');
  }
};

export default authService;