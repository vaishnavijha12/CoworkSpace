const mongoose = require('mongoose');

const meetingRoomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, 'Please add a room number'],
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: [true, 'Please add a room name'],
    trim: true,
  },
  capacity: {
    type: Number,
    required: [true, 'Please add room capacity'],
    min: [2, 'Capacity must be at least 2'],
  },
  amenities: [{
    type: String,
    enum: ['projector', 'whiteboard', 'tv', 'video-conferencing', 'phone', 'coffee-machine', 'catering'],
  }],
  hourlyRate: {
    type: Number,
    required: [true, 'Please add an hourly rate'],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  imageUrl: {
    type: String,
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  bookingRules: {
    maxHours: {
      type: Number,
      default: 4,
    },
    advanceBookingDays: {
      type: Number,
      default: 30,
    },
    minNoticeHours: {
      type: Number,
      default: 2,
    },
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

module.exports = mongoose.model('MeetingRoom', meetingRoomSchema);