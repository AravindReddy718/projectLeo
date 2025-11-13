const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Mock users for testing without MongoDB
const mockUsers = [
  {
    _id: 'student123',
    username: 'student',
    email: 'student@iit.ac.in',
    password: 'password123', // In real app, this would be hashed
    role: 'student',
    profile: {
      firstName: 'Test',
      lastName: 'Student',
      phone: '1234567890'
    },
    isActive: true
  },
  {
    _id: 'warden123',
    username: 'warden',
    email: 'warden@iit.ac.in',
    password: 'password123',
    role: 'warden',
    profile: {
      firstName: 'Test',
      lastName: 'Warden',
      phone: '1234567890'
    },
    isActive: true
  },
  {
    _id: 'admin123',
    username: 'admin',
    email: 'admin@iit.ac.in',
    password: 'password123',
    role: 'admin',
    profile: {
      firstName: 'Test',
      lastName: 'Admin',
      phone: '1234567890'
    },
    isActive: true
  }
];

// Helper function to find user by email and validate password
const findUser = (email, password) => {
  const user = mockUsers.find(u => u.email === email && u.password === password);
  return user;
};

// Register a new user (mock)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role, profile } = req.body;

    // Check if user already exists (mock check)
    const existingUser = mockUsers.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Create mock user (in real app, would save to database)
    const newUser = {
      _id: 'user' + Date.now(),
      username,
      email,
      password, // In real app, this would be hashed
      role: role || 'student',
      profile: profile || {},
      isActive: true
    };

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        profile: newUser.profile
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email and password (mock authentication)
    const user = findUser(email, password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get current user profile (mock)
router.get('/profile', async (req, res) => {
  try {
    // This would normally get user from JWT token
    // For now, return mock data
    res.json({
      user: {
        id: 'student123',
        username: 'student',
        email: 'student@iit.ac.in',
        role: 'student',
        profile: {
          firstName: 'Test',
          lastName: 'Student',
          phone: '1234567890'
        }
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
