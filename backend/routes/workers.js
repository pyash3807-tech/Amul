const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// GET /api/workers
router.get('/', async (req, res) => {
  try {
    const workers = await Worker.find().sort({ createdAt: -1 });
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/workers
router.post('/', async (req, res) => {
  try {
    const newWorker = new Worker(req.body);
    const saved = await newWorker.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/workers/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await Worker.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/workers/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Worker.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    res.json({ message: 'Worker deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
