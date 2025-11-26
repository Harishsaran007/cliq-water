const express = require('express');
const router = express.Router();
const cliqAuth = require('../middleware/cliqAuth');
const scrapeDamLevels = require('../services/scrapeDamLevels');

function normalizeDamName(name = '') {
  return name
    .toString()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

// GET /api/cliq/dam?name=Mettur
router.get('/dam', cliqAuth, async (req, res) => {
  try {
    const rawQuery = (req.query.name || '').trim();
    if (!rawQuery) return res.status(400).json({ error: 'Dam name is required' });

    const nameQuery = normalizeDamName(rawQuery);

    const dams = await scrapeDamLevels();

    
    const normalizedDams = dams.map(d => {
      const raw = (d.damName || d.dam || '').toString();
      return { raw, norm: normalizeDamName(raw), data: d };
    });

    
    let match = normalizedDams.find(x => x.norm === nameQuery);
    if (!match) match = normalizedDams.find(x => x.norm.startsWith(nameQuery));
    if (!match) match = normalizedDams.find(x => x.norm.includes(nameQuery));

    if (!match) {
      return res.status(404).json({
        error: 'Dam not found',
        query: rawQuery,
        normalizedQuery: nameQuery
      });
    }

    const dam = match.data || {};

    return res.json({
      name: match.raw,
      fullDepth: dam.fullDepth != null ? dam.fullDepth : null,
      fullCapacity: dam.fullCapacity != null ? dam.fullCapacity : null,
      currentLevel: dam.currentWaterLevel != null ? dam.currentWaterLevel : null,
      currentStorage: dam.currentStorageVolume != null ? dam.currentStorageVolume : null,
      inflow: dam.inflow != null ? dam.inflow : null,
      outflow: dam.outflow != null ? dam.outflow : null,
      date: dam.date || null,
      source: 'tnagriculture.in'
    });
  } catch (err) {
    console.error('Error in /api/cliq/dam:', err && err.stack ? err.stack : err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/cliq/dams  → list all dam names
router.get('/dams', cliqAuth, async (req, res) => {
  try {
    const dams = await scrapeDamLevels();
    const names = dams.map(d => (d.damName || d.dam || '').toString()).filter(Boolean);
    return res.json({ count: names.length, dams: names });
  } catch (err) {
    console.error('Error in /api/cliq/dams:', err && err.stack ? err.stack : err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
