const path = require('path');

// 1. Try loading from the backend folder
require('dotenv').config({ path: path.join(__dirname, '.env') });

// 2. If it's still undefined, try loading from the main root folder
if (!process.env.MONGODB_URI) {
  require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
}

// 3. Print a quick debug log so you can see if it worked
console.log("Database URI Loaded:", process.env.MONGODB_URI ? "✅ Found it!" : "❌ Still undefined");
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Load routes
const entryRoutes = require('./routes/entries');
const insightsRoutes = require('./routes/insights'); // 🔴 Added insights router import

console.log('✅ entryRoutes loaded:', typeof entryRoutes);
console.log('✅ insightsRoutes loaded:', typeof insightsRoutes);

// Register routes
app.use('/api/entries', entryRoutes);
app.use('/api/insights', insightsRoutes); // 🟢 Registered under /api/insights to match frontend

console.log('✅ /api/entries route registered');
console.log('✅ /api/insights route registered');

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
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));