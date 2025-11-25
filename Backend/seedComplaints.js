const mongoose = require('mongoose');
const Complaint = require('./models/Complaint');
const Student = require('./models/Student');
const User = require('./models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hmc_database';

const sampleComplaints = [
  {
    title: 'Broken Chair in Room',
    description: 'One of the chairs in my room is broken and needs immediate replacement. The backrest is completely detached.',
    category: 'furniture',
    priority: 'medium',
    location: {
      description: 'Study chair near the window'
    }
  },
  {
    title: 'Leaking Tap in Bathroom',
    description: 'The tap in the bathroom has been leaking continuously for the past 3 days. Water is being wasted and the floor is always wet.',
    category: 'plumbing',
    priority: 'high',
    location: {
      description: 'Bathroom sink tap'
    }
  },
  {
    title: 'Fused Tube Light',
    description: 'The tube light in my room has stopped working. Need replacement as it affects my studies.',
    category: 'electrical',
    priority: 'medium',
    location: {
      description: 'Main ceiling light'
    }
  },
  {
    title: 'Internet Connection Issues',
    description: 'WiFi connection is very slow and keeps disconnecting frequently. Unable to attend online classes properly.',
    category: 'internet',
    priority: 'high',
    location: {
      description: 'Room WiFi connection'
    }
  },
  {
    title: 'Cleanliness Issue in Common Area',
    description: 'The common area on our floor has not been cleaned for several days. There is garbage accumulation.',
    category: 'cleanliness',
    priority: 'medium',
    location: {
      description: 'Floor 2 common area'
    }
  },
  {
    title: 'Security Concern - Main Gate',
    description: 'The main gate security guard is often absent during night hours. This is a safety concern.',
    category: 'security',
    priority: 'high',
    location: {
      description: 'Main entrance gate'
    }
  },
  {
    title: 'Food Quality Issue',
    description: 'The food served in the mess yesterday was not fresh and many students complained of stomach issues.',
    category: 'food',
    priority: 'urgent',
    location: {
      description: 'Main mess hall'
    }
  },
  {
    title: 'Wardrobe Lock Broken',
    description: 'The lock on my wardrobe is broken and I cannot secure my belongings properly.',
    category: 'furniture',
    priority: 'medium',
    location: {
      description: 'Personal wardrobe'
    }
  },
  {
    title: 'Medical Emergency Response',
    description: 'Need better medical facilities and faster response time for emergencies in the hostel.',
    category: 'medical',
    priority: 'high',
    location: {
      description: 'Hostel medical room'
    }
  },
  {
    title: 'Noise Disturbance',
    description: 'There is excessive noise from construction work nearby during study hours and night time.',
    category: 'other',
    priority: 'medium',
    location: {
      description: 'Near hostel building'
    }
  }
];

async function seedComplaints() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all students
    const students = await Student.find().limit(10);
    if (students.length === 0) {
      console.log('❌ No students found. Please seed students first.');
      return;
    }

    // Clear existing complaints
    await Complaint.deleteMany({});
    console.log('🗑️ Cleared existing complaints');

    // Create complaints with random student assignments
    const complaintsToInsert = sampleComplaints.map((complaint, index) => {
      const randomStudent = students[index % students.length];
      const createdDate = new Date();
      createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30)); // Random date within last 30 days
      
      // Randomly assign status
      const statuses = ['pending', 'in-progress', 'resolved'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      const complaintData = {
        ...complaint,
        student: randomStudent._id,
        status: randomStatus,
        createdAt: createdDate
      };

      // Add resolution data for resolved complaints
      if (randomStatus === 'resolved') {
        const resolvedDate = new Date(createdDate);
        resolvedDate.setDate(resolvedDate.getDate() + Math.floor(Math.random() * 7) + 1); // Resolved 1-7 days after creation
        
        complaintData.resolution = {
          resolvedAt: resolvedDate,
          resolutionNotes: `Issue has been resolved. ${getResolutionNote(complaint.category)}`
        };
      }

      return complaintData;
    });

    // Insert complaints
    const insertedComplaints = await Complaint.insertMany(complaintsToInsert);
    console.log(`✅ Successfully seeded ${insertedComplaints.length} complaints`);

    // Display summary
    const summary = await Complaint.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const categorySummary = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📊 Complaint Summary by Status:');
    summary.forEach(item => {
      console.log(`${item._id}: ${item.count} complaints`);
    });

    console.log('\n📊 Complaint Summary by Category:');
    categorySummary.forEach(item => {
      console.log(`${item._id}: ${item.count} complaints`);
    });

    console.log('\n🎯 Complaint seeding completed successfully!');
    console.log('💡 You can now test the complaint management system in the warden dashboard.');
    
  } catch (error) {
    console.error('❌ Error seeding complaints:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

function getResolutionNote(category) {
  const resolutionNotes = {
    electrical: 'Electrician was called and the issue was fixed. New fittings installed.',
    plumbing: 'Plumber repaired the leak and checked all connections.',
    furniture: 'Furniture was repaired/replaced by maintenance team.',
    cleanliness: 'Cleaning staff was notified and area was thoroughly cleaned.',
    food: 'Kitchen staff was informed and food quality measures were implemented.',
    internet: 'Network team resolved the connectivity issues and upgraded equipment.',
    security: 'Security protocols were reviewed and additional measures implemented.',
    medical: 'Medical facilities were upgraded and response procedures improved.',
    other: 'Issue was investigated and appropriate action was taken.'
  };
  
  return resolutionNotes[category] || 'Issue was resolved by the maintenance team.';
}

// Run the seeding function
if (require.main === module) {
  seedComplaints();
}

module.exports = { seedComplaints, sampleComplaints };
