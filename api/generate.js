import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // CORS Headers allow karne ke liye
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API Key missing in Vercel settings' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    // Normal single-shot generate content (bina complex stream chunking ke, taaki function timeout na ho)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a detailed engineering ML blueprint for: ${prompt}`,
    });

    return res.status(200).send(response.text);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}