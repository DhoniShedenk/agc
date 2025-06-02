const axios = require('axios');
const cheerio = require('cheerio');

exports.googleSearch = async function(keyword) {
  const url = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&hl=id`;
  const res = await axios.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const $ = cheerio.load(res.data);
  const links = [];

  $('a').each((_, el) => {
    const href = $(el).attr('href');
    if (href && href.startsWith('/url?q=')) {
      const realUrl = href.split('/url?q=')[1].split('&')[0];
      if (!realUrl.includes('google')) links.push(realUrl);
    }
  });

  return [...new Set(links)].slice(0, 3);
};
