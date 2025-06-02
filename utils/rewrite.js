const axios = require('axios');

exports.rewriteContent = async function(text, apiKey) {
  const prompt = `Rewrite the following text in Indonesian with better structure:\n\n${text}`;
  const res = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7
  }, {
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    }
  });

  return res.data.choices[0].message.content.trim();
};
