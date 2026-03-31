const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAllDesks,
  getDeskById,
  createDesk,
  updateDesk,
  deleteDesk,
} = require('../controllers/deskController');

// @desc    Get all desks
// @route   GET /api/desks
// @access  Private
router.get('/', protect, getAllDesks);

// @desc    Get desk by ID
// @route   GET /api/desks/:id
// @access  Private
router.get('/:id', protect, getDeskById);

// @desc    Create a desk
// @route   POST /api/desks
// @access  Private (Admin only)
router.post('/', protect, createDesk);

// @desc    Update desk
// @route   PUT /api/desks/:id
// @access  Private (Admin only)
router.put('/:id', protect, updateDesk);

// @desc    Delete desk
// @route   DELETE /api/desks/:id
// @access  Private (Admin only)
router.delete('/:id', protect, deleteDesk);

module.exports = router;
