const express = require('express');
const mongoose = require('mongoose');
const Room = require('../models/Room');
const Student = require('../models/Student');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all rooms with filtering and pagination
router.get('/', auth, authorize('admin', 'warden'), async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      block, 
      floor, 
      status, 
      roomType,
      availability 
    } = req.query;
    
    let filter = {};
    
    if (block) filter.block = block;
    if (floor) filter.floor = parseInt(floor);
    if (status) filter.status = status;
    if (roomType) filter.roomType = roomType;
    
    // Filter by availability
    if (availability === 'available') {
      filter.status = 'available';
      filter.$expr = { $lt: ['$currentOccupancy', '$capacity'] };
    } else if (availability === 'full') {
      filter.$expr = { $gte: ['$currentOccupancy', '$capacity'] };
    }

    const rooms = await Room.find(filter)
      .populate('allocatedStudents.student', 'studentId personalInfo academicInfo')
      .populate('createdBy', 'username')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ block: 1, floor: 1, roomNumber: 1 });

    const total = await Room.countDocuments(filter);

    res.json({
      success: true,
      rooms,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching rooms',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get room by ID
router.get('/:id', auth, authorize('admin', 'warden'), async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('allocatedStudents.student', 'studentId personalInfo academicInfo contactInfo')
      .populate('createdBy', 'username email')
      .populate('lastUpdatedBy', 'username');

    if (!room) {
      return res.status(404).json({ 
        success: false,
        message: 'Room not found' 
      });
    }

    res.json({
      success: true,
      room
    });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching room details'
    });
  }
});

// Create new room
router.post('/', auth, authorize('admin', 'warden'), async (req, res) => {
  try {
    const {
      roomNumber,
      block,
      floor,
      roomType,
      capacity,
      amenities,
      facilities,
      rent
    } = req.body;

    // Check if room already exists
    const existingRoom = await Room.findOne({ roomNumber, block });
    if (existingRoom) {
      return res.status(400).json({ 
        success: false,
        message: 'Room already exists in this block' 
      });
    }

    const room = new Room({
      roomNumber,
      block,
      floor,
      roomType,
      capacity,
      amenities,
      facilities: {
        hasAC: facilities?.hasAC || false,
        hasAttachedBathroom: facilities?.hasAttachedBathroom || true,
        hasBalcony: facilities?.hasBalcony || false,
        studyTables: facilities?.studyTables || capacity,
        wardrobes: facilities?.wardrobes || capacity,
        beds: facilities?.beds || capacity
      },
      rent: {
        monthly: rent?.monthly || 5000,
        security: rent?.security || 2000,
        maintenance: rent?.maintenance || 500
      },
      createdBy: req.user._id
    });

    await room.save();
    await room.populate('createdBy', 'username');

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      room
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while creating room',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update room details
router.put('/:id', auth, authorize('admin', 'warden'), async (req, res) => {
  try {
    const updateData = { ...req.body, lastUpdatedBy: req.user._id };
    
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('allocatedStudents.student', 'studentId personalInfo')
     .populate('lastUpdatedBy', 'username');

    if (!room) {
      return res.status(404).json({ 
        success: false,
        message: 'Room not found' 
      });
    }

    res.json({
      success: true,
      message: 'Room updated successfully',
      room
    });
  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating room'
    });
  }
});

// Allocate student to room
router.post('/:id/allocate', auth, authorize('admin', 'warden'), async (req, res) => {
  try {
    const { studentId, bedNumber } = req.body;

    if (!studentId) {
      return res.status(400).json({ 
        success: false,
        message: 'Student ID is required' 
      });
    }

    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ 
        success: false,
        message: 'Room not found' 
      });
    }

    // Check if room can accommodate more students
    if (!room.canAccommodate(1)) {
      return res.status(400).json({ 
        success: false,
        message: 'Room is full or not available' 
      });
    }

    // Find the student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ 
        success: false,
        message: 'Student not found' 
      });
    }

    // Check if student is already allocated to a room
    const existingAllocation = await Room.findOne({
      'allocatedStudents.student': studentId,
      'allocatedStudents.status': 'active'
    });

    if (existingAllocation) {
      return res.status(400).json({ 
        success: false,
        message: 'Student is already allocated to another room' 
      });
    }

    // Determine bed number if not provided
    let assignedBedNumber = bedNumber;
    if (!assignedBedNumber) {
      const availableBeds = room.getAvailableBeds();
      if (availableBeds.length === 0) {
        return res.status(400).json({ 
          success: false,
          message: 'No available beds in this room' 
        });
      }
      assignedBedNumber = availableBeds[0];
    } else {
      // Check if bed is available
      const bedTaken = room.allocatedStudents.some(
        allocation => allocation.bedNumber === bedNumber && allocation.status === 'active'
      );
      if (bedTaken) {
        return res.status(400).json({ 
          success: false,
          message: 'Bed is already occupied' 
        });
      }
    }

    // Add student to room
    room.allocatedStudents.push({
      student: studentId,
      bedNumber: assignedBedNumber,
      allocatedDate: new Date(),
      status: 'active'
    });

    // Update student's hostel info
    student.hostelInfo = {
      ...student.hostelInfo,
      roomNumber: room.roomNumber,
      floor: room.floor,
      block: room.block,
      bedNumber: assignedBedNumber,
      checkInDate: new Date()
    };

    await Promise.all([room.save(), student.save()]);

    await room.populate('allocatedStudents.student', 'studentId personalInfo');

    res.json({
      success: true,
      message: 'Student allocated to room successfully',
      room,
      allocation: {
        student: studentId,
        bedNumber: assignedBedNumber,
        roomNumber: room.roomNumber,
        block: room.block
      }
    });
  } catch (error) {
    console.error('Allocate student error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while allocating student'
    });
  }
});

