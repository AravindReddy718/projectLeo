const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { errorHandler, notFound } = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB - Temporarily disabled for testing
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hmc', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected successfully'))
// .catch((err) => console.error('MongoDB connection error:', err));

console.log('MongoDB connection temporarily disabled for testing');

// Routes - Using mock auth for testing
app.use('/api/auth', require('./routes/auth-mock'));
app.use('/api/students', require('./routes/students'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'HMC Backend API is running',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
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

// Handle 404 errors
app.use(notFound);

// Handle all other errors
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api`);
});
