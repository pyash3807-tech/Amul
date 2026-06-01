const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  vehicleNo: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  middleName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    required: true
  },
  vehicleType: {
    type: String,
    enum: ['Truck', 'Mini Truck', 'Bike', 'Auto', 'Van'],
    default: 'Truck'
  },
  isOwner: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', VehicleSchema);
