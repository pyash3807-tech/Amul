const mongoose = require('mongoose');

const CompanyProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  },
  morningRate: {
    type: Number,
    default: 0
  },
  eveningRate: {
    type: Number,
    default: 0
  },
  baseRate: {
    type: Number,
    default: 0
  }
});

const CompanySchema = new mongoose.Schema({
  companyCode: {
    type: String,
    required: true,
    unique: true
  },
  firmName: {
    type: String,
    required: true
  },
  firmNameGujarati: {
    type: String,
    default: ''
  },
  accountName: {
    type: String,
    default: ''
  },
  companyType: {
    type: String,
    enum: ['Distributor', 'Retailer', 'Wholesaler'],
    default: 'Retailer'
  },
  lockType: {
    type: String,
    enum: ['None', 'Locked'],
    default: 'None'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  panCard: {
    type: String,
    default: ''
  },
  gst: {
    type: String,
    default: ''
  },
  foodLicense: {
    type: String,
    default: ''
  },
  parentCompany: {
    type: String,
    default: ''
  },
  supplyArea: {
    type: String,
    default: ''
  },
  paymentType: {
    type: String,
    enum: ['Credit', 'Cash', 'Online'],
    default: 'Cash'
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
  address: {
    type: String,
    default: ''
  },
  societyArea: {
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
  aadhaarCard: {
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
  bankName: {
    type: String,
    default: ''
  },
  accountNumber: {
    type: String,
    default: ''
  },
  accountType: {
    type: String,
    default: ''
  },
  ifsc: {
    type: String,
    default: ''
  },
  branch: {
    type: String,
    default: ''
  },
  branchAddress: {
    type: String,
    default: ''
  },
  upiCode: {
    type: String,
    default: ''
  },
  shippingAddressSame: {
    type: Boolean,
    default: true
  },
  shippingAddress: {
    type: String,
    default: ''
  },
  shippingState: {
    type: String,
    default: ''
  },
  shippingCity: {
    type: String,
    default: ''
  },
  shippingPincode: {
    type: String,
    default: ''
  },
  customerMorningTime: {
    type: String,
    default: '09:10'
  },
  customerEveningTime: {
    type: String,
    default: '00:00'
  },
  reportMorningTime: {
    type: String,
    default: '09:45'
  },
  reportEveningTime: {
    type: String,
    default: '14:30'
  },
  distributionChannel: {
    type: String,
    default: '0'
  },
  rateSettings: {
    type: String,
    default: 'InnerCity'
  },
  appAccounting: {
    type: Boolean,
    default: true
  },
  accountLedger: {
    type: Boolean,
    default: true
  },
  salesPurchaseRegister: {
    type: Boolean,
    default: false
  },
  isOrderInCrate: {
    type: Boolean,
    default: true
  },
  licenseExpiry: {
    type: Date
  },
  gstExpiry: {
    type: Date
  },
  products: [CompanyProductSchema]
}, { timestamps: true });

module.exports = mongoose.model('Company', CompanySchema);
