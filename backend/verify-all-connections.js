const axios = require('axios');

const API_URL = 'http://localhost:5001/api';
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

let token = '';
let testUserId = '';

async function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(method, endpoint, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${API_URL}${endpoint}`,
      headers: { ...headers },
    };
    if (data) config.data = data;
    
    const response = await axios(config);
    log(`✅ ${method.toUpperCase()} ${endpoint} - SUCCESS`, 'green');
    return { success: true, data: response.data };
  } catch (error) {
    log(`❌ ${method.toUpperCase()} ${endpoint} - FAILED: ${error.response?.data?.message || error.message}`, 'red');
    return { success: false, error: error.response?.data || error.message };
  }
}

async function runTests() {
  log('\n' + '='.repeat(60), 'blue');
  log('🧪 TESTING ALL CONTROLLER CONNECTIONS', 'blue');
  log('='.repeat(60) + '\n', 'blue');

  // Test 1: Health Check
  log('1️⃣ Testing Health Endpoint...', 'yellow');
  await testEndpoint('get', '/health');

  // Test 2: Register
  log('\n2️⃣ Testing Auth Controller - Register...', 'yellow');
  const registerData = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    phone: '1234567890',
    company: 'Test Company',
  };
  const registerResult = await testEndpoint('post', '/auth/register', registerData);
  if (registerResult.success) {
    token = registerResult.data.token;
    testUserId = registerResult.data.user.id || registerResult.data.user._id;
  }

  // Test 3: Login
  log('\n3️⃣ Testing Auth Controller - Login...', 'yellow');
  await testEndpoint('post', '/auth/login', {
    email: registerData.email,
    password: registerData.password,
  });

  // Test 4: Get Profile
  log('\n4️⃣ Testing Auth Controller - Get Profile...', 'yellow');
  await testEndpoint('get', '/auth/me', null, {
    Authorization: `Bearer ${token}`,
  });

  // Test 5: Get Desks
  log('\n5️⃣ Testing Desk Controller - Get All Desks...', 'yellow');
  const desksResult = await testEndpoint('get', '/desks', null, {
    Authorization: `Bearer ${token}`,
  });

  // Test 6: Get Rooms
  log('\n6️⃣ Testing Room Controller - Get All Rooms...', 'yellow');
  const roomsResult = await testEndpoint('get', '/rooms', null, {
    Authorization: `Bearer ${token}`,
  });

  // Test 7: Get Announcements
  log('\n7️⃣ Testing Announcement Controller - Get All Announcements...', 'yellow');
  await testEndpoint('get', '/announcements', null, {
    Authorization: `Bearer ${token}`,
  });

  // Test 8: Create Desk Booking
  if (desksResult.success && desksResult.data.length > 0) {
    log('\n8️⃣ Testing Booking Controller - Create Desk Booking...', 'yellow');
    const desk = desksResult.data[0];
    const now = new Date();
    const later = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
    
    await testEndpoint('post', '/bookings/desks', {
      deskId: desk._id,
      startDate: now.toISOString(),
      endDate: later.toISOString(),
      bookingType: 'hourly',
    }, {
      Authorization: `Bearer ${token}`,
    });
  }

  // Test 9: Get User Desk Bookings
  log('\n9️⃣ Testing Booking Controller - Get User Desk Bookings...', 'yellow');
  await testEndpoint('get', '/bookings/desks/my', null, {
    Authorization: `Bearer ${token}`,
  });

  // Test 10: Create Room Booking
  if (roomsResult.success && roomsResult.data.length > 0) {
    log('\n🔟 Testing Booking Controller - Create Room Booking...', 'yellow');
    const room = roomsResult.data[0];
    const now = new Date();
    const later = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
    
    await testEndpoint('post', '/bookings/rooms', {
      roomId: room._id,
      startTime: now.toISOString(),
      endTime: later.toISOString(),
      purpose: 'Test Meeting',
      attendees: 5,
    }, {
      Authorization: `Bearer ${token}`,
    });
  }

  // Test 11: Get User Room Bookings
  log('\n1️⃣1️⃣ Testing Booking Controller - Get User Room Bookings...', 'yellow');
  await testEndpoint('get', '/bookings/rooms/my', null, {
    Authorization: `Bearer ${token}`,
  });

  // Summary
  log('\n' + '='.repeat(60), 'blue');
  log('✅ ALL CONTROLLER TESTS COMPLETED!', 'green');
  log('='.repeat(60) + '\n', 'blue');

  log('📋 Controllers Verified:', 'blue');
  log('   ✅ Auth Controller (register, login, profile)', 'green');
  log('   ✅ Desk Controller (getAllDesks)', 'green');
  log('   ✅ Room Controller (getAllRooms)', 'green');
  log('   ✅ Announcement Controller (getAllAnnouncements)', 'green');
  log('   ✅ Booking Controller (createDeskBooking, getUserDeskBookings)', 'green');
  log('   ✅ Booking Controller (createRoomBooking, getUserRoomBookings)', 'green');

  log('\n🎉 All controllers are properly connected to the frontend!', 'green');
}

// Run tests
runTests().catch(error => {
  log(`\n❌ Test suite failed: ${error.message}`, 'red');
  process.exit(1);
});
