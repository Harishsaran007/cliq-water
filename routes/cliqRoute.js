// routes/cliqRoute.js
const express = require('express');
const router = express.Router();
const cliqAuth = require('../middleware/cliqAuth');
const scrapeDamLevels = require('../services/scrapeDamLevels');


function normalizeDamName(name = '') {
  return name
    .toLowerCase()
    .replace(/\s+/g, ' ')      
    .replace(/[^a-z\s]/g, '')  
    .trim();
}

// GET /api/cliq/dam?name=Mettur
router.get('/dam', cliqAuth, async (req, res) => {
  try {
    const rawQuery = (req.query.name || '').trim();

    if (!rawQuery) {
      return res.status(400).json({ error: 'Dam name is required' });
    }

    const nameQuery = normalizeDamName(rawQuery);

    // Get live data from tnagriculture
    const dams = await scrapeDamLevels();

    // Build list with normalized names
    const normalizedDams = dams.map(d => ({
      raw: d.dam,
      norm: normalizeDamName(d.dam),
      data: d
    }));

    console.log('--- /api/cliq/dam ---');
    console.log('Raw query       :', rawQuery);
    console.log('Normalized query:', nameQuery);

    
    let match = normalizedDams.find(d => d.norm === nameQuery);

    
    if (!match) {
      match = normalizedDams.find(d => d.norm.startsWith(nameQuery));
    }

    
    if (!match) {
      match = normalizedDams.find(d => d.norm.includes(nameQuery));
    }

    if (!match) {
      console.log('No dam found for:', nameQuery);
      return res.status(404).json({
        error: 'Dam not found',
        query: rawQuery,
        normalizedQuery: nameQuery
      });
    }

    const dam = match.data;

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

// GET /api/cliq/dams  → list all dam names
router.get('/dams', cliqAuth, async (req, res) => {
  try {
    const dams = await scrapeDamLevels();
    const names = dams.map(d => d.dam);

    return res.json({
      count: names.length,
      dams: names
    });
  } catch (err) {
    console.error('Error in /api/cliq/dams:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
