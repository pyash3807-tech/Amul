const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to seed admin
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('amul123', 10);
      await User.create({
        companyName: 'Yash Milk Marketing-Rajkot-1007459M',
        username: 'admin',
        password: hashedPassword,
        firstName: 'AAA',
        lastName: 'CCC',
        type: 'Admin',
        status: 'Active',
        role: 'Administrator'
      });
      console.log('Seeded default admin user (admin / amul123)');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

// Seed immediately on import
seedAdmin();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.status === 'Inactive') {
      return res.status(403).json({ message: 'User account is inactive' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      id: user._id,
      username: user.username,
      type: user.type,
      companyName: user.companyName,
      firstName: user.firstName,
      lastName: user.lastName
    };

    const secret = process.env.JWT_SECRET || 'kps_report_secret_key_123';
    const token = jwt.sign(payload, secret, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        companyName: user.companyName,
        firstName: user.firstName,
        lastName: user.lastName,
        type: user.type,
        status: user.status
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  // Since JWT is stateless and stored in memory on the client, logout is mostly handled client-side.
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
