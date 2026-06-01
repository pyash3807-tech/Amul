const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Seed sample users if only admin exists
const seedSampleUsers = async () => {
  try {
    const totalUsers = await User.countDocuments();
    // If only admin exists, seed more
    if (totalUsers <= 1) {
      await User.deleteMany({ username: { $ne: 'admin' } });
      const defaultPassword = await bcrypt.hash('amul123', 10);
      
      const sampleData = [
        { 
          companyName: 'Zepto-Mavdi-1', 
          username: '1007459M-C0100', 
          firstName: 'AA', 
          middleName: 'BB',
          lastName: 'CC', 
          type: 'Retailer', 
          status: 'Active', 
          role: 'Retailer',
          parentCompany: 'Yash Milk Marketing-Rajkot-1007459M',
          company: 'Zepto-Mavdi-1',
          address: 'Jay Javan Jay Kishan Road, Near Dharmjivan Society, Satyam Park Main Road, Rajkot Munisipal Corporation Road, S. T. Depo,',
          society: 'Ram Park',
          ward: '13',
          state: 'Gujarat',
          city: 'Rajkot',
          pincode: '360005',
          whatsapp: '9999999999',
          mobile1: '9999999999',
          mobile2: '9999999999',
          email: 'abc13@gmail.com',
          aadhaarCard: '1269 1234 1234',
          panCard: 'AAAAA3333R',
          drivingLicense: 'GJ03 12345678913',
          electricityBill: '8877665540'
        },
        { companyName: 'Zepto-Mavdi-2', username: '1007459M-C0102', firstName: 'BB', lastName: 'DD', type: 'Retailer', status: 'Active', role: 'Retailer' },
        { companyName: 'Zomato-Trikonbag-1', username: 'zomato_tri1', firstName: 'AA', lastName: 'CC', type: 'Retailer', status: 'Active', role: 'Retailer' },
        { companyName: 'Zomato-Raiyadhar-1', username: 'zomato_rai1', firstName: 'BB', lastName: 'DD', type: 'Retailer', status: 'Active', role: 'Retailer' },
        { companyName: 'Zomato-Topland-1', username: 'zomato_top1', firstName: 'AA', lastName: 'CC', type: 'Retailer', status: 'Active', role: 'Retailer' },
        
        // 10 more rows
        { companyName: 'Blinkit-Mavdi-1', username: 'blinkit_mavdi1', firstName: 'John', lastName: 'Doe', type: 'Retailer', status: 'Active', role: 'Retailer' },
        { companyName: 'Blinkit-Kalawad-1', username: 'blinkit_kala1', firstName: 'Raj', lastName: 'Kumar', type: 'Retailer', status: 'Active', role: 'Retailer' },
        { companyName: 'Reliance-Smart-1', username: 'rel_smart1', firstName: 'Amit', lastName: 'Shah', type: 'Retailer', status: 'Active', role: 'Retailer' },
        { companyName: 'DMart-Kuvadva-1', username: 'dmart_kuv1', firstName: 'Vijay', lastName: 'Patel', type: 'Retailer', status: 'Active', role: 'Retailer' },
        { companyName: 'Star-Bazaar-1', username: 'star_baz1', firstName: 'Meera', lastName: 'Mehta', type: 'Retailer', status: 'Active', role: 'Retailer' },
        { companyName: 'BigBasket-Yagnik-1', username: 'bb_yagnik1', firstName: 'Sunil', lastName: 'Verma', type: 'Retailer', status: 'Active', role: 'Retailer' },
        { companyName: 'JioMart-Mochi-1', username: 'jio_mochi1', firstName: 'Dev', lastName: 'Dave', type: 'Retailer', status: 'Active', role: 'Retailer' },
        { companyName: 'Swiggy-Instamart-1', username: 'swiggy_insta1', firstName: 'Ravi', lastName: 'Giri', type: 'Retailer', status: 'Active', role: 'Retailer' },
        { companyName: 'Local-Retailer-1', username: 'local_ret1', firstName: 'Anil', lastName: 'Joshi', type: 'Retailer', status: 'Inactive', role: 'Retailer' },
        { companyName: 'Speedy-Milk-1', username: 'speedy_milk1', firstName: 'Gopal', lastName: 'Muni', type: 'Retailer', status: 'Active', role: 'Retailer' }
      ];

      for (const userData of sampleData) {
        await User.create({
          ...userData,
          password: defaultPassword
        });
      }
      console.log('Seeded 15 sample retailer users successfully');
    }
  } catch (error) {
    console.error('Error seeding sample users:', error);
  }
};

// Delay slightly to ensure admin seeding finishes first
setTimeout(seedSampleUsers, 1000);

router.use(authMiddleware);

// GET /api/users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ username: { $ne: 'admin' } }).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/users
router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      ...req.body,
      password: hashedPassword
    });

    const saved = await newUser.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/users/:id
router.put('/:id', async (req, res) => {
  try {
    const { password } = req.body;
    const updateData = { ...req.body };
    delete updateData.password; // ignore password property in spreading

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updated = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
