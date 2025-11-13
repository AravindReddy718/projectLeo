const express = require('express');
const Student = require('../models/Student');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all students (admin/warden only)
router.get('/', auth, authorize('admin', 'warden'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, department, year } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (department) filter['academicInfo.department'] = department;
    if (year) filter['academicInfo.year'] = parseInt(year);

    const students = await Student.find(filter)
      .populate('user', 'username email role')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Student.countDocuments(filter);

    res.json({
      students,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user', 'username email role profile');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if user is authorized to view this student
    if (req.user.role === 'student' && student.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(student);
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new student (admin/warden only)
router.post('/', auth, authorize('admin', 'warden'), async (req, res) => {
  try {
    const {
      studentId,
      personalInfo,
      contactInfo,
      academicInfo,
      hostelInfo,
      documents,
      fees,
      userCredentials
    } = req.body;

    // Check if student ID already exists
    const existingStudent = await Student.findOne({ studentId });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student ID already exists' });
    }

    // Create user account for student
    const user = new User({
      username: userCredentials.username,
      email: userCredentials.email,
      password: userCredentials.password,
      role: 'student',
      profile: {
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        phone: contactInfo.phone
      }
    });

    await user.save();

    // Create student record
    const student = new Student({
      user: user._id,
      studentId,
      personalInfo,
      contactInfo,
      academicInfo,
      hostelInfo,
      documents,
      fees
    });

    await student.save();
    await student.populate('user', 'username email role');

    res.status(201).json({
      message: 'Student created successfully',
      student
    });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student information
router.put('/:id', auth, authorize('admin', 'warden'), async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'username email role');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      message: 'Student updated successfully',
      student
    });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student's own profile (limited fields)
router.put('/profile/:id', auth, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.params.id });
    
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // Students can only update their own profile
    if (req.user.role === 'student' && student.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Allow only certain fields to be updated by students
    const allowedUpdates = {
      'contactInfo.phone': req.body.contactInfo?.phone,
      'contactInfo.parentPhone': req.body.contactInfo?.parentPhone,
      'contactInfo.emergencyContact': req.body.contactInfo?.emergencyContact
    };

    const updatedStudent = await Student.findByIdAndUpdate(
      student._id,
      allowedUpdates,
      { new: true, runValidators: true }
    ).populate('user', 'username email role');

    res.json({
      message: 'Profile updated successfully',
      student: updatedStudent
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete student (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Delete associated user
    await User.findByIdAndDelete(student.user);
    
    // Delete student record
    await Student.findByIdAndDelete(req.params.id);

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student's own profile
router.get('/profile/me', auth, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
      .populate('user', 'username email role profile');

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    res.json(student);
  } catch (error) {
    console.error('Get own profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search students
router.get('/search/query', auth, authorize('admin', 'warden'), async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const students = await Student.find({
      $or: [
        { studentId: { $regex: q, $options: 'i' } },
        { 'personalInfo.firstName': { $regex: q, $options: 'i' } },
        { 'personalInfo.lastName': { $regex: q, $options: 'i' } },
        { 'academicInfo.rollNumber': { $regex: q, $options: 'i' } },
        { 'hostelInfo.roomNumber': { $regex: q, $options: 'i' } }
      ]
    })
      .populate('user', 'username email role')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Student.countDocuments({
      $or: [
        { studentId: { $regex: q, $options: 'i' } },
        { 'personalInfo.firstName': { $regex: q, $options: 'i' } },
        { 'personalInfo.lastName': { $regex: q, $options: 'i' } },
        { 'academicInfo.rollNumber': { $regex: q, $options: 'i' } },
        { 'hostelInfo.roomNumber': { $regex: q, $options: 'i' } }
      ]
    });

    res.json({
      students,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Search students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
