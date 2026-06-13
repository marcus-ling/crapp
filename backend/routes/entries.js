const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');

// Create a new entry
router.post('/', async (req, res) => {
  try {
    const { bristolScale, symptoms, foodLogged, medications, notes } = req.body;

    // Simple red-flag check
    const flagged = symptoms && symptoms.includes('blood');

    const entry = new Entry({
      bristolScale,
      symptoms,
      foodLogged,
      medications,
      notes,
      flagged
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all entries (optionally filter by date range)
router.get('/', async (req, res) => {
  try {
    const { start, end } = req.query;
    let filter = {};
    if (start && end) {
      filter.timestamp = { $gte: new Date(start), $lte: new Date(end) };
    }
    const entries = await Entry.find(filter).sort({ timestamp: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single entry
router.get('/:id', async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete entry
router.delete('/:id', async (req, res) => {
  try {
    await Entry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;