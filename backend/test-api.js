const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

async function testAPI() {
  console.log('🧪 Testing API Endpoints...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const health = await axios.get(`${API_URL}/health`);
    console.log('✅ Health:', health.data);

    // Test 2: Register
    console.log('\n2️⃣ Testing registration...');
    const registerData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      phone: '1234567890',
      company: 'Test Company'
    };
    const register = await axios.post(`${API_URL}/auth/register`, registerData);
    console.log('✅ Register:', register.data.success ? 'Success' : 'Failed');
    const token = register.data.token;

    // Test 3: Get desks
    console.log('\n3️⃣ Testing get desks...');
    const desks = await axios.get(`${API_URL}/desks`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Desks:', desks.data.length, 'desks found');

    // Test 4: Get rooms
    console.log('\n4️⃣ Testing get rooms...');
    const rooms = await axios.get(`${API_URL}/rooms`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Rooms:', rooms.data.length, 'rooms found');

    // Test 5: Get announcements
    console.log('\n5️⃣ Testing get announcements...');
    const announcements = await axios.get(`${API_URL}/announcements`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Announcements:', announcements.data.announcements?.length || 0, 'found');

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
  }
}

testAPI();
