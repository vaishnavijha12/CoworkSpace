const mongoose = require('mongoose');

const roomBookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  meetingRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MeetingRoom',
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
  attendees: {
    type: Number,
    required: true,
    min: [1, 'At least 1 attendee is required'],
  },
  purpose: {
    type: String,
    required: [true, 'Please add meeting purpose'],
    maxlength: [200, 'Purpose cannot be more than 200 characters'],
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending',
  },
  amenitiesRequested: [{
    type: String,
    enum: ['catering', 'projector', 'whiteboard-supplies', 'video-conferencing-setup'],
  }],
  specialInstructions: {
    type: String,
    maxlength: [500, 'Instructions cannot be more than 500 characters'],
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
roomBookingSchema.index({ bookingDate: 1, meetingRoom: 1 });
roomBookingSchema.index({ user: 1, bookingDate: 1 });

module.exports = mongoose.model('RoomBooking', roomBookingSchema);