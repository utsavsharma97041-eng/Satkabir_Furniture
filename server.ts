import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '20mb' }));

app.get('/health', (_req, res) => {
  res.status(200).send('OK');
});

// Shared Gemini client with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// 1. Gemini Chatbot ("Ustaad Ji" Master Artisan of Satkkabir Furniture Udhyog)
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const chat = ai.chats.create({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction: `You are "Ustaad Ji", the chief hereditary master carpenter and woodcraft consultant at "Satkkabir Furniture Udhyog" (सत्कबीर फर्नीचर उद्योग).
You specialize in Indian solid hardwoods: Pure Sheesham Wood (Indian Rosewood), CP Teak Wood (Sagwan), Mango Wood, and Rosewood.
Your personality is warm, respectful (using polite Hindi/English like 'Namaste', 'Ji', 'Shandar'), deeply knowledgeable about timber moisture seasoning (kiln-drying to 8-12%), mortise & tenon joinery, custom room dimensions, hydraulic storage fittings, beeswax polishing, and custom modifications.
Answer user questions about furniture measurements, wood choices for bedrooms/living rooms/temples, durability, maintenance, and custom design ideas. Keep responses practical, inspiring, and concise.`,
      },
    });

    // Replay conversation history
    let lastResponseText = '';
    for (const msg of messages) {
      if (msg.role === 'user') {
        const resp = await chat.sendMessage({ message: msg.content });
        lastResponseText = resp.text || '';
      }
    }

    res.json({ reply: lastResponseText });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Chat generation failed' });
  }
});

// 2. Google Search Grounding (Live Timber Market Rates & Hardwood Trends)
app.post('/api/search', async (req, res) => {
  try {
    const { query } = req.body;
    const prompt = query || 'What are the current timber market rates in India for seasoned Sheesham and Teak wood per cubic foot?';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || '';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((c: any) => c.web)
      .filter(Boolean)
      .map((w: any) => ({ title: w.title, uri: w.uri }));

    res.json({ text, sources });
  } catch (error: any) {
    console.error('Search grounding error:', error);
    res.status(500).json({ error: error.message || 'Search grounding failed' });
  }
});

// 3. Google Maps Grounding (Workshops, Showrooms & Carpenter Fitters in India)
app.post('/api/maps', async (req, res) => {
  try {
    const { query, latitude, longitude } = req.body;
    const prompt = query || 'Find major furniture wood clusters, teak timber markets, and furniture manufacturing hubs in India';

    const toolConfig: any = {};
    if (latitude && longitude) {
      toolConfig.retrievalConfig = {
        latLng: {
          latitude: Number(latitude),
          longitude: Number(longitude),
        },
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        ...(Object.keys(toolConfig).length > 0 ? { toolConfig } : {}),
      },
    });

    const text = response.text || '';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const places = groundingChunks
      .map((c: any) => c.maps)
      .filter(Boolean)
      .map((m: any) => ({ title: m.title || 'Location Reference', uri: m.uri }));

    res.json({ text, places });
  } catch (error: any) {
    console.error('Maps grounding error:', error);
    res.status(500).json({ error: error.message || 'Maps grounding failed' });
  }
});

// 4. Audio Transcription (gemini-3.5-transcribe)
app.post('/api/transcribe', async (req, res) => {
  try {
    const { audioBase64, mimeType } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: 'audioBase64 is required' });
    }

    const audioPart = {
      inlineData: {
        mimeType: mimeType || 'audio/webm',
        data: audioBase64,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          audioPart,
          { text: 'Transcribe this spoken custom furniture requirement or measurement notes accurately into English/Hinglish text.' },
        ],
      },
    });

    res.json({ transcription: response.text || '' });
  } catch (error: any) {
    console.error('Audio transcription error:', error);
    res.status(500).json({ error: error.message || 'Transcription failed' });
  }
});

// 5. Bioscience Timber Analysis (Wood anatomy, cellulose/lignin dendrochronology & chemical extractives)
app.post('/api/science-timber', async (req, res) => {
  try {
    const { species } = req.body;
    const targetSpecies = species || 'Sheesham';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Perform a scientific botanical and chemical analysis for the hardwood species: "${targetSpecies}".
Provide a JSON response with:
1. scientificName (e.g. Dalbergia sissoo or Tectona grandis)
2. plantFamily
3. woodAnatomy: vessel diameter, ray parenchyma, fibers, and heartwood porosity
4. biochemicalComposition: cellulosePercent, hemicellulosePercent, ligninPercent, extractivesPercent
5. keyExtractives: array of natural chemical compounds responsible for durability (e.g., Dalbergin, Lapachol, Deoxylapachol) with chemical formula and natural termite/water repellent biological mechanism
6. physicalProperties: Janka hardness rating (lbf), air-dry density (kg/m3), tangential shrinkage percent, radial shrinkage percent
7. dendrochronologyNotes: growth rings clarity and climate response.`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Science timber error:', error);
    res.status(500).json({ error: error.message || 'Science timber analysis failed' });
  }
});

// Start Vite server in middleware mode or serve production build
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const distPath = path.resolve(__dirname, 'dist');
  const indexHtmlPath = path.resolve(distPath, 'index.html');
  const hasDist = fs.existsSync(indexHtmlPath);

  if (isProd && hasDist) {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(indexHtmlPath);
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Satkkabir Furniture Udhyog server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
