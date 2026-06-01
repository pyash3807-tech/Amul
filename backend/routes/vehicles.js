const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// GET /api/vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/vehicles
router.post('/', async (req, res) => {
  try {
    const exists = await Vehicle.findOne({ vehicleNo: req.body.vehicleNo });
    if (exists) {
      return res.status(400).json({ message: 'Vehicle number already exists' });
    }
    const newVehicle = new Vehicle(req.body);
    const saved = await newVehicle.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/vehicles/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/vehicles/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Vehicle.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
