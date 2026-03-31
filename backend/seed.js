const mongoose = require('mongoose');
require('dotenv').config();
const Desk = require('./src/models/Desk');
const MeetingRoom = require('./src/models/MeetingRoom');
const Announcement = require('./src/models/Announcement');
const User = require('./src/models/User');

const sampleDesks = [
  {
    deskNumber: 'D101',
    location: 'zone-a',
    type: 'hot',
    amenities: ['power-outlet', 'monitor', 'high-speed-wifi'],
    dailyRate: 40,
    hourlyRate: 5,
    isAvailable: true,
    isActive: true,
    description: 'Comfortable desk in quiet zone',
  },
  {
    deskNumber: 'D102',
    location: 'zone-b',
    type: 'standing',
    amenities: ['power-outlet', 'dock-station', 'high-speed-wifi'],
    dailyRate: 48,
    hourlyRate: 6,
    isAvailable: true,
    isActive: true,
    description: 'Standing desk in collaborative area',
  },
  {
    deskNumber: 'D201',
    location: 'quiet-area',
    type: 'fixed',
    amenities: ['power-outlet', 'monitor', 'printer-access', 'high-speed-wifi'],
    dailyRate: 64,
    hourlyRate: 8,
    isAvailable: true,
    isActive: true,
    description: 'Premium desk with window view',
  },
  {
    deskNumber: 'D202',
    location: 'zone-c',
    type: 'hot',
    amenities: ['power-outlet', 'monitor', 'phone-booth'],
    dailyRate: 56,
    hourlyRate: 7,
    isAvailable: false,
    isActive: true,
    description: 'Tech-equipped workspace',
  },
];

const sampleRooms = [
  {
    roomNumber: 'R101',
    name: 'Conference Room A',
    capacity: 10,
    amenities: ['whiteboard', 'tv', 'video-conferencing', 'coffee-machine'],
    hourlyRate: 25,
    isAvailable: true,
    description: 'Large conference room with video conferencing',
    bookingRules: {
      maxHours: 8,
      advanceBookingDays: 30,
      minNoticeHours: 2,
    },
  },
  {
    roomNumber: 'R102',
    name: 'Meeting Room B',
    capacity: 6,
    amenities: ['whiteboard', 'tv', 'phone'],
    hourlyRate: 20,
    isAvailable: true,
    description: 'Small meeting room for team discussions',
    bookingRules: {
      maxHours: 4,
      advanceBookingDays: 14,
      minNoticeHours: 1,
    },
  },
  {
    roomNumber: 'R201',
    name: 'Board Room',
    capacity: 15,
    amenities: ['projector', 'whiteboard', 'video-conferencing', 'catering'],
    hourlyRate: 40,
    isAvailable: true,
    description: 'Premium board room for important meetings',
    bookingRules: {
      maxHours: 8,
      advanceBookingDays: 60,
      minNoticeHours: 4,
    },
  },
  {
    roomNumber: 'R103',
    name: 'Phone Booth 1',
    capacity: 1,
    amenities: ['phone'],
    hourlyRate: 5,
    isAvailable: true,
    description: 'Private phone booth for calls',
    bookingRules: {
      maxHours: 2,
      advanceBookingDays: 7,
      minNoticeHours: 0,
    },
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    await Desk.deleteMany({});
    await MeetingRoom.deleteMany({});
    await Announcement.deleteMany({});
    console.log('🗑️  Cleared existing data\n');

    // Insert sample desks
    const desks = await Desk.insertMany(sampleDesks);
    console.log(`✅ Seeded ${desks.length} desks\n`);

    // Insert sample rooms
    const rooms = await MeetingRoom.insertMany(sampleRooms);
    console.log(`✅ Seeded ${rooms.length} meeting rooms\n`);

    // Get first user (admin) for announcements
    const users = await User.find({});
    if (users.length > 0) {
      const sampleAnnouncements = [
        {
          title: 'Welcome to CoworkSpace!',
          content: 'We are excited to have you here. Explore our facilities and make the most of your workspace.',
          category: 'general',
          priority: 'high',
          author: users[0]._id,
          targetAudience: ['all'],
          isActive: true,
        },
        {
          title: 'Internet Maintenance Scheduled',
          content: 'Network maintenance will be performed on Sunday from 2 AM to 4 AM. Please plan accordingly.',
          category: 'maintenance',
          priority: 'medium',
          author: users[0]._id,
          targetAudience: ['all'],
          isActive: true,
        },
        {
          title: 'Networking Event This Friday',
          content: 'Join us for a networking event this Friday at 6 PM in the main lounge. Free snacks and drinks!',
          category: 'event',
          priority: 'high',
          author: users[0]._id,
          targetAudience: ['all', 'members'],
          isActive: true,
        },
        {
          title: 'New Booking Policy',
          content: 'Please note that all bookings must be cancelled at least 2 hours in advance for a full refund.',
          category: 'policy',
          priority: 'medium',
          author: users[0]._id,
          targetAudience: ['all'],
          isActive: true,
        },
      ];

      const announcements = await Announcement.insertMany(sampleAnnouncements);
      console.log(`✅ Seeded ${announcements.length} announcements\n`);
    } else {
      console.log('⚠️  No users found. Please register a user first, then run seed again.\n');
    }

    console.log('✅ Database seeded successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Desks: ${desks.length}`);
    console.log(`   - Rooms: ${rooms.length}`);
    console.log(`   - Announcements: ${users.length > 0 ? 4 : 0}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
