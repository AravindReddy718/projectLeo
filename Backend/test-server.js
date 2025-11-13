const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'HMC Backend API is running',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Mock auth route for testing
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock validation
  if (email && password) {
    res.json({
      message: 'Login successful',
      token: 'mock-jwt-token-for-testing',
      user: {
        id: 'test-user-id',
        username: email.split('@')[0],
        email: email,
        role: 'student',
        profile: {
          firstName: 'Test',
          lastName: 'User'
        }
      }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// API info route
app.get('/api', (req, res) => {
  res.json({
    name: 'Hostel Management Committee API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      students: '/api/students',
      complaints: '/api/complaints',
      payments: '/api/payments',
      dashboard: '/api/dashboard'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Test Backend server is running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api`);
});
