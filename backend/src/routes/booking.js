const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createDeskBooking,
  getUserDeskBookings,
  getAllDeskBookings,
  cancelDeskBooking,
  createRoomBooking,
  getUserRoomBookings,
  getAllRoomBookings,
  cancelRoomBooking,
} = require('../controllers/bookingController');

// DESK BOOKINGS
// @desc    Create desk booking
// @route   POST /api/bookings/desks
// @access  Private
router.post('/desks', protect, createDeskBooking);

// @desc    Get user's desk bookings
// @route   GET /api/bookings/desks/my
// @access  Private
router.get('/desks/my', protect, getUserDeskBookings);

// @desc    Get all desk bookings
// @route   GET /api/bookings/desks
// @access  Private (Admin)
router.get('/desks', protect, getAllDeskBookings);

// @desc    Cancel desk booking
// @route   PUT /api/bookings/desks/:id/cancel
// @access  Private
router.put('/desks/:id/cancel', protect, cancelDeskBooking);

// ROOM BOOKINGS
// @desc    Create room booking
// @route   POST /api/bookings/rooms
// @access  Private
router.post('/rooms', protect, createRoomBooking);

// @desc    Get user's room bookings
// @route   GET /api/bookings/rooms/my
// @access  Private
router.get('/rooms/my', protect, getUserRoomBookings);

// @desc    Get all room bookings
// @route   GET /api/bookings/rooms
// @access  Private (Admin)
router.get('/rooms', protect, getAllRoomBookings);

// @desc    Cancel room booking
// @route   PUT /api/bookings/rooms/:id/cancel
// @access  Private
router.put('/rooms/:id/cancel', protect, cancelRoomBooking);

module.exports = router;
