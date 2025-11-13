const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Test users to create
const testUsers = [
  {
    username: 'student',
    email: 'student@iit.ac.in',
    password: 'password123',
    role: 'student',
    profile: {
      firstName: 'Test',
      lastName: 'Student',
      phone: '+91 98765 43210',
      address: 'Room 101, Boys Hostel, IIT Campus'
    }
  },
  {
    username: 'warden',
    email: 'warden@iit.ac.in',
    password: 'password123',
    role: 'warden',
    profile: {
      firstName: 'Test',
      lastName: 'Warden',
      phone: '+91 98765 43211',
      address: 'Warden Quarter, IIT Campus'
    }
  },
  {
    username: 'admin',
    email: 'admin@iit.ac.in',
    password: 'password123',
    role: 'admin',
    profile: {
      firstName: 'Test',
      lastName: 'Administrator',
      phone: '+91 98765 43212',
      address: 'Admin Block, IIT Campus'
    }
  }
];

async function seedUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing users (optional - comment out if you want to keep existing users)
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create test users
    for (const userData of testUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${userData.email} (${userData.role})`);
    }

    console.log('\n✅ Test users created successfully!');
    console.log('\nLogin Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    testUsers.forEach(user => {
      console.log(`📧 ${user.email}`);
      console.log(`🔑 Password: password123`);
      console.log(`👤 Role: ${user.role}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });

  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedUsers();
