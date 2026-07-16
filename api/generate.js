import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is missing in environment variables' });
  }

  try {
    // Setting up streaming response headers
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    });

    const ai = new GoogleGenAI({ apiKey });
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: `Generate a detailed engineering ML blueprint for: ${prompt}`,
    });

    for await (const chunk of responseStream) {
      res.write(chunk.text);
    }
    
    res.end();
  } catch (error) {
    console.error(error);
    res.end(`[Error: ${error.message}]`);
  }
}