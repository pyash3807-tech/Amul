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

// Seed default company list if empty
const seedCompanies = async () => {
  try {
    const count = await Company.countDocuments();
    // If only 1 distributor exists (from previous seed), clear it and seed standard list
    if (count <= 1) {
      await Company.deleteMany({});
      
      const seedList = [
        { 
          companyCode: '1007459M-C0100', 
          firmName: 'Zepto-Mavdi-1', 
          firmNameGujarati: 'ઝેપ્ટો-મવડી-૧', 
          companyType: 'Retailer', 
          status: 'Active',
          accountName: 'Drogheria Sellers Pvt. Ltd. (Mavdi)',
          panCard: 'AAJCD2242F',
          gst: '24AAJCD2242F1Z2',
          foodLicense: '00000000000000',
          parentCompany: 'Yash Milk Marketing-Rajkot-1007459M',
          whatsapp: '0000000000',
          mobile1: '0000000000',
          mobile2: '0000000000',
          email: 'xyz13@000.com',
          address: 'Shop No. 14 To 19, One Mavdi Building, Nr. Bapa Sitaram Circle, Mavdi Main Road,',
          state: 'Gujarat',
          city: 'Rajkot',
          pincode: '360004',
          bankName: 'Children Bank Of Country',
          branch: 'Bhavnath-City',
          accountNumber: '0000000000000000',
          accountType: 'Current',
          branchAddress: 'Budhalal Circle, 80Feet Road, State - 360003',
          ifsc: 'CBIH000456',
          upiCode: 'xxxxxx@xxx',
          customerMorningTime: '09:10',
          customerEveningTime: '00:00',
          reportMorningTime: '09:45',
          reportEveningTime: '14:30',
          distributionChannel: '0',
          rateSettings: 'InnerCity',
          appAccounting: true,
          accountLedger: true,
          salesPurchaseRegister: false,
          isOrderInCrate: true
        },
        { companyCode: '1007459M-C0102', firmName: 'Zepto-Mavdi-2', firmNameGujarati: 'ઝેપ્ટો-મવડી-૨', companyType: 'Retailer', status: 'Active' },
        { companyCode: '1007459M-C0200', firmName: 'Zomato-Trikonbag-1', firmNameGujarati: 'ઝોમેટો-ત્રિકોણબાગ-૧', companyType: 'Retailer', status: 'Active' },
        { companyCode: '1007459M-C0202', firmName: 'Zomato-Trikonbag-2', firmNameGujarati: 'ઝોમેટો-ત્રિકોણબાગ-૨', companyType: 'Retailer', status: 'Inactive' },
        { companyCode: '1007459M-C0300', firmName: 'Zomato-Raiyadhar-1', firmNameGujarati: 'ઝોમેટો-રૈયાધાર-૧', companyType: 'Retailer', status: 'Active' },
        { companyCode: '1007459M-C0302', firmName: 'Zomato-Raiyadhar-2', firmNameGujarati: 'ઝોમેટો-રૈયાધાર-૨', companyType: 'Retailer', status: 'Active' },
        { companyCode: '1007459M-C0400', firmName: 'Zomato-Topland-1', firmNameGujarati: 'ઝોમેટો-ટોપલેન્ડ-૧', companyType: 'Retailer', status: 'Active' },
        { companyCode: '1007459M-C0402', firmName: 'Zomato-Topland-2', firmNameGujarati: 'ઝોમેટો-ટોપલેન્ડ-૨', companyType: 'Retailer', status: 'Active' },
        { companyCode: '1007459M-C0500', firmName: 'Blinkit-Mavdi-1', firmNameGujarati: 'બ્લિંકિત-મવડી-૧', companyType: 'Retailer', status: 'Active' },
        { companyCode: '1007459M-C0502', firmName: 'Blinkit-Mavdi-2', firmNameGujarati: 'બ્લિંકિત-મવડી-૨', companyType: 'Retailer', status: 'Active' }
      ];

      for (const item of seedList) {
        await Company.create({
          ...item,
          lockType: 'None',
          paymentType: 'Cash',
          products: STANDARD_PRODUCTS
        });
      }
      console.log('Seeded 10 standard retailer company profiles');
    }
  } catch (error) {
    console.error('Error seeding companies:', error);
  }
};

setTimeout(seedCompanies, 1500);

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
