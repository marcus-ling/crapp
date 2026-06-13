require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors()); // Allows your frontend to safely make cross-origin requests
app.use(express.json());

// 1. ROUTE REGISTERING (Crucial from Option 1)
const entryRoutes = require('./routes/entries');
app.use('/api/entries', entryRoutes);

// Optional: Add your Phase 2 & 3 routes here if they are in separate files
// const insightRoutes = require('./routes/insights');
// app.use('/api/insights', insightRoutes);

// 2. DATABASE CONNECTION
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Health check endpoint
app.get('/api/ping', (req, res) => {
  res.json({ status: 'ok' });
});

// 3. CORRECT PORT CONFIGURATION (Crucial from Option 2)
// Kept at 5000 so it matches your frontend fetch calls and doesn't clash with Vite
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
