const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'hostel_fees',
      'mess_fees',
      'electricity',
      'water',
      'maintenance',
      'fine',
      'other'
    ]
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  dueDate: {
    type: Date,
    required: true
  },
  paidDate: Date,
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'online', 'cheque', 'dd'],
    required: function() {
      return this.status === 'paid';
    }
  },
  transactionId: String,
  receiptNumber: String,
  description: {
    type: String,
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lateFee: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  notes: String
}, {
  timestamps: true
});

// Calculate total amount before saving
paymentSchema.pre('save', function(next) {
  this.totalAmount = this.amount + this.lateFee - this.discount;
  if (this.totalAmount < 0) this.totalAmount = 0;
  next();
});

// Index for faster queries
paymentSchema.index({ student: 1, status: 1 });
paymentSchema.index({ type: 1, status: 1 });
paymentSchema.index({ dueDate: 1, status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
