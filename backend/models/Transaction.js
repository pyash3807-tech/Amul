const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  date: {
    type: String, // Store as YYYY-MM-DD
    required: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Debit', 'Credit', 'Adjust'],
    required: true
  },
  payment: {
    type: String,
    enum: ['Cash', 'Bank', 'Online', 'Cheque', 'None'],
    default: 'None'
  },
  amount: {
    type: Number,
    required: true,
    default: 0
  },
  adjust: {
    type: Number,
    default: 0
  },
  reference: {
    type: String,
    default: ''
  },
  remark: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
