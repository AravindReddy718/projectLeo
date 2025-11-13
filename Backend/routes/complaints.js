const express = require('express');
const Complaint = require('../models/Complaint');
const Student = require('../models/Student');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all complaints (filtered by role)
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      category, 
      priority,
      studentId 
    } = req.query;
    
    let filter = {};
    
    // Students can only see their own complaints
    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user._id });
      if (!student) {
        return res.status(404).json({ message: 'Student profile not found' });
      }
      filter.student = student._id;
    }
    
    // Apply additional filters
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (studentId && (req.user.role === 'admin' || req.user.role === 'warden')) {
      filter.student = studentId;
    }

    const complaints = await Complaint.find(filter)
      .populate('student', 'studentId personalInfo.firstName personalInfo.lastName hostelInfo.roomNumber')
      .populate('assignedTo', 'username email profile')
      .populate('followUps.staff', 'username')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Complaint.countDocuments(filter);

    res.json({
      complaints,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get complaint by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('student', 'studentId personalInfo contactInfo hostelInfo')
      .populate('assignedTo', 'username email profile')
      .populate('followUps.staff', 'username')
      .populate('resolution.resolvedBy', 'username');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check if user is authorized to view this complaint
    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user._id });
      if (complaint.student._id.toString() !== student._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json(complaint);
  } catch (error) {
    console.error('Get complaint error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new complaint (students only)
router.post('/', auth, authorize('student'), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      location,
      images
    } = req.body;

    // Get student profile
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const complaint = new Complaint({
      student: student._id,
      title,
      description,
      category,
      priority,
      location,
      images
    });

    await complaint.save();
    await complaint.populate('student', 'studentId personalInfo.firstName personalInfo.lastName hostelInfo.roomNumber');

    res.status(201).json({
      message: 'Complaint created successfully',
      complaint
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update complaint status (admin/warden only)
router.put('/:id/status', auth, authorize('admin', 'warden'), async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        assignedTo: req.user._id
      },
      { new: true, runValidators: true }
    ).populate('student', 'studentId personalInfo.firstName personalInfo.lastName')
      .populate('assignedTo', 'username email');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Add follow-up note if provided
    if (notes) {
      complaint.followUps.push({
        staff: req.user._id,
        notes,
        timestamp: new Date()
      });
      await complaint.save();
    }

    res.json({
      message: 'Complaint status updated successfully',
      complaint
    });
  } catch (error) {
    console.error('Update complaint status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add follow-up to complaint (admin/warden only)
router.post('/:id/followup', auth, authorize('admin', 'warden'), async (req, res) => {
  try {
    const { notes } = req.body;
    
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.followUps.push({
      staff: req.user._id,
      notes,
      timestamp: new Date()
    });

    await complaint.save();
    await complaint.populate('followUps.staff', 'username');

    res.json({
      message: 'Follow-up added successfully',
      complaint
    });
  } catch (error) {
    console.error('Add follow-up error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Resolve complaint (admin/warden only)
router.post('/:id/resolve', auth, authorize('admin', 'warden'), async (req, res) => {
  try {
    const { resolutionNotes, resolutionImages } = req.body;
    
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        status: 'resolved',
        resolution: {
          resolvedAt: new Date(),
          resolvedBy: req.user._id,
          resolutionNotes,
          resolutionImages
        }
      },
      { new: true, runValidators: true }
    ).populate('student', 'studentId personalInfo.firstName personalInfo.lastName')
      .populate('resolution.resolvedBy', 'username');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json({
      message: 'Complaint resolved successfully',
      complaint
    });
  } catch (error) {
    console.error('Resolve complaint error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete complaint (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error('Delete complaint error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get complaint statistics (admin/warden only)
router.get('/stats/dashboard', auth, authorize('admin', 'warden'), async (req, res) => {
  try {
    const stats = await Complaint.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    const recentComplaints = await Complaint.find()
      .populate('student', 'studentId personalInfo.firstName personalInfo.lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      statusStats: stats,
      categoryStats,
      priorityStats,
      recentComplaints
    });
  } catch (error) {
    console.error('Get complaint stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search complaints
router.get('/search/query', auth, async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    let filter = {
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { 'location.roomNumber': { $regex: q, $options: 'i' } },
        { 'location.description': { $regex: q, $options: 'i' } }
      ]
    };

    // Students can only search their own complaints
    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user._id });
      filter.student = student._id;
    }

    const complaints = await Complaint.find(filter)
      .populate('student', 'studentId personalInfo.firstName personalInfo.lastName hostelInfo.roomNumber')
      .populate('assignedTo', 'username email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Complaint.countDocuments(filter);

    res.json({
      complaints,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Search complaints error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
