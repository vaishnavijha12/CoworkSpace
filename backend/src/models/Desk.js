const mongoose = require('mongoose');

const deskSchema = new mongoose.Schema({
  deskNumber: {
    type: String,
    required: [true, 'Please add a desk number'],
    unique: true,
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
    enum: ['zone-a', 'zone-b', 'zone-c', 'quiet-area', 'collaborative-area'],
  },
  type: {
    type: String,
    enum: ['fixed', 'hot', 'dedicated', 'standing'],
    default: 'hot',
  },
  amenities: [{
    type: String,
    enum: ['power-outlet', 'monitor', 'dock-station', 'phone-booth', 'printer-access', 'high-speed-wifi'],
  }],
  dailyRate: {
    type: Number,
    required: [true, 'Please add a daily rate'],
  },
  hourlyRate: {
    type: Number,
    required: [true, 'Please add an hourly rate'],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  isActive: {
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Desk', deskSchema);