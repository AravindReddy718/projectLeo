import axios from 'axios';

// Base API URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    try {
      const userDataStr = localStorage.getItem('hmc-user');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        // Handle both structures: { user, token } or { token } or direct { ...user, token }
        const token = userData.token || (userData.user && userData.user.token);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.warn('No token found in localStorage for user:', userData);
        }
      }
    } catch (error) {
      console.error('Error reading auth token from localStorage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
      
      // Handle 401 Unauthorized - only redirect if it's not a login request
      if (error.response.status === 401) {
        const isLoginRequest = error.config?.url?.includes('/auth/login');
        if (!isLoginRequest) {
          // Only clear and redirect if not already on login page
          const currentPath = window.location.pathname;
          if (!currentPath.includes('/login') && currentPath !== '/') {
            // Clear auth data
            localStorage.removeItem('hmc-user');
            
            // Dispatch custom event for React Router to handle
            // This allows React Router to handle navigation instead of full page reload
            window.dispatchEvent(new CustomEvent('auth:logout', { 
              detail: { redirectTo: '/login' } 
            }));
            
            // Fallback: Use React Router's history if available, otherwise full reload
            // Only use window.location as last resort to avoid breaking SPA
            if (window.__REACT_ROUTER_HISTORY__) {
              window.__REACT_ROUTER_HISTORY__.replace('/login');
            } else {
              // Use replaceState to avoid adding to history
              window.history.replaceState(null, '', '/login');
              // Trigger a popstate event to notify React Router
              window.dispatchEvent(new PopStateEvent('popstate'));
            }
          }
        }
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };