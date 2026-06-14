// tells MongoDB what field each entry has
const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  bristolScale: { type: Number, required: true, min: 1, max: 7 },
  // symptoms: { type: [String], default: [] },
  // foodLogged: { type: [String], default: [] },
  medications: { type: [String], default: [] },
  notes: { type: String, default: '' },
  color: { type: String, default: 'Brown' },
  // flagged: { type: Boolean, default: false }
});

module.exports = mongoose.model('Entry', entrySchema);