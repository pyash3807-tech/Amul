const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const authMiddleware = require('../middleware/authMiddleware');

const STANDARD_PRODUCTS = [
  { name: 'Taaza 24x500', baseRate: 674.76, morningRate: 1.2, eveningRate: 0, selected: true },
  { name: 'Chay Mazza 24x500', baseRate: 600.00, morningRate: 0, eveningRate: 0, selected: false },
  { name: 'Chay Mazza 12x 1', baseRate: 300.00, morningRate: 0, eveningRate: 0, selected: false },
  { name: 'Taaza 2x6', baseRate: 120.00, morningRate: 0, eveningRate: 0, selected: false },
  { name: 'Gold 24x500', baseRate: 818.40, morningRate: 1.2, eveningRate: 0, selected: true },
  { name: 'Gold 2x6', baseRate: 140.00, morningRate: 0, eveningRate: 0, selected: false },
  { name: 'Buffalo 24x500', baseRate: 838.08, morningRate: 6.96, eveningRate: 0, selected: true },
  { name: 'Buffalo 2x6', baseRate: 150.00, morningRate: 0, eveningRate: 0, selected: false },
  { name: 'Tea Spe. 12x 1', baseRate: 320.00, morningRate: 0, eveningRate: 0, selected: false },
  { name: 'Taaza 60x 150', baseRate: 200.00, morningRate: 0, eveningRate: 0, selected: false },
  { name: 'Cow 24x500', baseRate: 580.00, morningRate: 0, eveningRate: 0, selected: false },
  { name: 'Gopal BM 24x 300', baseRate: 180.00, morningRate: 0, eveningRate: 0, selected: false },
  { name: 'Gopal BM 20x 480', baseRate: 220.00, morningRate: 0, eveningRate: 0, selected: false },
  { name: 'G Sour B.M. 18x 530', baseRate: 190.00, morningRate: 0, eveningRate: 0, selected: false },
  { name: 'G Dahi 30x 400', baseRate: 450.00, morningRate: 0, eveningRate: 0, selected: false },
  { name: 'G Dahi 12x 1', baseRate: 400.00, morningRate: 0, eveningRate: 0, selected: false },
  { name: 'G Dahi 2x5', baseRate: 110.00, morningRate: 0, eveningRate: 0, selected: false },
  { name: 'G Dahi 48x 100-C', baseRate: 360.00, morningRate: 0, eveningRate: 0, selected: false },
  { name: 'G Dahi 22x 200-C', baseRate: 330.00, morningRate: 0, eveningRate: 0, selected: false },
  { name: 'Amul PB BM 30x 400', baseRate: 650.00, morningRate: 0, eveningRate: 0, selected: false },
  { name: 'Amul PB BM 16x 650', baseRate: 550.00, morningRate: 0, eveningRate: 0, selected: false },
  { name: 'Amul BM 2x 6', baseRate: 100.00, morningRate: 0, eveningRate: 0, selected: false },
  { name: 'AM Dahi 30x 380', baseRate: 440.00, morningRate: 0, eveningRate: 0, selected: false },
  { name: 'AM Dahi 12x 1', baseRate: 380.00, morningRate: 0, eveningRate: 0, selected: false },
  { name: 'AM Dahi 2x5', baseRate: 100.00, morningRate: 0, eveningRate: 0, selected: false },
  { name: 'AM Dahi 48x 80-C', baseRate: 320.00, morningRate: 0, eveningRate: 0, selected: false },
  { name: 'AM Dahi 28x 200-C', baseRate: 350.00, morningRate: 0, eveningRate: 0, selected: false },
  { name: 'AC Dahi 16x 700', baseRate: 310.00, morningRate: 0, eveningRate: 0, selected: false },
  { name: 'AC Dahi 2x 5', baseRate: 90.00, morningRate: 0, eveningRate: 0, selected: false },
  { name: 'AM Dahi 6x 1-B', baseRate: 210.00, morningRate: 0, eveningRate: 0, selected: false },
  { name: 'AF Paneer 60x 100', baseRate: 900.00, morningRate: 0, eveningRate: 0, selected: false },
  { name: 'AF Paneer 45x 200', baseRate: 1350.00, morningRate: 0, eveningRate: 0, selected: false },
  { name: 'AF Paneer 14x 1', baseRate: 840.00, morningRate: 0, eveningRate: 0, selected: false }
];

router.use(authMiddleware);

// GET /api/companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find().sort({ companyCode: 1 });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/companies
router.post('/', async (req, res) => {
  try {
    const exists = await Company.findOne({ companyCode: req.body.companyCode });
    if (exists) {
      return res.status(400).json({ message: 'Company code already exists' });
    }

    // Default 33 products preloaded on creation
    const newCompany = new Company({
      ...req.body,
      products: STANDARD_PRODUCTS
    });
    
    const saved = await newCompany.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/companies/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await Company.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/companies/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Company.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
