// services/scrapeDamLevels.js
const axios = require('axios');
const cheerio = require('cheerio');

const scrapeDamLevels = async () => {
  try {
    const url = 'https://tnagriculture.in/ARS/home/reservoir';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const damData = [];

    $('table tbody tr').each((i, row) => {
      const columns = $(row).find('td');
      if (columns.length >= 5) {
        damData.push({
          dam: $(columns[0]).text().trim(),
          level: $(columns[1]).text().trim(),
          inflow: $(columns[2]).text().trim(),
          outflow: $(columns[3]).text().trim(),
          storage: $(columns[4]).text().trim(),
        });
      }
    });

    return damData;
  } catch (err) {
    console.error('Scraping Error:', err.message);
    return [];
  }
};

module.exports = scrapeDamLevels;
