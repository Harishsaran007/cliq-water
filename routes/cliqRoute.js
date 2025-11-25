// routes/cliqRoute.js
const express = require('express');
const router = express.Router();
const cliqAuth = require('../middleware/cliqAuth');
const scrapeDamLevels = require('../services/scrapeDamLevels');

// GET /api/cliq/dam?name=Mettur
router.get('/dam', cliqAuth, async (req, res) => {
  try {
    const nameQuery = (req.query.name || '').trim().toLowerCase();
    if (!nameQuery) {
      return res.status(400).json({ error: 'Dam name is required' });
    }

    // Get live data from tnagriculture
    const dams = await scrapeDamLevels();
    const dam = dams.find(d => d.dam.toLowerCase() === nameQuery);

    if (!dam) {
      return res.status(404).json({ error: 'Dam not found' });
    }

    return res.json({
      name: dam.dam,
      currentLevel: dam.level,
      inflow: dam.inflow,
      outflow: dam.outflow,
      storage: dam.storage,
      lastUpdated: new Date().toISOString(),
      source: 'tnagriculture.in'
    });
  } catch (err) {
    console.error('Error in /api/cliq/dam:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
