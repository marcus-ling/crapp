// tells MongoDB what field each entry has
const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema(
  {
    timestamp: { type: Date, default: Date.now },
    // Matches frontend selectedType
    bristolScale: { type: Number, required: true, min: 1, max: 7 },
    // Existing frontend fields
    color: {
      type: String,
      enum: ['brown', 'dark-brown', 'light-brown', 'yellow', 'green', 'black', 'red'],
      default: 'brown'
    },
    duration: { type: Number},
    notes: { type: String, default: '' },
    // New tracking fields
    //symptoms: { type: [String], default: [] },
    //foodLogged: { type: [String], default: [] },
    //medications: { type: [String], default: [] },
    // Optional frontend-supported extras
    //photo: { type: String, default: '' },      // base64 or URL
    //aiAnalysis: { type: String, default: '' },
    // Flag for concerning entries
    //flagged: { type: Boolean, default: false }
  },
  { timestamps: false }
);

module.exports = mongoose.model('Entry', entrySchema);
