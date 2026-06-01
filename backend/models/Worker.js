const mongoose = require('mongoose');

const WorkerSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['Driver', 'Helper', 'Supervisor', 'Manager'],
    default: 'Driver'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Worker', WorkerSchema);