// Deallocate student from room
router.post('/:id/deallocate', auth, authorize('admin', 'warden'), async (req, res) => {
  try {
    const { studentId } = req.body;

    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ 
        success: false,
        message: 'Room not found' 
      });
    }

    // Find the allocation
    const allocationIndex = room.allocatedStudents.findIndex(
      allocation => allocation.student.toString() === studentId && allocation.status === 'active'
    );

    if (allocationIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Student not found in this room' 
      });
    }

    // Update allocation status
    room.allocatedStudents[allocationIndex].status = 'checkout';

    // Update student's hostel info
    const student = await Student.findById(studentId);
    if (student) {
      student.hostelInfo.checkOutDate = new Date();
      await student.save();
    }

    await room.save();
    await room.populate('allocatedStudents.student', 'studentId personalInfo');

    res.json({
      success: true,
      message: 'Student deallocated from room successfully',
      room
    });
  } catch (error) {
    console.error('Deallocate student error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while deallocating student'
    });
  }
});

// Get available rooms
router.get('/available/list', auth, authorize('admin', 'warden'), async (req, res) => {
  try {
    const { block, floor, roomType, hasAC } = req.query;
    
    const filters = {};
    if (block) filters.block = block;
    if (floor) filters.floor = parseInt(floor);
    if (roomType) filters.roomType = roomType;
    if (hasAC !== undefined) filters.hasAC = hasAC === 'true';

    const availableRooms = await Room.findAvailableRooms(filters);

    res.json({
      success: true,
      rooms: availableRooms,
      total: availableRooms.length
    });
  } catch (error) {
    console.error('Get available rooms error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching available rooms'
    });
  }
});

// Get room statistics
router.get('/stats/overview', auth, authorize('admin', 'warden'), async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ 
      status: 'available',
      $expr: { $lt: ['$currentOccupancy', '$capacity'] }
    });
    const occupiedRooms = await Room.countDocuments({ 
      $expr: { $gte: ['$currentOccupancy', '$capacity'] }
    });
    const maintenanceRooms = await Room.countDocuments({ status: 'maintenance' });

    // Block-wise statistics
    const blockStats = await Room.aggregate([
      {
        $group: {
          _id: '$block',
          totalRooms: { $sum: 1 },
          totalCapacity: { $sum: '$capacity' },
          currentOccupancy: { $sum: '$currentOccupancy' },
          availableRooms: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ['$status', 'available'] },
                  { $lt: ['$currentOccupancy', '$capacity'] }
                ]},
                1,
                0
              ]
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Room type statistics
    const roomTypeStats = await Room.aggregate([
      {
        $group: {
          _id: '$roomType',
          count: { $sum: 1 },
          totalCapacity: { $sum: '$capacity' },
          currentOccupancy: { $sum: '$currentOccupancy' }
        }
      }
    ]);

    res.json({
      success: true,
      overview: {
        totalRooms,
        availableRooms,
        occupiedRooms,
        maintenanceRooms,
        occupancyRate: totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(1) : 0
      },
      blockStats,
      roomTypeStats
    });
  } catch (error) {
    console.error('Get room stats error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching room statistics'
    });
  }
});

// Delete room (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ 
        success: false,
        message: 'Room not found' 
      });
    }

    // Check if room has active allocations
    const activeAllocations = room.allocatedStudents.filter(
      allocation => allocation.status === 'active'
    );

    if (activeAllocations.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot delete room with active student allocations' 
      });
    }

    await Room.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while deleting room'
    });
  }
});

module.exports = router;
