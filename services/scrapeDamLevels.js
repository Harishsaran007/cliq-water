// services/scrapeDamLevels.js
const axios = require('axios');
const cheerio = require('cheerio');

const numberFrom = (s) => {
  if (s == null) return null;
  const cleaned = String(s).replace(/,/g, '').trim();
  if (cleaned === '' || cleaned === '-' ) return null;
  const n = parseFloat(cleaned);
  return Number.isNaN(n) ? null : n;
};

const extractDate = (text) => {
  if (!text) return null;
  // try common formats: DD-MM-YYYY or DD/MM/YYYY or YYYY-MM-DD
  const m1 = text.match(/\b(\d{2}[-\/]\d{2}[-\/]\d{4})\b/);
  if (m1) return m1[1];
  const m2 = text.match(/\b(\d{4}[-\/]\d{2}[-\/]\d{2})\b/);
  return m2 ? m2[1] : null;
};

const scrapeDamLevels = async () => {
  try {
    const url = 'https://tnagriculture.in/ARS/home/reservoir';
    const { data } = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36'
      }
    });

    const $ = cheerio.load(data);
    const damData = [];

    // If site uses a table (keeps backward compatibility)
    $('table tbody tr').each((i, row) => {
      const columns = $(row).find('td');
      // We access columns[0]..columns[6], so ensure at least 7 columns
      if (columns.length >= 7) {
        const c = (idx) => $(columns[idx]).text().trim();
        damData.push({
          damName: c(0) || null,
          fullDepth: numberFrom(c(1)),
          fullCapacity: numberFrom(c(2)),
          currentWaterLevel: numberFrom(c(3)),
          currentStorageVolume: numberFrom(c(4)),
          inflow: numberFrom(c(5)),
          outflow: numberFrom(c(6))
        });
      }
    });

    // If no table rows found, try fallback parsing (plain text / preformatted)
    if (damData.length === 0) {
      const bodyText = $('body').text();
      const lines = bodyText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const numberRegex = /^-?\d+(\.\d+)?$/;

      for (const line of lines) {
        const tokens = line.split(/\s+/);
        if (tokens.length < 6) continue;
        // find first numeric token index (dam name may be multiword)
        let firstNumIdx = -1;
        for (let i = 1; i < tokens.length; i++) {
          if (numberRegex.test(tokens[i].replace(/,/g, ''))) {
            firstNumIdx = i;
            break;
          }
        }
        if (firstNumIdx === -1) continue;
        const name = tokens.slice(0, firstNumIdx).join(' ');
        const cols = tokens.slice(firstNumIdx).map(t => t.replace(/,/g, ''));
        if (cols.length < 6) continue;
        damData.push({
          damName: name,
          fullDepth: numberFrom(cols[0]),
          fullCapacity: numberFrom(cols[1]),
          currentWaterLevel: numberFrom(cols[2]),
          currentStorageVolume: numberFrom(cols[3]),
          inflow: numberFrom(cols[4]),
          outflow: numberFrom(cols[5])
        });
      }
    }

    // Extract date text (more flexible selector)
    // Many pages show date in a centered paragraph or at top; try common selectors
    const possibleDateStrings = [
      $('p.text-center').text(),
      $('div.date').text(),
      $('body').text()
    ].filter(Boolean).join('\n');

    const date = extractDate(possibleDateStrings);

    // attach date to each dam object
    const updatedDamData = damData.map(dam => ({ ...dam, date }));

    return updatedDamData;
  } catch (err) {
    console.error('Scraping Error:', err && err.message ? err.message : err);
    return [];
  }
};

module.exports = scrapeDamLevels;
