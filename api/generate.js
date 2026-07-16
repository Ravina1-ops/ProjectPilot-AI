const https = require('https');

export default function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API Key is missing in Vercel settings' });
  }

  // Gemini API request payload
  const postData = JSON.stringify({
    contents: [{
      parts: [{
        text: `Generate a detailed engineering ML blueprint for: ${prompt}`
      }]
    }]
  });

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    port: 443,
    path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const apiRequest = https.request(options, (apiResponse) => {
    let data = '';

    apiResponse.on('data', (chunk) => {
      data += chunk;
    });

    apiResponse.on('end', () => {
      try {
        const parsedData = JSON.parse(data);
        if (parsedData.candidates && parsedData.candidates[0].content.parts[0].text) {
          const textResponse = parsedData.candidates[0].content.parts[0].text;
          res.status(200).send(textResponse);
        } else {
          res.status(500).json({ error: 'Invalid response from Gemini API', details: parsedData });
        }
      } catch (e) {
        res.status(500).json({ error: 'Failed to parse Gemini response', raw: data });
      }
    });
  });

  apiRequest.on('error', (e) => {
    res.status(500).json({ error: e.message });
  });

  apiRequest.write(postData);
  apiRequest.end();
}