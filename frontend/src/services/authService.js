import api from './api';

// Real authentication service connected to backend API
const authService = {
  // Login user
  login: async (credentials) => {
    try {
      console.log('🔐 Attempting login with:', { email: credentials.email });
      const response = await api.post('/auth/login', credentials);
      
      console.log('✅ Login API response:', {
        hasToken: !!response.data.token,
        hasUser: !!response.data.user,
        userRole: response.data.user?.role
      });
      
      // Validate response structure
      if (!response.data.token || !response.data.user) {
        console.error('❌ Invalid response structure:', response.data);
        throw new Error('Invalid response from server');
      }
      
      // Store user data and token in localStorage
      const userData = {
        user: response.data.user,
        token: response.data.token
      };
      localStorage.setItem('hmc-user', JSON.stringify(userData));
      console.log('💾 User data stored in localStorage');
      
      return {
        success: true,
        user: response.data.user,
        token: response.data.token
      };
    } catch (error) {
      console.error('❌ Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Login failed. Please check your credentials.';
      throw new Error(errorMessage);
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
  },

  // Validate token by checking with backend
  validateToken: async () => {
    try {
      const response = await api.get('/auth/profile');
      if (response.data && response.data.user) {
        return {
          valid: true,
          user: response.data.user
        };
      }
      return { valid: false };
    } catch (error) {
      // Token is invalid or expired
      if (error.response?.status === 401) {
        // Clear invalid token
        localStorage.removeItem('hmc-user');
      }
      return { valid: false };
    }
  }
};

export default authService;