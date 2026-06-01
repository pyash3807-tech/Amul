const mongoose = require('mongoose');

const OrderProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  morningQty: {
    type: Number,
    default: 0
  },
  eveningQty: {
    type: Number,
    default: 0
  },
  rate: {
    type: Number,
    required: true
  }
});

const OrderSchema = new mongoose.Schema({
  date: {
    type: String, // Store as YYYY-MM-DD
    required: true
  },
  retailerName: {
    type: String,
    required: true
  },
  products: [OrderProductSchema],
  morningPONumber: {
    type: String,
    default: ''
  },
  eveningPONumber: {
    type: String,
    default: ''
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  shift: {
    type: String,
    enum: ['All', 'Morning', 'Evening'],
    default: 'All'
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
