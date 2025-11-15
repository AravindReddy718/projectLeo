const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Import Models
const User = require('./models/User');
const Student = require('./models/Student');
const Complaint = require('./models/Complaint');
const Payment = require('./models/Payment');
const Room = require('./models/Room');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hmc_database';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    return false;
  }
};

const clearExistingData = async () => {
  try {
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Student.deleteMany({});
    await Complaint.deleteMany({});
    await Payment.deleteMany({});
    await Room.deleteMany({});
    console.log('✅ Existing data cleared');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
  }
};

const createAdminUser = async () => {
  try {
    console.log('👤 Creating admin user...');
    const adminUser = new User({
      username: 'admin',
      email: 'admin@iit.ac.in',
      password: 'admin123',
      role: 'admin',
      profile: {
        firstName: 'System',
        lastName: 'Administrator'
      }
    });
    await adminUser.save();
    console.log('✅ Admin user created: admin / admin123');
    return adminUser;
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
};

const createWardenUser = async () => {
  try {
    console.log('👤 Creating warden user...');
    const wardenUser = new User({
      username: 'warden',
      email: 'warden@iit.ac.in',
      password: 'warden123',
      role: 'warden',
      profile: {
        firstName: 'Hostel',
        lastName: 'Warden'
      }
    });
    await wardenUser.save();
    console.log('✅ Warden user created: warden / warden123');
    return wardenUser;
  } catch (error) {
    console.error('❌ Error creating warden user:', error);
  }
};

const createRooms = async (adminUser) => {
  try {
    console.log('🏠 Creating rooms...');
    const rooms = [
      {
        roomNumber: 'H3-101',
        block: 'Hall 3',
        floor: 1,
        capacity: 2,
        currentOccupancy: 1,
        roomType: 'double',
        amenities: ['WiFi', 'AC', 'Study Table', 'Wardrobe'],
        status: 'occupied',
        createdBy: adminUser._id,
        rent: {
          monthly: 5000,
          security: 2000,
          maintenance: 500
        }
      },
      {
        roomNumber: 'H3-205',
        block: 'Hall 3',
        floor: 2,
        capacity: 2,
        currentOccupancy: 1,
        roomType: 'double',
        amenities: ['WiFi', 'Fan', 'Study Table', 'Wardrobe'],
        status: 'occupied',
        createdBy: adminUser._id,
        rent: {
          monthly: 4500,
          security: 2000,
          maintenance: 500
        }
      },
      {
        roomNumber: 'H5-102',
        block: 'Hall 5',
        floor: 1,
        capacity: 1,
        currentOccupancy: 1,
        roomType: 'single',
        amenities: ['WiFi', 'AC', 'Study Table', 'Wardrobe', 'Balcony'],
        status: 'occupied',
        createdBy: adminUser._id,
        rent: {
          monthly: 7000,
          security: 3000,
          maintenance: 500
        }
      },
      {
        roomNumber: 'H5-301',
        block: 'Hall 5',
        floor: 3,
        capacity: 2,
        currentOccupancy: 1,
        roomType: 'double',
        amenities: ['WiFi', 'AC', 'Study Table', 'Wardrobe'],
        status: 'occupied',
        createdBy: adminUser._id,
        rent: {
          monthly: 5500,
          security: 2500,
          maintenance: 500
        }
      },
      {
        roomNumber: 'H3-150',
        block: 'Hall 3',
        floor: 1,
        capacity: 2,
        currentOccupancy: 1,
        roomType: 'double',
        amenities: ['WiFi', 'Fan', 'Study Table', 'Wardrobe'],
        status: 'occupied',
        createdBy: adminUser._id,
        rent: {
          monthly: 4500,
          security: 2000,
          maintenance: 500
        }
      }
    ];

    const createdRooms = await Room.insertMany(rooms);
    console.log('✅ Rooms created successfully');
    return createdRooms;
  } catch (error) {
    console.error('❌ Error creating rooms:', error);
  }
};

const createStudents = async () => {
  try {
    console.log('👥 Creating 5 example students...');
    
    const studentsData = [
      {
        userCredentials: {
          username: 'amit.kumar',
          email: 'amit.kumar@iit.ac.in',
          password: 'student123'
        },
        studentData: {
          studentId: 'IIT2021001',
          personalInfo: {
            firstName: 'Amit',
            lastName: 'Kumar',
            dateOfBirth: new Date('2003-05-15'),
            gender: 'male',
            bloodGroup: 'B+',
            nationality: 'Indian'
          },
          contactInfo: {
            email: 'amit.kumar@iit.ac.in',
            phone: '+91-9876543210',
            parentPhone: '+91-9876543211',
            emergencyContact: {
              name: 'Rajesh Kumar',
              phone: '+91-9876543211',
              relation: 'Father'
            }
          },
          academicInfo: {
            rollNumber: 'CS21B001',
            department: 'Computer Science',
            year: 3,
            semester: 5,
            cgpa: 8.5
          },
          hostelInfo: {
            roomNumber: 'H3-101',
            floor: 1,
            block: 'Hall 3',
            bedNumber: 'A',
            checkInDate: new Date('2021-08-15')
          },
          fees: {
            totalFees: 45000,
            paidFees: 30000,
            pendingFees: 15000
          }
        }
      },
      {
        userCredentials: {
          username: 'priya.singh',
          email: 'priya.singh@iit.ac.in',
          password: 'student123'
        },
        studentData: {
          studentId: 'IIT2022002',
          personalInfo: {
            firstName: 'Priya',
            lastName: 'Singh',
            dateOfBirth: new Date('2004-03-22'),
            gender: 'female',
            bloodGroup: 'A+',
            nationality: 'Indian'
          },
          contactInfo: {
            email: 'priya.singh@iit.ac.in',
            phone: '+91-9876543220',
            parentPhone: '+91-9876543221',
            emergencyContact: {
              name: 'Sunita Singh',
              phone: '+91-9876543221',
              relation: 'Mother'
            }
          },
          academicInfo: {
            rollNumber: 'EE22B002',
            department: 'Electrical Engineering',
            year: 2,
            semester: 3,
            cgpa: 9.2
          },
          hostelInfo: {
            roomNumber: 'H3-205',
            floor: 2,
            block: 'Hall 3',
            bedNumber: 'B',
            checkInDate: new Date('2022-08-20')
          },
          fees: {
            totalFees: 45000,
            paidFees: 45000,
            pendingFees: 0
          }
        }
      },
      {
        userCredentials: {
          username: 'rohan.mehta',
          email: 'rohan.mehta@iit.ac.in',
          password: 'student123'
        },
        studentData: {
          studentId: 'IIT2020003',
          personalInfo: {
            firstName: 'Rohan',
            lastName: 'Mehta',
            dateOfBirth: new Date('2002-11-08'),
            gender: 'male',
            bloodGroup: 'O+',
            nationality: 'Indian'
          },
          contactInfo: {
            email: 'rohan.mehta@iit.ac.in',
            phone: '+91-9876543230',
            parentPhone: '+91-9876543231',
            emergencyContact: {
              name: 'Vikash Mehta',
              phone: '+91-9876543231',
              relation: 'Father'
            }
          },
          academicInfo: {
            rollNumber: 'ME20B003',
            department: 'Mechanical Engineering',
            year: 4,
            semester: 7,
            cgpa: 7.8
          },
          hostelInfo: {
            roomNumber: 'H5-102',
            floor: 1,
            block: 'Hall 5',
            bedNumber: 'A',
            checkInDate: new Date('2020-08-10')
          },
          fees: {
            totalFees: 45000,
            paidFees: 25000,
            pendingFees: 20000
          }
        }
      },
      {
        userCredentials: {
          username: 'sneha.patel',
          email: 'sneha.patel@iit.ac.in',
          password: 'student123'
        },
        studentData: {
          studentId: 'IIT2023004',
          personalInfo: {
            firstName: 'Sneha',
            lastName: 'Patel',
            dateOfBirth: new Date('2005-01-12'),
            gender: 'female',
            bloodGroup: 'AB+',
            nationality: 'Indian'
          },
          contactInfo: {
            email: 'sneha.patel@iit.ac.in',
            phone: '+91-9876543240',
            parentPhone: '+91-9876543241',
            emergencyContact: {
              name: 'Kiran Patel',
              phone: '+91-9876543241',
              relation: 'Mother'
            }
          },
          academicInfo: {
            rollNumber: 'CE23B004',
            department: 'Civil Engineering',
            year: 1,
            semester: 1,
            cgpa: 8.9
          },
          hostelInfo: {
            roomNumber: 'H5-301',
            floor: 3,
            block: 'Hall 5',
            bedNumber: 'A',
            checkInDate: new Date('2023-08-25')
          },
          fees: {
            totalFees: 45000,
            paidFees: 40000,
            pendingFees: 5000
          }
        }
      },
      {
        userCredentials: {
          username: 'arjun.sharma',
          email: 'arjun.sharma@iit.ac.in',
          password: 'student123'
        },
        studentData: {
          studentId: 'IIT2021005',
          personalInfo: {
            firstName: 'Arjun',
            lastName: 'Sharma',
            dateOfBirth: new Date('2003-09-30'),
            gender: 'male',
            bloodGroup: 'A-',
            nationality: 'Indian'
          },
          contactInfo: {
            email: 'arjun.sharma@iit.ac.in',
            phone: '+91-9876543250',
            parentPhone: '+91-9876543251',
            emergencyContact: {
              name: 'Deepak Sharma',
              phone: '+91-9876543251',
              relation: 'Father'
            }
          },
          academicInfo: {
            rollNumber: 'CH21B005',
            department: 'Chemical Engineering',
            year: 3,
            semester: 5,
            cgpa: 8.1
          },
          hostelInfo: {
            roomNumber: 'H3-150',
            floor: 1,
            block: 'Hall 3',
            bedNumber: 'B',
            checkInDate: new Date('2021-08-18')
          },
          fees: {
            totalFees: 45000,
            paidFees: 35000,
            pendingFees: 10000
          }
        }
      }
    ];

    const createdStudents = [];

    for (const studentInfo of studentsData) {
      // Create user account
      const user = new User({
        username: studentInfo.userCredentials.username,
        email: studentInfo.userCredentials.email,
        password: studentInfo.userCredentials.password,
        role: 'student',
        profile: {
          firstName: studentInfo.studentData.personalInfo.firstName,
          lastName: studentInfo.studentData.personalInfo.lastName,
          phone: studentInfo.studentData.contactInfo.phone
        }
      });

      await user.save();

      // Create student record
      const student = new Student({
        user: user._id,
        ...studentInfo.studentData
      });

      await student.save();
      await student.populate('user', 'username email role isActive');
      
      createdStudents.push(student);
      console.log(`✅ Created student: ${studentInfo.studentData.personalInfo.firstName} ${studentInfo.studentData.personalInfo.lastName}`);
    }

    return createdStudents;
  } catch (error) {
    console.error('❌ Error creating students:', error);
  }
};

const createComplaints = async (students) => {
  try {
    console.log('📝 Creating complaints...');
    
    const complaintsData = [
      {
        student: students[0]._id,
        title: 'Tube light not working',
        description: 'Tube light not working in room H3-101. Need immediate replacement.',
        category: 'electrical',
        location: {
          roomNumber: students[0].hostelInfo.roomNumber,
          block: students[0].hostelInfo.block,
          floor: students[0].hostelInfo.floor?.toString() || '1'
        },
        status: 'pending',
        priority: 'medium'
      },
      {
        student: students[1]._id,
        title: 'Water leakage in bathroom',
        description: 'Water leakage from bathroom tap in room H3-205.',
        category: 'plumbing',
        location: {
          roomNumber: students[1].hostelInfo.roomNumber,
          block: students[1].hostelInfo.block,
          floor: students[1].hostelInfo.floor?.toString() || '2'
        },
        status: 'resolved',
        priority: 'high',
        resolution: {
          resolvedAt: new Date('2024-11-08'),
          resolutionNotes: 'Tap replaced and tested'
        }
      },
      {
        student: students[2]._id,
        title: 'Broken door lock',
        description: 'Door lock is broken. Cannot lock the room properly.',
        category: 'other',
        location: {
          roomNumber: students[2].hostelInfo.roomNumber,
          block: students[2].hostelInfo.block,
          floor: students[2].hostelInfo.floor?.toString() || '1'
        },
        status: 'in-progress',
        priority: 'high'
      },
      {
        student: students[3]._id,
        title: 'Poor cleaning service',
        description: 'Common area cleaning not done properly for the past week.',
        category: 'cleanliness',
        location: {
          roomNumber: students[3].hostelInfo.roomNumber,
          block: students[3].hostelInfo.block,
          floor: students[3].hostelInfo.floor?.toString() || '3'
        },
        status: 'pending',
        priority: 'low'
      },
      {
        student: students[4]._id,
        title: 'AC not working properly',
        description: 'AC not cooling properly. Temperature control not working.',
        category: 'electrical',
        location: {
          roomNumber: students[4].hostelInfo.roomNumber,
          block: students[4].hostelInfo.block,
          floor: students[4].hostelInfo.floor?.toString() || '1'
        },
        status: 'resolved',
        priority: 'medium',
        resolution: {
          resolvedAt: new Date('2024-11-03'),
          resolutionNotes: 'AC serviced and temperature control fixed'
        }
      }
    ];

    const createdComplaints = await Complaint.insertMany(complaintsData);
    console.log('✅ Complaints created successfully');
    return createdComplaints;
  } catch (error) {
    console.error('❌ Error creating complaints:', error);
  }
};

const createPayments = async (students) => {
  try {
    console.log('💳 Creating payment records...');
    
    const paymentsData = [];

    // Create payment history for each student
    for (const student of students) {
      const studentPayments = [
        {
          student: student._id,
          amount: 15000,
          type: 'hostel_fees',
          description: 'Semester 1 Hostel Fees',
          status: 'paid',
          paymentMethod: 'online',
          transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 5)}`,
          paidDate: new Date('2024-08-15'),
          dueDate: new Date('2024-08-31'),
          academicYear: '2024-25',
          semester: 1,
          totalAmount: 15000
        },
        {
          student: student._id,
          amount: 15000,
          type: 'hostel_fees',
          description: 'Semester 2 Hostel Fees',
          status: student.fees.pendingFees > 0 ? 'pending' : 'paid',
          paymentMethod: student.fees.pendingFees > 0 ? undefined : 'online',
          transactionId: student.fees.pendingFees > 0 ? undefined : `TXN${Date.now()}${Math.random().toString(36).substr(2, 5)}`,
          paidDate: student.fees.pendingFees > 0 ? undefined : new Date('2024-11-10'),
          dueDate: new Date('2024-12-31'),
          academicYear: '2024-25',
          semester: 2,
          totalAmount: 15000
        }
      ];

      // Add mess fees
      if (student.fees.paidFees > 30000) {
        studentPayments.push({
          student: student._id,
          amount: 8000,
          type: 'mess_fees',
          description: 'Monthly Mess Fees - November',
          status: 'paid',
          paymentMethod: 'online',
          transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 5)}`,
          paidDate: new Date('2024-11-01'),
          dueDate: new Date('2024-11-05'),
          academicYear: '2024-25',
          semester: student.academicInfo.semester,
          totalAmount: 8000
        });
      }

      paymentsData.push(...studentPayments);
    }

    const createdPayments = await Payment.insertMany(paymentsData);
    console.log('✅ Payment records created successfully');
    return createdPayments;
  } catch (error) {
    console.error('❌ Error creating payments:', error);
  }
};

