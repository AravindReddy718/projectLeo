// Backend/server.js - Complete Working Server
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hmc_database';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    return false;
  }
};

// Import Models
const User = require('./models/User');
const Student = require('./models/Student');
const Complaint = require('./models/Complaint');
const Payment = require('./models/Payment');

// Import Middleware
const { auth, authorize } = require('./middleware/auth');

// Import Routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const complaintRoutes = require('./routes/complaints');
const paymentRoutes = require('./routes/payments');
const dashboardRoutes = require('./routes/dashboard');
const roomRoutes = require('./routes/rooms');

// Health Check Route
app.get('/api/health', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({ 
    message: '🚀 HMC Server is running!',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/rooms', roomRoutes);

// Seed data endpoint (admin only)
app.post('/api/seed-data', auth, authorize('admin'), async (req, res) => {
  try {
    console.log('🌱 Starting data seeding from API...');
    
    // Clear existing data and create new data directly
    await User.deleteMany({});
    await Student.deleteMany({});
    await Complaint.deleteMany({});
    await Payment.deleteMany({});
    await Room.deleteMany({});
    
    // Import the seeding functions
    const seedCompleteData = require('./seedCompleteData');
    
    // Run seeding with current connection
    const bcrypt = require('bcryptjs');
    
    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@iit.ac.in',
      password: 'admin123',
      role: 'admin',
      profile: {
        firstName: 'System',
        lastName: 'Administrator'
      }
    });
    await adminUser.save();
    
    res.json({
      success: true,
      message: 'Database cleared and admin user created. Please run the seed script manually for complete data.'
    });
  } catch (error) {
    console.error('❌ Seeding error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: error.message
    });
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start Server
const startServer = async () => {
  console.log('🔄 Starting HMC Backend Server...');
  console.log('📍 Environment:', process.env.NODE_ENV || 'development');
  
  const dbConnected = await connectDB();
  
  if (dbConnected) {
    app.listen(PORT, () => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`🎯 Server running on port ${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📊 API Base URL: http://localhost:${PORT}/api`);
      console.log(`💾 MongoDB: Connected ✅`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });
  } else {
    console.log('❌ Server cannot start without database connection');
    console.log('⚠️  Please check your MongoDB connection and try again');
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('💾 MongoDB connection closed');
    process.exit(0);
  });
});

startServer();

module.exports = app;