const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@coworkspace.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Name:', existingAdmin.name);
      console.log('🔐 Role:', existingAdmin.role);
      
      // Update to admin if not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('\n✅ User updated to admin role!');
      }
    } else {
      // Create new admin user
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@coworkspace.com',
        password: 'admin123', // Will be hashed by the model
        role: 'admin',
        phone: '1234567890',
        company: 'CoworkSpace Management',
        membershipType: 'annual',
        isActive: true,
      });

      await adminUser.save();
      
      console.log('✅ Admin user created successfully!\n');
      console.log('📧 Email: admin@coworkspace.com');
      console.log('🔑 Password: admin123');
      console.log('🔐 Role: admin');
      console.log('\n⚠️  Please change the password after first login!');
    }

    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createAdmin();