const seedCompleteData = async () => {
  console.log('🌱 Starting complete data seeding...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const connected = await connectDB();
  if (!connected) {
    console.log('❌ Failed to connect to database');
    process.exit(1);
  }

  try {
    // Clear existing data
    await clearExistingData();

    // Create admin user
    const adminUser = await createAdminUser();

    // Create warden user
    const wardenUser = await createWardenUser();

    // Create rooms
    await createRooms(adminUser);

    // Create students
    const students = await createStudents();

    // Create complaints
    await createComplaints(students);

    // Create payments
    await createPayments(students);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Complete data seeding finished successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log('• 1 Admin user created');
    console.log('• 1 Warden user created');
    console.log('• 5 Students created with complete profiles');
    console.log('• 5 Rooms created and assigned');
    console.log('• 5 Complaints created (various statuses)');
    console.log('• Payment records created for all students');
    console.log('');
    console.log('🔐 Login Credentials:');
    console.log('Admin: admin / admin123');
    console.log('Warden: warden / warden123');
    console.log('Students: [username] / student123');
    console.log('  - amit.kumar / student123');
    console.log('  - priya.singh / student123');
    console.log('  - rohan.mehta / student123');
    console.log('  - sneha.patel / student123');
    console.log('  - arjun.sharma / student123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
  }
};

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedCompleteData();
}

module.exports = seedCompleteData;
