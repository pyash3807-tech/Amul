const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/authMiddleware');

// Seed sample transactions if empty
const seedSampleTransactions = async () => {
  try {
    const count = await Transaction.countDocuments();
    if (count === 0) {
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
  } catch (error) {
    console.error('Error seeding transactions:', error);
  }
};

setTimeout(seedSampleTransactions, 1000);

router.use(authMiddleware);

// GET /api/accounts/transactions
router.get('/transactions', async (req, res) => {
  try {
    const { type, search, payment } = req.query;
    let query = {};

    if (type && type !== 'All') {
      query.type = type;
    }
    if (payment && payment !== 'All') {
      query.payment = payment;
    }
    if (search) {
      query.$or = [
        { from: { $regex: search, $options: 'i' } },
        { to: { $regex: search, $options: 'i' } },
        { reference: { $regex: search, $options: 'i' } },
        { remark: { $regex: search, $options: 'i' } }
      ];
    }

    const transactions = await Transaction.find(query).sort({ date: -1, createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/accounts/transactions
router.post('/transactions', async (req, res) => {
  try {
    const { date, from, to, type, payment, amount, adjust, reference, remark } = req.body;

    const newTransaction = new Transaction({
      date,
      from,
      to,
      type,
      payment,
      amount: Number(amount) || 0,
      adjust: Number(adjust) || 0,
      reference,
      remark
    });

    const saved = await newTransaction.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/accounts/summary
router.get('/summary', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    
    let totalDebit = 0;
    let totalCredit = 0;
    let totalAdjust = 0;

    transactions.forEach(t => {
      if (t.type === 'Debit') {
        totalDebit += t.amount;
      } else if (t.type === 'Credit') {
        totalCredit += t.amount;
      } else if (t.type === 'Adjust') {
        totalAdjust += t.amount; // Adjust could add or subtract, but we sum it
      }
    });

    const balance = totalCredit - totalDebit + totalAdjust;

    res.json({
      debit: totalDebit,
      credit: totalCredit,
      adjust: totalAdjust,
      balance: balance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
