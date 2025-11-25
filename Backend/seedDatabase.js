// Backend/seedDatabase.js - Comprehensive Seed Script
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Import Models
const User = require('./models/User');
const Student = require('./models/Student');
const Complaint = require('./models/Complaint');
const Payment = require('./models/Payment');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hmc_database';

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    
    // Drop existing collections to clear indexes
    try {
      await mongoose.connection.db.collection('users').drop();
      console.log('   ✅ Users collection dropped');
    } catch (error) {
      console.log('   ℹ️  Users collection not found (OK)');
    }
    
    try {
      await mongoose.connection.db.collection('students').drop();
      console.log('   ✅ Students collection dropped');
    } catch (error) {
      console.log('   ℹ️  Students collection not found (OK)');
    }
    
    try {
      await mongoose.connection.db.collection('complaints').drop();
      console.log('   ✅ Complaints collection dropped');
    } catch (error) {
      console.log('   ℹ️  Complaints collection not found (OK)');
    }
    
    try {
      await mongoose.connection.db.collection('payments').drop();
      console.log('   ✅ Payments collection dropped');
    } catch (error) {
      console.log('   ℹ️  Payments collection not found (OK)');
    }
    
    console.log('✅ Existing data cleared');

    // Create Users
    console.log('👥 Creating users...');
    
    const studentUser = await User.create({
      username: 'student',
      email: 'student@iit.ac.in',
      password: 'password123',
      role: 'student',
      profile: {
        firstName: 'Amit',
        lastName: 'Kumar',
        phone: '+91 98765 43210',
        address: 'Room 101, Boys Hostel, IIT Campus'
      }
    });

    const wardenUser = await User.create({
      username: 'warden',
      email: 'warden@iit.ac.in',
      password: 'password123',
      role: 'warden',
      profile: {
        firstName: 'Dr. Priya',
        lastName: 'Sharma',
        phone: '+91 98765 43211',
        address: 'Warden Quarter, IIT Campus'
      }
    });

    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@iit.ac.in',
      password: 'password123',
      role: 'admin',
      profile: {
        firstName: 'Admin',
        lastName: 'User',
        phone: '+91 98765 43212',
        address: 'Admin Block, IIT Campus'
      }
    });

    const chairmanUser = await User.create({
      username: 'chairman',
      email: 'chairman@iit.ac.in',
      password: 'password123',
      role: 'chairman',
      profile: {
        firstName: 'HMC',
        lastName: 'Chairman',
        phone: '+91 98765 43213',
        address: 'Chairman Office, IIT Campus'
      }
    });

    console.log('✅ Users created');

    // Create Students
    console.log('👨‍🎓 Creating students...');
    
    // Create additional student user for second student
    const student2User = await User.create({
      username: 'priya.singh',
      email: 'priya.singh@iit.ac.in',
      password: 'password123',
      role: 'student',
      profile: {
        firstName: 'Priya',
        lastName: 'Singh',
        phone: '+91 98765 43230',
        address: 'Room B-205, Girls Hostel, IIT Campus'
      }
    });
    
    const student1 = await Student.create({
      user: studentUser._id,
      studentId: '2024CS10001',
      personalInfo: {
        firstName: 'Amit',
        lastName: 'Kumar',
        dateOfBirth: new Date('2003-05-15'),
        gender: 'male',
        bloodGroup: 'O+',
        nationality: 'Indian'
      },
      contactInfo: {
        email: 'student@iit.ac.in',
        phone: '+91 98765 43210',
        parentPhone: '+91 98765 43220',
        emergencyContact: {
          name: 'Rajesh Kumar',
          phone: '+91 98765 43220',
          relation: 'Father'
        }
      },
      academicInfo: {
        rollNumber: '2024CS10001',
        department: 'Computer Science',
        year: 2,
        semester: 3,
        cgpa: 8.5
      },
      hostelInfo: {
        roomNumber: 'G-102',
        floor: 1,
        block: 'G',
        bedNumber: 'B1',
        checkInDate: new Date('2024-07-01')
      },
      documents: {
        aadharNumber: '123456789012',
        admissionProof: 'ADM2024001',
        medicalCertificate: 'MED2024001'
      },
      status: 'active',
      fees: {
        totalFees: 25000,
        paidFees: 20000,
        pendingFees: 5000
      }
    });

    const student2 = await Student.create({
      user: student2User._id,
      studentId: '2024EE10002',
      personalInfo: {
        firstName: 'Priya',
        lastName: 'Singh',
        dateOfBirth: new Date('2003-08-20'),
        gender: 'female',
        bloodGroup: 'A+',
        nationality: 'Indian'
      },
      contactInfo: {
        email: 'priya.singh@iit.ac.in',
        phone: '+91 98765 43230',
        parentPhone: '+91 98765 43240',
        emergencyContact: {
          name: 'Suresh Singh',
          phone: '+91 98765 43240',
          relation: 'Father'
        }
      },
      academicInfo: {
        rollNumber: '2024EE10002',
        department: 'Electrical Engineering',
        year: 2,
        semester: 3,
        cgpa: 9.0
      },
      hostelInfo: {
        roomNumber: 'B-205',
        floor: 2,
        block: 'B',
        bedNumber: 'B1',
        checkInDate: new Date('2024-07-01')
      },
      documents: {
        aadharNumber: '123456789013',
        admissionProof: 'ADM2024002',
        medicalCertificate: 'MED2024002'
      },
      status: 'active',
      fees: {
        totalFees: 28000,
        paidFees: 25000,
        pendingFees: 3000
      }
    });

    console.log('✅ Students created');

    // Create Complaints
    console.log('📋 Creating complaints...');
    
    await Complaint.create({
      student: student1._id,
      title: 'Fused Tube Light in Room',
      description: 'The tube light in my room G-102 is not working. It needs immediate replacement.',
      category: 'electrical',
      priority: 'high',
      location: {
        roomNumber: 'G-102',
        block: 'G',
        floor: '1',
        description: 'Main ceiling light'
      },
      status: 'pending'
    });

    await Complaint.create({
      student: student2._id,
      title: 'Leaking Tap in Bathroom',
      description: 'The tap in the bathroom is continuously leaking water.',
      category: 'plumbing',
      priority: 'medium',
      location: {
        roomNumber: 'B-205',
        block: 'B',
        floor: '2',
        description: 'Bathroom sink tap'
      },
      status: 'in-progress',
      assignedTo: wardenUser._id,
      followUps: [{
        staff: wardenUser._id,
        notes: 'Plumber has been informed',
        timestamp: new Date()
      }]
    });

    await Complaint.create({
      student: student1._id,
      title: 'Broken Chair',
      description: 'One of the chairs in my room is broken and needs repair.',
      category: 'furniture',
      priority: 'low',
      location: {
        roomNumber: 'G-102',
        block: 'G',
        floor: '1',
        description: 'Study table chair'
      },
      status: 'resolved',
      assignedTo: wardenUser._id,
      resolution: {
        resolvedAt: new Date(),
        resolvedBy: wardenUser._id,
        resolutionNotes: 'Chair has been repaired by carpenter',
        resolutionImages: []
      }
    });

    console.log('✅ Complaints created');

    // Create Payments
    console.log('💰 Creating payments...');
    
    await Payment.create({
      student: student1._id,
      type: 'hostel_fees',
      amount: 10000,
      dueDate: new Date('2024-11-30'),
      status: 'pending',
      description: 'Hostel Fees - November 2024',
      academicYear: '2024-25',
      semester: 3,
      lateFee: 0,
      discount: 0,
      totalAmount: 10000
    });

    await Payment.create({
      student: student1._id,
      type: 'mess_fees',
      amount: 8000,
      dueDate: new Date('2024-11-30'),
      paidDate: new Date('2024-11-15'),
      status: 'paid',
      paymentMethod: 'online',
      transactionId: 'TXN20241115001',
      receiptNumber: 'REC20241115001',
      description: 'Mess Fees - November 2024',
      academicYear: '2024-25',
      semester: 3,
      paidBy: adminUser._id,
      lateFee: 0,
      discount: 500,
      totalAmount: 7500
    });

    await Payment.create({
      student: student2._id,
      type: 'hostel_fees',
      amount: 10000,
      dueDate: new Date('2024-11-30'),
      paidDate: new Date('2024-11-10'),
      status: 'paid',
      paymentMethod: 'online',
      transactionId: 'TXN20241110001',
      receiptNumber: 'REC20241110001',
      description: 'Hostel Fees - November 2024',
      academicYear: '2024-25',
      semester: 3,
      paidBy: adminUser._id,
      lateFee: 0,
      discount: 0,
      totalAmount: 10000
    });

    console.log('✅ Payments created');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📋 Test Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Student:');
    console.log('  Email: student@iit.ac.in');
    console.log('  Password: password123');
    console.log('\nWarden:');
    console.log('  Email: warden@iit.ac.in');
    console.log('  Password: password123');
    console.log('\nAdmin:');
    console.log('  Email: admin@iit.ac.in');
    console.log('  Password: password123');
    console.log('\nChairman:');
    console.log('  Email: chairman@iit.ac.in');
    console.log('  Password: password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();