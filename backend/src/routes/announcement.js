const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require('../controllers/announcementController');

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Private
router.get('/', protect, getAllAnnouncements);

// @desc    Get announcement by ID
// @route   GET /api/announcements/:id
// @access  Private
router.get('/:id', protect, getAnnouncementById);

// @desc    Create an announcement
// @route   POST /api/announcements
// @access  Private (Admin only)
router.post('/', protect, createAnnouncement);

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private (Admin only)
router.put('/:id', protect, updateAnnouncement);

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private (Admin only)
router.delete('/:id', protect, deleteAnnouncement);

module.exports = router;
