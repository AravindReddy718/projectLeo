const express = require('express');
const Student = require('../models/Student');
const Complaint = require('../models/Complaint');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get dashboard overview (admin/warden only)
router.get('/overview', auth, authorize('admin', 'warden'), async (req, res) => {
  try {
    // Get basic counts
    const totalStudents = await Student.countDocuments({ status: 'active' });
    const totalComplaints = await Complaint.countDocuments();
    const totalPayments = await Payment.countDocuments();
    const totalUsers = await User.countDocuments({ isActive: true });

    // Get complaint stats
    const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });
    const inProgressComplaints = await Complaint.countDocuments({ status: 'in-progress' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });

    // Get payment stats
    const pendingPayments = await Payment.countDocuments({ status: 'pending' });
    const completedPayments = await Payment.countDocuments({ status: 'completed' });
    const overduePayments = await Payment.countDocuments({
      status: 'pending',
      dueDate: { $lt: new Date() }
    });

    // Get financial summary
    const financialStats = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          collectedRevenue: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0]
            }
          },
          pendingRevenue: {
            $sum: {
              $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0]
            }
          }
        }
      }
    ]);

    // Get recent activities
    const recentComplaints = await Complaint.find()
      .populate('student', 'studentId personalInfo.firstName personalInfo.lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentPayments = await Payment.find({ status: 'paid' })
      .populate('student', 'studentId personalInfo.firstName personalInfo.lastName')
      .sort({ paidDate: -1 })
      .limit(5);

    // Get student distribution by department
    const departmentStats = await Student.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$academicInfo.department',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get student distribution by year
    const yearStats = await Student.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$academicInfo.year',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      overview: {
        totalStudents,
        totalComplaints,
        totalPayments,
        totalUsers,
        pendingComplaints,
        inProgressComplaints,
        resolvedComplaints,
        pendingPayments,
        completedPayments,
        overduePayments
      },
      financial: financialStats[0] || {
        totalRevenue: 0,
        collectedRevenue: 0,
        pendingRevenue: 0
      },
      recentActivities: {
        recentComplaints,
        recentPayments
      },
      distributions: {
        departments: departmentStats,
        years: yearStats
      }
    });
  } catch (error) {
    console.error('Get dashboard overview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student dashboard (students only)
router.get('/student', auth, authorize('student'), async (req, res) => {
  try {
    // Get student profile
    const student = await Student.findOne({ user: req.user._id })
      .populate('user', 'username email');

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // Get student's complaints
    const totalComplaints = await Complaint.countDocuments({ student: student._id });
    const pendingComplaints = await Complaint.countDocuments({ 
      student: student._id, 
      status: 'pending' 
    });
    const resolvedComplaints = await Complaint.countDocuments({ 
      student: student._id, 
      status: 'resolved' 
    });

    // Get student's payments
    const totalPayments = await Payment.countDocuments({ student: student._id });
    const pendingPayments = await Payment.countDocuments({ 
      student: student._id, 
      status: 'pending' 
    });
    const paidPayments = await Payment.countDocuments({ 
      student: student._id, 
      status: 'paid' 
    });

    // Get overdue payments
    const overduePayments = await Payment.countDocuments({
      student: student._id,
      status: 'pending',
      dueDate: { $lt: new Date() }
    });

    // Get recent complaints
    const recentComplaints = await Complaint.find({ student: student._id })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent payments
    const recentPayments = await Payment.find({ student: student._id })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get fee summary
    const feeSummary = {
      totalFees: student.fees.totalFees,
      paidFees: student.fees.paidFees,
      pendingFees: student.fees.pendingFees
    };

    res.json({
      student: {
        studentId: student.studentId,
        personalInfo: student.personalInfo,
        academicInfo: student.academicInfo,
        hostelInfo: student.hostelInfo,
        feeSummary
      },
      stats: {
        complaints: {
          total: totalComplaints,
          pending: pendingComplaints,
          resolved: resolvedComplaints
        },
        payments: {
          total: totalPayments,
          pending: pendingPayments,
          paid: paidPayments,
          overdue: overduePayments
        }
      },
      recentActivities: {
        recentComplaints,
        recentPayments
      }
    });
  } catch (error) {
    console.error('Get student dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get monthly statistics (admin/warden only)
router.get('/monthly-stats', auth, authorize('admin', 'warden'), async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;

    // Get monthly complaints
    const monthlyComplaints = await Complaint.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get monthly payments
    const monthlyPayments = await Payment.aggregate([
      {
        $match: {
          paidDate: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$paidDate' },
          count: { $sum: 1 },
          amount: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Initialize arrays for all 12 months
    const complaintsData = Array(12).fill(0);
    const paymentsData = Array(12).fill(0);
    const revenueData = Array(12).fill(0);

    // Fill complaint data
    monthlyComplaints.forEach(item => {
      complaintsData[item._id - 1] = item.count;
    });

    // Fill payment data
    monthlyPayments.forEach(item => {
      paymentsData[item._id - 1] = item.count;
      revenueData[item._id - 1] = item.amount;
    });

    res.json({
      year,
      complaints: complaintsData,
      payments: paymentsData,
      revenue: revenueData
    });
  } catch (error) {
    console.error('Get monthly stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get room occupancy statistics (admin/warden only)
router.get('/room-occupancy', auth, authorize('admin', 'warden'), async (req, res) => {
  try {
    // Get room distribution by block
    const blockStats = await Student.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$hostelInfo.block',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get room distribution by floor
    const floorStats = await Student.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$hostelInfo.floor',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get room capacity details
    const roomDetails = await Student.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: {
            block: '$hostelInfo.block',
            roomNumber: '$hostelInfo.roomNumber'
          },
          students: { $push: '$$ROOT' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.block': 1, '_id.roomNumber': 1 } }
    ]);

    res.json({
      blockStats,
      floorStats,
      roomDetails
    });
  } catch (error) {
    console.error('Get room occupancy error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get performance metrics (admin/warden only)
router.get('/performance', auth, authorize('admin', 'warden'), async (req, res) => {
  try {
    // Complaint resolution time
    const resolutionStats = await Complaint.aggregate([
      { $match: { status: 'resolved', 'resolution.resolvedAt': { $exists: true } } },
      {
        $project: {
          resolutionTime: {
            $divide: [
              { $subtract: ['$resolution.resolvedAt', '$createdAt'] },
              1000 * 60 * 60 * 24 // Convert to days
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgResolutionTime: { $avg: '$resolutionTime' },
          minResolutionTime: { $min: '$resolutionTime' },
          maxResolutionTime: { $max: '$resolutionTime' }
        }
      }
    ]);

    // Payment collection rate
    const paymentStats = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalPayments: { $sum: 1 },
          paidPayments: {
            $sum: { $cond: [{ $eq: ['$status', 'paid'] }, 1, 0] }
          },
          totalAmount: { $sum: '$totalAmount' },
          collectedAmount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'paid'] }, '$totalAmount', 0]
            }
          }
        }
      },
      {
        $project: {
          collectionRate: {
            $multiply: [
              { $divide: ['$paidPayments', '$totalPayments'] },
              100
            ]
          },
          revenueCollectionRate: {
            $multiply: [
              { $divide: ['$collectedAmount', '$totalAmount'] },
              100
            ]
          }
        }
      }
    ]);

    // Complaint category performance
    const categoryPerformance = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          category: '$_id',
          total: 1,
          resolved: 1,
          resolutionRate: {
            $multiply: [
              { $divide: ['$resolved', '$total'] },
              100
            ]
          }
        }
      }
    ]);

    res.json({
      resolutionStats: resolutionStats[0] || {
        avgResolutionTime: 0,
        minResolutionTime: 0,
        maxResolutionTime: 0
      },
      paymentStats: paymentStats[0] || {
        collectionRate: 0,
        revenueCollectionRate: 0
      },
      categoryPerformance
    });
  } catch (error) {
    console.error('Get performance metrics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
