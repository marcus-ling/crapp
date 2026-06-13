const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');

// Create a new entry
router.post('/', async (req, res) => {
  try {
    const { bristolScale, symptoms, foodLogged, medications, notes } = req.body;
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

// Get all entries (with optional date range filter)
router.get('/', async (req, res) => {
  try {
    console.log('📝 GET /api/entries called');
    const { start, end } = req.query;
    let filter = {};
    
    if (start && end) {
      filter.timestamp = { $gte: new Date(start), $lte: new Date(end) };
    }
    
    const entries = await Entry.find(filter).sort({ timestamp: -1 });
    console.log(`✅ Found ${entries.length} entries`);
    res.json(entries);
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get single entry by ID
router.get('/:id', async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get daily aggregates for calendar review
router.get('/calendar/:year/:month', async(req, res) => {
  try {
    const { year, month } = req.params;
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);
    const entries = await Entry.find({ timestamp: { $gte: start, $lte: end } });
    
    const dayMap = {};
    entries.forEach(entry => {
      const day = entry.timestamp.getDate();
      if (!dayMap[day]) dayMap[day] = { scores: [], flagged: false };
      dayMap[day].scores.push(entry.bristolScale);
      if (entry.flagged) dayMap[day].flagged = true;
    });
    
    const result = Object.entries(dayMap).map(([day, data]) => {
      return {
        day: parseInt(day),
        avgScore: data.scores.reduce((a, b) => a + b, 0) / data.scores.length,
        flagged: data.flagged
      };
    });
    
    res.json(result);
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