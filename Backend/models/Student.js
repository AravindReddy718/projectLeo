const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  personalInfo: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    bloodGroup: String,
    nationality: {
      type: String,
      default: 'Indian'
    }
  },
  contactInfo: {
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    parentPhone: String,
    emergencyContact: {
      name: String,
      phone: String,
      relation: String
    }
  },
  academicInfo: {
    rollNumber: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true,
      min: 1,
      max: 4
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 10
    }
  },
  hostelInfo: {
    roomNumber: {
      type: String,
      required: true
    },
    floor: Number,
    block: String,
    bedNumber: String,
    checkInDate: {
      type: Date,
      default: Date.now
    },
    checkOutDate: Date
  },
  documents: {
    aadharNumber: String,
    admissionProof: String,
    medicalCertificate: String,
    parentalConsent: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'graduated', 'suspended'],
    default: 'active'
  },
  fees: {
    totalFees: {
      type: Number,
      default: 0
    },
    paidFees: {
      type: Number,
      default: 0
    },
    pendingFees: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Calculate pending fees
studentSchema.pre('save', function(next) {
  this.fees.pendingFees = this.fees.totalFees - this.fees.paidFees;
  next();
});

module.exports = mongoose.model('Student', studentSchema);
