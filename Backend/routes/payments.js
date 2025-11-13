const express = require('express');
const Payment = require('../models/Payment');
const Student = require('../models/Student');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all payments (filtered by role)
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      type, 
      studentId,
      academicYear,
      semester
    } = req.query;
    
    let filter = {};
    
    // Students can only see their own payments
    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user._id });
      if (!student) {
        return res.status(404).json({ message: 'Student profile not found' });
      }
      filter.student = student._id;
    }
    
    // Apply additional filters
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (academicYear) filter.academicYear = academicYear;
    if (semester) filter.semester = parseInt(semester);
    if (studentId && (req.user.role === 'admin' || req.user.role === 'warden')) {
      filter.student = studentId;
    }

    const payments = await Payment.find(filter)
      .populate('student', 'studentId personalInfo.firstName personalInfo.lastName hostelInfo.roomNumber')
      .populate('paidBy', 'username email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ dueDate: -1 });

    const total = await Payment.countDocuments(filter);

    res.json({
      payments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payment by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('student', 'studentId personalInfo contactInfo hostelInfo')
      .populate('paidBy', 'username email');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check if user is authorized to view this payment
    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user._id });
      if (payment.student._id.toString() !== student._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json(payment);
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new payment (admin/warden only)
router.post('/', auth, authorize('admin', 'warden'), async (req, res) => {
  try {
    const {
      student,
      type,
      amount,
      dueDate,
      description,
      academicYear,
      semester,
      lateFee,
      discount,
      notes
    } = req.body;

    // Check if student exists
    const studentDoc = await Student.findById(student);
    if (!studentDoc) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const payment = new Payment({
      student,
      type,
      amount,
      dueDate,
      description,
      academicYear,
      semester,
      lateFee: lateFee || 0,
      discount: discount || 0,
      notes
    });

    await payment.save();
    await payment.populate('student', 'studentId personalInfo.firstName personalInfo.lastName hostelInfo.roomNumber');

    // Update student's fee information
    studentDoc.fees.totalFees += payment.totalAmount;
    studentDoc.fees.pendingFees += payment.totalAmount;
    await studentDoc.save();

    res.status(201).json({
      message: 'Payment created successfully',
      payment
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update payment (admin/warden only)
router.put('/:id', auth, authorize('admin', 'warden'), async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Update payment
    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('student', 'studentId personalInfo.firstName personalInfo.lastName hostelInfo.roomNumber');

    // Recalculate student fees if payment amount changed
    const student = await Student.findById(payment.student);
    const oldTotal = payment.totalAmount;
    const newTotal = updatedPayment.totalAmount;
    
    if (oldTotal !== newTotal) {
      student.fees.totalFees = student.fees.totalFees - oldTotal + newTotal;
      student.fees.pendingFees = student.fees.totalFees - student.fees.paidFees;
      await student.save();
    }

    res.json({
      message: 'Payment updated successfully',
      payment: updatedPayment
    });
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark payment as paid (admin/warden only)
router.post('/:id/pay', auth, authorize('admin', 'warden'), async (req, res) => {
  try {
    const { paymentMethod, transactionId, receiptNumber } = req.body;
    
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status === 'paid') {
      return res.status(400).json({ message: 'Payment is already marked as paid' });
    }

    // Update payment status
    payment.status = 'paid';
    payment.paidDate = new Date();
    payment.paymentMethod = paymentMethod;
    payment.transactionId = transactionId;
    payment.receiptNumber = receiptNumber;
    payment.paidBy = req.user._id;

    await payment.save();
    await payment.populate('student', 'studentId personalInfo.firstName personalInfo.lastName hostelInfo.roomNumber')
      .populate('paidBy', 'username email');

    // Update student's fee information
    const student = await Student.findById(payment.student);
    student.fees.paidFees += payment.totalAmount;
    student.fees.pendingFees = student.fees.totalFees - student.fees.paidFees;
    await student.save();

    res.json({
      message: 'Payment marked as paid successfully',
      payment
    });
  } catch (error) {
    console.error('Mark payment as paid error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get overdue payments (admin/warden only)
router.get('/overdue/list', auth, authorize('admin', 'warden'), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const payments = await Payment.find({
      status: 'pending',
      dueDate: { $lt: new Date() }
    })
      .populate('student', 'studentId personalInfo.firstName personalInfo.lastName contactInfo hostelInfo.roomNumber')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ dueDate: 1 });

    const total = await Payment.countDocuments({
      status: 'pending',
      dueDate: { $lt: new Date() }
    });

    res.json({
      payments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get overdue payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payment statistics (admin/warden only)
router.get('/stats/dashboard', auth, authorize('admin', 'warden'), async (req, res) => {
  try {
    const statusStats = await Payment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    const typeStats = await Payment.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    const currentYear = new Date().getFullYear();
    const yearStats = await Payment.aggregate([
      {
        $match: {
          academicYear: { $regex: currentYear.toString() }
        }
      },
      {
        $group: {
          _id: '$academicYear',
          totalAmount: { $sum: '$totalAmount' },
          paidAmount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'paid'] }, '$totalAmount', 0]
            }
          },
          pendingAmount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'pending'] }, '$totalAmount', 0]
            }
          }
        }
      }
    ]);

    const recentPayments = await Payment.find()
      .populate('student', 'studentId personalInfo.firstName personalInfo.lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      statusStats,
      typeStats,
      yearStats,
      recentPayments
    });
  } catch (error) {
    console.error('Get payment stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate fee receipt (admin/warden only)
router.post('/:id/receipt', auth, authorize('admin', 'warden'), async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('student', 'studentId personalInfo contactInfo hostelInfo')
      .populate('paidBy', 'username email');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status !== 'paid') {
      return res.status(400).json({ message: 'Cannot generate receipt for unpaid payment' });
    }

    // Generate receipt data
    const receipt = {
      receiptNumber: payment.receiptNumber,
      paymentDate: payment.paidDate,
      studentName: `${payment.student.personalInfo.firstName} ${payment.student.personalInfo.lastName}`,
      studentId: payment.student.studentId,
      roomNumber: payment.student.hostelInfo.roomNumber,
      paymentType: payment.type,
      description: payment.description,
      amount: payment.amount,
      lateFee: payment.lateFee,
      discount: payment.discount,
      totalAmount: payment.totalAmount,
      paymentMethod: payment.paymentMethod,
      transactionId: payment.transactionId,
      collectedBy: payment.paidBy.username,
      academicYear: payment.academicYear,
      semester: payment.semester
    };

    res.json({
      message: 'Receipt generated successfully',
      receipt
    });
  } catch (error) {
    console.error('Generate receipt error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete payment (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Update student's fee information
    const student = await Student.findById(payment.student);
    if (payment.status === 'paid') {
      student.fees.paidFees -= payment.totalAmount;
    }
    student.fees.totalFees -= payment.totalAmount;
    student.fees.pendingFees = student.fees.totalFees - student.fees.paidFees;
    await student.save();

    // Delete payment
    await Payment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Delete payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
