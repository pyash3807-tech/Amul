const { Pool } = require('pg');

let pool = null;

const runSeeding = async () => {
  const bcrypt = require('bcryptjs');
  const User = require('../models/User');
  const Company = require('../models/Company');
  const Order = require('../models/Order');
  const Transaction = require('../models/Transaction');

  // 1. Seed Admin
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

  // 2. Seed Users
  const totalUsers = await User.countDocuments();
  if (totalUsers <= 1) {
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
    console.log('Seeded 15 sample retailer users');
  }

  // 3. Seed Companies
  const countComp = await Company.countDocuments();
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
  if (countComp <= 1) {
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

  // 4. Seed Transactions
  const countTrans = await Transaction.countDocuments();
  if (countTrans === 0) {
    const samples = [
      { date: '2026-05-09', from: 'Yash Milk', to: 'Drogheria Sellers-Mavdi', type: 'Debit', payment: 'Cash', amount: 15420, adjust: 0, reference: 'T-199', remark: 'Order payment' },
      { date: '2026-05-09', from: 'Yash Milk', to: 'Zomato Hyperpure-Raiyadhar', type: 'Debit', payment: 'Cash', amount: 32948, adjust: 0, reference: 'R/T-197', remark: 'Daily supply debit' },
      { date: '2026-05-09', from: 'Yash Milk', to: 'Zomato Hyperpure-Mavdi', type: 'Debit', payment: 'Cash', amount: 24350, adjust: 0, reference: 'R/T-196', remark: 'Store supply debit' },
      { date: '2026-05-08', from: 'Yash Milk', to: 'Drogheria Sellers-Mavdi', type: 'Debit', payment: 'Cash', amount: 14200, adjust: 0, reference: 'R/T-193', remark: 'Previous day order' },
      { date: '2026-05-07', from: 'Customer', to: 'Yash Milk Marketing', type: 'Credit', payment: 'Bank', amount: 80000, adjust: 0, reference: 'C-180', remark: 'Direct bank credit' }
    ];
    await Transaction.insertMany(samples);
    console.log('Seeded 5 sample ledger transactions');
  }

  // 5. Seed Orders
  const countOrders = await Order.countDocuments();
  if (countOrders === 0) {
    const retailers = [
      'Zepto-Mavdi-1',
      'Zepto-Mavdi-2',
      'Zomato-Trikonbag-1',
      'Zomato-Raiyadhar-1',
      'Zomato-Topland-1'
    ];
    const productsTemplate = [
      { name: 'Taaza 24x500', rate: 23.20 },
      { name: 'Gold 24x500', rate: 27.00 },
      { name: 'Buffalo 24x500', rate: 28.50 },
      { name: 'Taaza 6x1L', rate: 55.00 },
      { name: 'Gold 6x1L', rate: 65.00 }
    ];
    const dates = [
      '2026-05-25',
      '2026-05-26',
      '2026-05-27',
      '2026-05-28',
      '2026-05-29',
      '2026-05-30',
      '2026-05-31'
    ];
    for (const date of dates) {
      for (let i = 0; i < retailers.length; i++) {
        const products = productsTemplate.map(p => {
          const morningQty = Math.floor(Math.random() * 15) + 2;
          const eveningQty = Math.floor(Math.random() * 10) + 1;
          return {
            name: p.name,
            rate: p.rate,
            morningQty,
            eveningQty
          };
        });
        const totalAmount = products.reduce((sum, p) => {
          return sum + (p.morningQty * p.rate) + (p.eveningQty * p.rate);
        }, 0);
        await Order.create({
          date,
          retailerName: retailers[i],
          products,
          morningPONumber: `PO-M-${date.replace(/-/g, '')}-${i}`,
          eveningPONumber: `PO-E-${date.replace(/-/g, '')}-${i}`,
          totalAmount: parseFloat(totalAmount.toFixed(2)),
          shift: 'All',
          status: 'Completed'
        });
      }
    }
    console.log('Seeded sample orders for the past week');
  }
};

const connectDB = async () => {
  try {
    const connectionString = process.env.DATABASE_URL || process.env.MONGO_URI || 'postgresql://neondb_owner:npg_H0SdQZweOlo4@ep-cold-heart-atp27l5j-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
    
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes('sslmode=require') || connectionString.includes('neon.tech') ? { rejectUnauthorized: false } : false
    });

    // Test connection
    await pool.query('SELECT NOW()');
    console.log('PostgreSQL Connected via pg.Pool');

    // Create Tables
    await pool.query('CREATE TABLE IF NOT EXISTS users (id VARCHAR(50) PRIMARY KEY, doc JSONB)');
    await pool.query('CREATE TABLE IF NOT EXISTS companies (id VARCHAR(50) PRIMARY KEY, doc JSONB)');
    await pool.query('CREATE TABLE IF NOT EXISTS orders (id VARCHAR(50) PRIMARY KEY, doc JSONB)');
    await pool.query('CREATE TABLE IF NOT EXISTS transactions (id VARCHAR(50) PRIMARY KEY, doc JSONB)');
    await pool.query('CREATE TABLE IF NOT EXISTS vehicles (id VARCHAR(50) PRIMARY KEY, doc JSONB)');
    await pool.query('CREATE TABLE IF NOT EXISTS workers (id VARCHAR(50) PRIMARY KEY, doc JSONB)');

    // Create Indexes
    await pool.query("CREATE INDEX IF NOT EXISTS idx_users_username ON users ((doc->>'username'))");
    await pool.query("CREATE INDEX IF NOT EXISTS idx_companies_company_code ON companies ((doc->>'companyCode'))");
    await pool.query("CREATE INDEX IF NOT EXISTS idx_orders_date ON orders ((doc->>'date'))");
    await pool.query("CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions ((doc->>'date'))");

    console.log('PostgreSQL Tables & Indexes Verified/Created');

    // Perform seeding
    await runSeeding();

  } catch (error) {
    console.error(`PostgreSQL Connection/Initialization Error: ${error.message}`);
    process.exit(1);
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error('Database not initialized. Call connectDB() first.');
  }
  return pool;
};

module.exports = connectDB;
module.exports.getPool = getPool;
