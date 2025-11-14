const mongoose = require('mongoose');
const Room = require('./models/Room');
const User = require('./models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hmc_database';

const sampleRooms = [
  // Block A - Ground Floor
  {
    roomNumber: '101',
    block: 'A',
    floor: 1,
    roomType: 'double',
    capacity: 2,
    facilities: {
      hasAC: false,
      hasAttachedBathroom: true,
      hasBalcony: false,
      studyTables: 2,
      wardrobes: 2,
      beds: 2
    },
    rent: {
      monthly: 4500,
      security: 2000,
      maintenance: 500
    }
  },
  {
    roomNumber: '102',
    block: 'A',
    floor: 1,
    roomType: 'double',
    capacity: 2,
    facilities: {
      hasAC: false,
      hasAttachedBathroom: true,
      hasBalcony: false,
      studyTables: 2,
      wardrobes: 2,
      beds: 2
    },
    rent: {
      monthly: 4500,
      security: 2000,
      maintenance: 500
    }
  },
  {
    roomNumber: '103',
    block: 'A',
    floor: 1,
    roomType: 'triple',
    capacity: 3,
    facilities: {
      hasAC: false,
      hasAttachedBathroom: true,
      hasBalcony: false,
      studyTables: 3,
      wardrobes: 3,
      beds: 3
    },
    rent: {
      monthly: 4000,
      security: 1800,
      maintenance: 400
    }
  },
  
  // Block A - First Floor
  {
    roomNumber: '201',
    block: 'A',
    floor: 2,
    roomType: 'double',
    capacity: 2,
    facilities: {
      hasAC: true,
      hasAttachedBathroom: true,
      hasBalcony: true,
      studyTables: 2,
      wardrobes: 2,
      beds: 2
    },
    rent: {
      monthly: 6000,
      security: 2500,
      maintenance: 600
    }
  },
  {
    roomNumber: '202',
    block: 'A',
    floor: 2,
    roomType: 'single',
    capacity: 1,
    facilities: {
      hasAC: true,
      hasAttachedBathroom: true,
      hasBalcony: true,
      studyTables: 1,
      wardrobes: 1,
      beds: 1
    },
    rent: {
      monthly: 8000,
      security: 3000,
      maintenance: 700
    }
  },
  
  // Block B - Ground Floor
  {
    roomNumber: '101',
    block: 'B',
    floor: 1,
    roomType: 'quad',
    capacity: 4,
    facilities: {
      hasAC: false,
      hasAttachedBathroom: true,
      hasBalcony: false,
      studyTables: 4,
      wardrobes: 4,
      beds: 4
    },
    rent: {
      monthly: 3500,
      security: 1500,
      maintenance: 350
    }
  },
  {
    roomNumber: '102',
    block: 'B',
    floor: 1,
    roomType: 'double',
    capacity: 2,
    facilities: {
      hasAC: false,
      hasAttachedBathroom: true,
      hasBalcony: false,
      studyTables: 2,
      wardrobes: 2,
      beds: 2
    },
    rent: {
      monthly: 4500,
      security: 2000,
      maintenance: 500
    }
  },
  
  // Block B - First Floor
  {
    roomNumber: '201',
    block: 'B',
    floor: 2,
    roomType: 'double',
    capacity: 2,
    facilities: {
      hasAC: true,
      hasAttachedBathroom: true,
      hasBalcony: true,
      studyTables: 2,
      wardrobes: 2,
      beds: 2
    },
    rent: {
      monthly: 6000,
      security: 2500,
      maintenance: 600
    }
  },
  
  // Block C - Ground Floor
  {
    roomNumber: '101',
    block: 'C',
    floor: 1,
    roomType: 'triple',
    capacity: 3,
    facilities: {
      hasAC: false,
      hasAttachedBathroom: true,
      hasBalcony: false,
      studyTables: 3,
      wardrobes: 3,
      beds: 3
    },
    rent: {
      monthly: 4000,
      security: 1800,
      maintenance: 400
    }
  },
  {
    roomNumber: '102',
    block: 'C',
    floor: 1,
    roomType: 'double',
    capacity: 2,
    facilities: {
      hasAC: false,
      hasAttachedBathroom: true,
      hasBalcony: false,
      studyTables: 2,
      wardrobes: 2,
      beds: 2
    },
    rent: {
      monthly: 4500,
      security: 2000,
      maintenance: 500
    }
  }
];

async function seedRooms() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find an admin user to set as creator
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      // Create a default admin user if none exists
      adminUser = new User({
        username: 'admin',
        email: 'admin@hmcportal.edu',
        password: 'admin123', // This will be hashed by the User model
        role: 'admin',
        profile: {
          firstName: 'System',
          lastName: 'Administrator'
        }
      });
      await adminUser.save();
      console.log('✅ Created default admin user');
    }

    // Clear existing rooms
    await Room.deleteMany({});
    console.log('🗑️ Cleared existing rooms');

    // Add createdBy field to each room
    const roomsWithCreator = sampleRooms.map(room => ({
      ...room,
      createdBy: adminUser._id
    }));

    // Insert sample rooms
    const insertedRooms = await Room.insertMany(roomsWithCreator);
    console.log(`✅ Successfully seeded ${insertedRooms.length} rooms`);

    // Display summary
    const summary = await Room.aggregate([
      {
        $group: {
          _id: '$block',
          totalRooms: { $sum: 1 },
          totalCapacity: { $sum: '$capacity' },
          roomTypes: { $addToSet: '$roomType' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n📊 Room Summary by Block:');
    summary.forEach(block => {
      console.log(`Block ${block._id}: ${block.totalRooms} rooms, ${block.totalCapacity} total capacity, Types: ${block.roomTypes.join(', ')}`);
    });

    console.log('\n🎯 Room seeding completed successfully!');
    console.log('💡 You can now use the room allocation system in the warden dashboard.');
    
  } catch (error) {
    console.error('❌ Error seeding rooms:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seeding function
if (require.main === module) {
  seedRooms();
}

module.exports = { seedRooms, sampleRooms };
