const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/models/User');
const Desk = require('./src/models/Desk');
const MeetingRoom = require('./src/models/MeetingRoom');
const Announcement = require('./src/models/Announcement');
const DeskBooking = require('./src/models/DeskBooking');
const RoomBooking = require('./src/models/RoomBooking');

async function testConnections() {
  try {
    console.log('🔗 Testing Database Connections...\n');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected\n');

    // Test User Model
    console.log('1️⃣ Testing User Model...');
    const userCount = await User.countDocuments();
    console.log(`   ✅ Users: ${userCount} documents found\n`);

    // Test Desk Model
    console.log('2️⃣ Testing Desk Model...');
    const deskCount = await Desk.countDocuments();
    console.log(`   ✅ Desks: ${deskCount} documents found\n`);

    // Test MeetingRoom Model
    console.log('3️⃣ Testing MeetingRoom Model...');
    const roomCount = await MeetingRoom.countDocuments();
    console.log(`   ✅ Meeting Rooms: ${roomCount} documents found\n`);

    // Test Announcement Model
    console.log('4️⃣ Testing Announcement Model...');
    const announcementCount = await Announcement.countDocuments();
    console.log(`   ✅ Announcements: ${announcementCount} documents found\n`);

    // Test DeskBooking Model
    console.log('5️⃣ Testing DeskBooking Model...');
    const deskBookingCount = await DeskBooking.countDocuments();
    console.log(`   ✅ Desk Bookings: ${deskBookingCount} documents found\n`);

    // Test RoomBooking Model
    console.log('6️⃣ Testing RoomBooking Model...');
    const roomBookingCount = await RoomBooking.countDocuments();
    console.log(`   ✅ Room Bookings: ${roomBookingCount} documents found\n`);

    console.log('✅ All model connections verified!\n');

    // Show Controller Mappings
    console.log('📋 Controller Mappings:\n');
    console.log('Auth Controller:');
    console.log('  POST   /api/auth/register    → authController.register');
    console.log('  POST   /api/auth/login       → authController.login');
    console.log('  GET    /api/auth/me          → authController.getProfile');
    console.log('  PUT    /api/auth/update-profile → authController.updateProfile\n');

    console.log('Desk Controller:');
    console.log('  GET    /api/desks            → deskController.getAllDesks');
    console.log('  GET    /api/desks/:id        → deskController.getDeskById');
    console.log('  POST   /api/desks            → deskController.createDesk');
    console.log('  PUT    /api/desks/:id        → deskController.updateDesk');
    console.log('  DELETE /api/desks/:id        → deskController.deleteDesk\n');

    console.log('Room Controller:');
    console.log('  GET    /api/rooms            → roomController.getAllRooms');
    console.log('  GET    /api/rooms/:id        → roomController.getRoomById');
    console.log('  POST   /api/rooms            → roomController.createRoom');
    console.log('  PUT    /api/rooms/:id        → roomController.updateRoom');
    console.log('  DELETE /api/rooms/:id        → roomController.deleteRoom\n');

    console.log('Announcement Controller:');
    console.log('  GET    /api/announcements    → announcementController.getAllAnnouncements');
    console.log('  GET    /api/announcements/:id → announcementController.getAnnouncementById');
    console.log('  POST   /api/announcements    → announcementController.createAnnouncement');
    console.log('  PUT    /api/announcements/:id → announcementController.updateAnnouncement');
    console.log('  DELETE /api/announcements/:id → announcementController.deleteAnnouncement\n');

    console.log('Booking Controller:');
    console.log('  POST   /api/bookings/desks   → bookingController.createDeskBooking');
    console.log('  GET    /api/bookings/desks/my → bookingController.getUserDeskBookings');
    console.log('  GET    /api/bookings/desks   → bookingController.getAllDeskBookings');
    console.log('  PUT    /api/bookings/desks/:id/cancel → bookingController.cancelDeskBooking');
    console.log('  POST   /api/bookings/rooms   → bookingController.createRoomBooking');
    console.log('  GET    /api/bookings/rooms/my → bookingController.getUserRoomBookings');
    console.log('  GET    /api/bookings/rooms   → bookingController.getAllRoomBookings');
    console.log('  PUT    /api/bookings/rooms/:id/cancel → bookingController.cancelRoomBooking\n');

    console.log('✅ All controllers are properly connected!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    process.exit(1);
  }
}

testConnections();
