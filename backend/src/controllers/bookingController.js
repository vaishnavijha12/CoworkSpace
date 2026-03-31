const DeskBooking = require('../models/DeskBooking');
const RoomBooking = require('../models/RoomBooking');
const Desk = require('../models/Desk');
const MeetingRoom = require('../models/MeetingRoom');

// Create desk booking
exports.createDeskBooking = async (req, res) => {
  try {
    const { deskId, startDate, endDate, bookingType } = req.body;

    // Check if desk exists and is available
    const desk = await Desk.findById(deskId);
    if (!desk) {
      return res.status(404).json({ message: 'Desk not found' });
    }
    if (!desk.isAvailable) {
      return res.status(400).json({ message: 'Desk is not available' });
    }

    // Parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Calculate duration and price
    const hours = Math.ceil((end - start) / (1000 * 60 * 60));
    const totalAmount = desk.hourlyRate * hours;

    const booking = new DeskBooking({
      user: req.user.id,
      desk: deskId,
      bookingDate: start,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      duration: hours,
      totalAmount,
      status: 'confirmed',
      paymentStatus: 'pending',
    });

    await booking.save();
    await booking.populate('desk user');
    
    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error('Desk booking error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Optimized: Get user's desk bookings with lean queries
exports.getUserDeskBookings = async (req, res) => {
  try {
    const bookings = await DeskBooking.find({ user: req.user.id })
      .populate('desk', 'deskNumber location hourlyRate') // Only needed fields
      .select('-__v') // Exclude version key
      .lean() // Convert to plain JS objects (faster)
      .sort({ createdAt: -1 })
      .limit(100); // Limit results
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all desk bookings (Admin)
exports.getAllDeskBookings = async (req, res) => {
  try {
    const bookings = await DeskBooking.find()
      .populate('desk user')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel desk booking
exports.cancelDeskBooking = async (req, res) => {
  try {
    const booking = await DeskBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns the booking or is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = 'cancelled';
    await booking.save();
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create room booking
exports.createRoomBooking = async (req, res) => {
  try {
    const { roomId, startTime, endTime, purpose, attendees } = req.body;

    // Check if room exists and is available
    const room = await MeetingRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    if (!room.isAvailable) {
      return res.status(400).json({ message: 'Room is not available' });
    }

    // Parse dates
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    // Calculate duration and price
    const hours = Math.ceil((end - start) / (1000 * 60 * 60));
    const totalAmount = room.hourlyRate * hours;

    const booking = new RoomBooking({
      user: req.user.id,
      meetingRoom: roomId,
      bookingDate: start,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      duration: hours,
      attendees,
      purpose,
      totalAmount,
      status: 'confirmed',
      paymentStatus: 'pending',
    });

    await booking.save();
    await booking.populate('meetingRoom user');
    
    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error('Room booking error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Optimized: Get user's room bookings
exports.getUserRoomBookings = async (req, res) => {
  try {
    const bookings = await RoomBooking.find({ user: req.user.id })
      .populate('meetingRoom', 'name roomNumber hourlyRate capacity')
      .select('-__v')
      .lean()
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all room bookings (Admin)
exports.getAllRoomBookings = async (req, res) => {
  try {
    const bookings = await RoomBooking.find()
      .populate('meetingRoom user')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel room booking
exports.cancelRoomBooking = async (req, res) => {
  try {
    const booking = await RoomBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns the booking or is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = 'cancelled';
    await booking.save();
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
