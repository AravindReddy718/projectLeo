import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hmc_database';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    return false;
  }
};

// Simple Student Schema
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  hall: {
    type: String,
    required: true
  },
  roomNo: {
    type: String,
    required: true
  },
  dues: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

// Simple Complaint Schema
const complaintSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true
  },
  studentEmail: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'resolved']
  },
  hall: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Complaint = mongoose.model('Complaint', complaintSchema);

// Routes

// Health check
app.get('/api/health', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  
  res.json({ 
    message: '🚀 HMC Server is running!',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Get all students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json({
      success: true,
      data: students,
      count: students.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching students', 
      error: error.message 
    });
  }
});

// Add new student
app.post('/api/students', async (req, res) => {
  try {
    const { name, email, hall, roomNo, dues } = req.body;
    
    const student = new Student({
      name,
      email,
      hall,
      roomNo,
      dues: dues || 0
    });

    await student.save();
    
    res.status(201).json({ 
      success: true,
      message: 'Student added successfully', 
      data: student 
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ 
        success: false,
        message: 'Student with this email already exists' 
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: 'Error adding student', 
        error: error.message 
      });
    }
  }
});

// Get all complaints
app.get('/api/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: complaints,
      count: complaints.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching complaints', 
      error: error.message 
    });
  }
});

// Add new complaint
app.post('/api/complaints', async (req, res) => {
  try {
    const { studentName, studentEmail, type, description, hall } = req.body;
    
    const complaint = new Complaint({
      studentName,
      studentEmail,
      type,
      description,
      hall
    });

    await complaint.save();
    
    res.status(201).json({ 
      success: true,
      message: 'Complaint submitted successfully', 
      data: complaint 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error submitting complaint', 
      error: error.message 
    });
  }
});

// Update complaint status
app.patch('/api/complaints/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ 
        success: false,
        message: 'Complaint not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'Complaint status updated', 
      data: complaint 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error updating complaint', 
      error: error.message 
    });
  }
});

// Get dashboard stats
app.get('/api/stats', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });
    const totalDues = await Student.aggregate([
      { $group: { _id: null, total: { $sum: '$dues' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalStudents,
        totalComplaints,
        pendingComplaints,
        totalDues: totalDues[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching stats', 
      error: error.message 
    });
  }
});

// Test data endpoint (for demo)
app.post('/api/test-data', async (req, res) => {
  try {
    // Clear existing data
    await Student.deleteMany({});
    await Complaint.deleteMany({});

    // Add test students
    const testStudents = [
      {
        name: 'Amit Kumar',
        email: 'amit@iit.ac.in',
        hall: 'Hall 5',
        roomNo: 'G-102',
        dues: 2850
      },
      {
        name: 'Priya Singh',
        email: 'priya@iit.ac.in',
        hall: 'Hall 5',
        roomNo: 'B-205',
        dues: 3200
      },
      {
        name: 'Rohan Mehta',
        email: 'rohan@iit.ac.in',
        hall: 'Hall 3',
        roomNo: 'A-101',
        dues: 1500
      }
    ];

    const students = await Student.insertMany(testStudents);

    // Add test complaints
    const testComplaints = [
      {
        studentName: 'Amit Kumar',
        studentEmail: 'amit@iit.ac.in',
        type: 'electrical',
        description: 'Fused tube light in room G-102',
        hall: 'Hall 5',
        status: 'pending'
      },
      {
        studentName: 'Priya Singh',
        studentEmail: 'priya@iit.ac.in',
        type: 'plumbing',
        description: 'Leaking tap in bathroom',
        hall: 'Hall 5',
        status: 'resolved'
      }
    ];

    const complaints = await Complaint.insertMany(testComplaints);

    res.json({
      success: true,
      message: 'Test data added successfully',
      data: {
        students: students.length,
        complaints: complaints.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding test data',
      error: error.message
    });
  }
});

// Start server
const startServer = async () => {
  console.log('🔄 Connecting to MongoDB...');
  
  const dbConnected = await connectDB();
  
  if (dbConnected) {
    app.listen(PORT, () => {
      console.log(`🎯 Server running on port ${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📊 API Base URL: http://localhost:${PORT}/api`);
      console.log(`💾 MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌'}`);
    });
  } else {
    console.log('❌ Server cannot start without database connection');
    process.exit(1);
  }
};

startServer();