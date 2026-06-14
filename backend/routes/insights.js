// backend/routes/insights.js
const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 1. Move this line ABOVE the genAI setup so the computer reads the file first!
require('dotenv').config({ path: './backend/.env' }); 

// 2. Now process.env will exist and find your API key perfectly
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 3. Define your model configuration
const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

// ... the rest of your POST route code remains exactly the same


// =========================================================
// POST ROUTE: Generate AI Digest Summary
// =========================================================
router.post('/ai-summary', async (req, res) => {
  try {
    // Fetch last 30 raw logging entries
    const entries = await Entry.find({}).sort({ timestamp: -1 }).limit(30);

    // Build a streamlined dataset removing symptoms, foodLogged, medications, and flagged variables
    const summary = entries.map(entry => ({
      date: entry.timestamp ? entry.timestamp.toISOString().split('T')[0] : 'Unknown Date',
      bristolScale: entry.bristolScale,
      notes: entry.notes || ''
    }));

    // Construct a safe, tailored prompt based strictly on remaining variables
    const prompt = `
You are a helpful health assistant. A patient has been tracking their digestive health using the Bristol Stool Scale (1=very hard/constipated, 7=very liquid/diarrhea, 3-4=normal).

Here is their log data from the past 30 days containing their score scales and general journal notes:
${JSON.stringify(summary, null, 2)}

Based on this data, provide:
1. A brief 2-3 sentence plain-language summary of their overall digestive pattern.
2. Any notable patterns you observe strictly from their Bristol Scale trends or mentions within their journal notes.
3. 2-3 specific, actionable observations they might want to mention to their doctor.

Keep the tone supportive and non-alarming. Do NOT diagnose any conditions. Use simple language a patient would understand. Keep the entire response under 200 words.
    `;

    // Execute content generation using the pre-configured model variable
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Send text response safely back to frontend
    res.json({ summary: text });
  } catch (err) {
    console.error("Gemini AI summary route error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;