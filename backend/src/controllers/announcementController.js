const Announcement = require('../models/Announcement');

// Get all announcements
exports.getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true })
      .sort({ createdAt: -1 })
      .populate('author', 'name email');
    console.log(`📋 Retrieved ${announcements.length} announcements`);
    res.json({ success: true, announcements });
  } catch (error) {
    console.error('❌ Get all announcements error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get announcement by ID
exports.getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('author', 'name email');
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json({ success: true, announcement });
  } catch (error) {
    console.error('❌ Get announcement by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create announcement (Admin only)
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content, category, priority } = req.body;
    const announcement = new Announcement({
      title,
      content,
      category,
      priority,
      author: req.user.id,
      targetAudience: ['all'],
    });
    await announcement.save();
    console.log(`✅ Created announcement: ${announcement.title}`);
    res.status(201).json({ success: true, announcement });
  } catch (error) {
    console.error('❌ Create announcement error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update announcement (Admin only)
exports.updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    console.log(`✅ Updated announcement: ${announcement.title}`);
    res.json({ success: true, announcement });
  } catch (error) {
    console.error('❌ Update announcement error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete announcement (Admin only)
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    console.log(`🗑️ Deleted announcement: ${announcement.title}`);
    res.json({ success: true, message: 'Announcement deleted' });
  } catch (error) {
    console.error('❌ Delete announcement error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
