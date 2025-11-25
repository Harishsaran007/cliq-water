// middleware/cliqAuth.js
require('dotenv').config();

module.exports = function cliqAuth(req, res, next) {
  const header = req.headers['x-cliq-bot-token'] || req.headers['authorization'];

  if (!header) {
    return res.status(401).json({ error: 'No bot token provided' });
  }

  // support "Bearer token..." or plain token
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;

  if (token !== process.env.CLIQ_BOT_TOKEN) {
    return res.status(403).json({ error: 'Invalid bot token' });
  }

  next();
};
