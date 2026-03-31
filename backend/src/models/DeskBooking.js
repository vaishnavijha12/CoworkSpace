const mongoose = require('mongoose');

const deskBookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  desk: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Desk',
    required: true,
  },
  bookingDate: {
    type: Date,
    required: [true, 'Please add booking date'],
  },
  startTime: {
    type: String,
    required: [true, 'Please add start time'],
  },
  endTime: {
    type: String,
    required: [true, 'Please add end time'],
  },
  duration: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'confirmed',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'bank_transfer', 'cash', 'wallet'],
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot be more than 500 characters'],
  },
  checkedInAt: {
    type: Date,
  },
  checkedOutAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
deskBookingSchema.index({ bookingDate: 1, desk: 1 });
deskBookingSchema.index({ user: 1, bookingDate: 1 });

module.exports = mongoose.model('DeskBooking', deskBookingSchema);