const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/roomController');

// @desc    Get all meeting rooms
// @route   GET /api/rooms
// @access  Private
router.get('/', protect, getAllRooms);

// @desc    Get room by ID
// @route   GET /api/rooms/:id
// @access  Private
router.get('/:id', protect, getRoomById);

// @desc    Create a room
// @route   POST /api/rooms
// @access  Private (Admin only)
router.post('/', protect, createRoom);

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private (Admin only)
router.put('/:id', protect, updateRoom);

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private (Admin only)
router.delete('/:id', protect, deleteRoom);

module.exports = router;
