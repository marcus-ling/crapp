require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Load routes
const entryRoutes = require('./routes/entries');
console.log('✅ entryRoutes loaded:', typeof entryRoutes);

// Register routes
app.use('/api/entries', entryRoutes);
console.log('✅ /api/entries route registered');

// Connect to database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Health check
app.get('/api/ping', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));