// routes/scrapeRoute.js
const express = require('express');
const router = express.Router();
const scrapeDamLevels = require('../services/scrapeDamLevels');

router.get('/', async (req, res) => {
  try {
    const dams = await scrapeDamLevels();
    res.json(dams);
  } catch (err) {
    console.error('Error in /api/scrape:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
