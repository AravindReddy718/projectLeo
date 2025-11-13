const http = require('http');

const API_BASE_URL = 'localhost';

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

function makeRequest(path, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: API_BASE_URL,
      port: 8000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (error) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function createTestUsers() {
  try {
    console.log('Creating test users...\n');

    for (const userData of testUsers) {
      try {
        const response = await makeRequest('/api/auth/register', userData);
        if (response.status === 201) {
          console.log(`✅ Created user: ${userData.email} (${userData.role})`);
        } else if (response.status === 400 && response.data.message?.includes('already exists')) {
          console.log(`ℹ️  User already exists: ${userData.email} (${userData.role})`);
        } else {
          console.log(`❌ Failed to create user ${userData.email}:`, response.data.message || 'Unknown error');
        }
      } catch (error) {
        console.log(`❌ Failed to create user ${userData.email}:`, error.message);
      }
    }

    console.log('\n✅ Test user creation completed!');
    console.log('\nLogin Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    testUsers.forEach(user => {
      console.log(`📧 ${user.email}`);
      console.log(`🔑 Password: password123`);
      console.log(`👤 Role: ${user.role}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });

  } catch (error) {
    console.error('Error creating test users:', error.message);
  }
}

// Run the function
createTestUsers();
