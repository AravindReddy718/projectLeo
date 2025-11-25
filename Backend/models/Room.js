const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true
  },
  block: {
    type: String,
    required: true
  },
  floor: {
    type: Number,
    required: true
  },
  roomType: {
    type: String,
    enum: ['single', 'double', 'triple', 'quad'],
    default: 'double'
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  currentOccupancy: {
    type: Number,
    default: 0,
    min: 0
  },
  amenities: [{
    type: String,
    enum: ['AC', 'Fan', 'Attached Bathroom', 'Balcony', 'Study Table', 'Wardrobe', 'WiFi']
  }],
  facilities: {
    hasAC: {
      type: Boolean,
      default: false
    },
    hasAttachedBathroom: {
      type: Boolean,
      default: true
    },
    hasBalcony: {
      type: Boolean,
      default: false
    },
    studyTables: {
      type: Number,
      default: 2
    },
    wardrobes: {
      type: Number,
      default: 2
    },
    beds: {
      type: Number,
      default: 2
    }
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance', 'reserved'],
    default: 'available'
  },
  rent: {
    monthly: {
      type: Number,
      required: true,
      default: 5000
    },
    security: {
      type: Number,
      default: 2000
    },
    maintenance: {
      type: Number,
      default: 500
    }
  },
  allocatedStudents: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    bedNumber: {
      type: String,
      required: true
    },
    allocatedDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'checkout', 'transferred'],
      default: 'active'
    }
  }],
  maintenanceHistory: [{
    issue: String,
    reportedDate: {
      type: Date,
      default: Date.now
    },
    resolvedDate: Date,
    status: {
      type: String,
      enum: ['reported', 'in-progress', 'resolved'],
      default: 'reported'
    },
    cost: Number,
    description: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Compound index for unique room identification
roomSchema.index({ roomNumber: 1, block: 1 }, { unique: true });

// Virtual for availability status
roomSchema.virtual('isAvailable').get(function() {
  return this.currentOccupancy < this.capacity && this.status === 'available';
});

// Virtual for occupancy percentage
roomSchema.virtual('occupancyPercentage').get(function() {
  return Math.round((this.currentOccupancy / this.capacity) * 100);
});

// Method to check if room can accommodate more students
roomSchema.methods.canAccommodate = function(numberOfStudents = 1) {
  return (this.currentOccupancy + numberOfStudents) <= this.capacity && this.status === 'available';
};

// Method to get available bed numbers
roomSchema.methods.getAvailableBeds = function() {
  const totalBeds = this.facilities.beds || this.capacity;
  const occupiedBeds = this.allocatedStudents
    .filter(allocation => allocation.status === 'active')
    .map(allocation => allocation.bedNumber);
  
  const availableBeds = [];
  for (let i = 1; i <= totalBeds; i++) {
    const bedNumber = `B${i}`;
    if (!occupiedBeds.includes(bedNumber)) {
      availableBeds.push(bedNumber);
    }
  }
  return availableBeds;
};

// Pre-save middleware to update occupancy count
roomSchema.pre('save', function(next) {
  if (this.isModified('allocatedStudents')) {
    this.currentOccupancy = this.allocatedStudents.filter(
      allocation => allocation.status === 'active'
    ).length;
    
    // Update status based on occupancy
    if (this.currentOccupancy === 0) {
      this.status = 'available';
    } else if (this.currentOccupancy >= this.capacity) {
      this.status = 'occupied';
    }
  }
  next();
});

// Static method to find available rooms
roomSchema.statics.findAvailableRooms = function(filters = {}) {
  const query = {
    status: 'available',
    $expr: { $lt: ['$currentOccupancy', '$capacity'] }
  };
  
  if (filters.block) query.block = filters.block;
  if (filters.floor) query.floor = filters.floor;
  if (filters.roomType) query.roomType = filters.roomType;
  if (filters.hasAC !== undefined) query['facilities.hasAC'] = filters.hasAC;
  
  return this.find(query).populate('allocatedStudents.student', 'studentId personalInfo');
};

module.exports = mongoose.model('Room', roomSchema);
