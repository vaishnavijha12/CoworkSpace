const Desk = require('../models/Desk');

// Get all desks
exports.getAllDesks = async (req, res) => {
  try {
    const desks = await Desk.find({ isActive: true });
    console.log(`📋 Retrieved ${desks.length} desks`);
    res.json(desks);
  } catch (error) {
    console.error('❌ Get all desks error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get desk by ID
exports.getDeskById = async (req, res) => {
  try {
    const desk = await Desk.findById(req.params.id);
    if (!desk) {
      return res.status(404).json({ message: 'Desk not found' });
    }
    res.json(desk);
  } catch (error) {
    console.error('❌ Get desk by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create desk
exports.createDesk = async (req, res) => {
  try {
    const desk = new Desk(req.body);
    await desk.save();
    console.log(`✅ Created desk: ${desk.deskNumber}`);
    res.status(201).json({ success: true, desk });
  } catch (error) {
    console.error('❌ Create desk error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update desk
exports.updateDesk = async (req, res) => {
  try {
    const desk = await Desk.findByIdAndUpdate(req.params.id, req.body, { 
      new: true,
      runValidators: true 
    });
    if (!desk) {
      return res.status(404).json({ message: 'Desk not found' });
    }
    console.log(`✅ Updated desk: ${desk.deskNumber}`);
    res.json({ success: true, desk });
  } catch (error) {
    console.error('❌ Update desk error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete desk
exports.deleteDesk = async (req, res) => {
  try {
    const desk = await Desk.findByIdAndDelete(req.params.id);
    if (!desk) {
      return res.status(404).json({ message: 'Desk not found' });
    }
    console.log(`🗑️ Deleted desk: ${desk.deskNumber}`);
    res.json({ success: true, message: 'Desk deleted' });
  } catch (error) {
    console.error('❌ Delete desk error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
