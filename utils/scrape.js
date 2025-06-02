const axios = require('axios');
const cheerio = require('cheerio');

exports.scrapeContent = async function(url) {
  try {
    const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(data);
    const title = $('title').text().trim();
    let content = "";

    $('p').each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 50) content += `<p>${text}</p>\n`;
    });

    return { title, content };
  } catch {
    return null;
  }
};
