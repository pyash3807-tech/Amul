const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  companyName: {
    type: String,
    default: ''
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  middleName: {
    type: String,
    default: ''
  },
  parentCompany: {
    type: String,
    default: ''
  },
  company: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  society: {
    type: String,
    default: ''
  },
  ward: {
    type: String,
    default: ''
  },
  state: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  pincode: {
    type: String,
    default: ''
  },
  whatsapp: {
    type: String,
    default: ''
  },
  mobile1: {
    type: String,
    default: ''
  },
  mobile2: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  aadhaarCard: {
    type: String,
    default: ''
  },
  panCard: {
    type: String,
    default: ''
  },
  drivingLicense: {
    type: String,
    default: ''
  },
  electricityBill: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['Retailer', 'Admin', 'Driver'],
    default: 'Retailer'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  role: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
