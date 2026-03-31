const MeetingRoom = require('../models/MeetingRoom');

// Get all meeting rooms
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await MeetingRoom.find();
    console.log(`📋 Retrieved ${rooms.length} meeting rooms`);
    res.json(rooms);
  } catch (error) {
    console.error('❌ Get all rooms error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get room by ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await MeetingRoom.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    console.error('❌ Get room by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create room
exports.createRoom = async (req, res) => {
  try {
    const room = new MeetingRoom(req.body);
    await room.save();
    console.log(`✅ Created room: ${room.name}`);
    res.status(201).json({ success: true, room });
  } catch (error) {
    console.error('❌ Create room error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update room
exports.updateRoom = async (req, res) => {
  try {
    const room = await MeetingRoom.findByIdAndUpdate(req.params.id, req.body, { 
      new: true,
      runValidators: true 
    });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    console.log(`✅ Updated room: ${room.name}`);
    res.json({ success: true, room });
  } catch (error) {
    console.error('❌ Update room error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete room
exports.deleteRoom = async (req, res) => {
  try {
    const room = await MeetingRoom.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    console.log(`🗑️ Deleted room: ${room.name}`);
    res.json({ success: true, message: 'Room deleted' });
  } catch (error) {
    console.error('❌ Delete room error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
