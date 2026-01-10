import express from 'express';
import { detectLanguage, getSystemPromptByLanguage } from '../_core/languageDetection.js';
import { OpenAI } from 'openai';

const router = express.Router();

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ 
        error: 'Message is required',
        success: false
      });
    }

    // كشف اللغة
    const detectedLanguage = detectLanguage(message);
    const systemPrompt = getSystemPromptByLanguage(detectedLanguage);

    // استدعاء OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
    });

    const reply = response.choices[0]?.message?.content || 'Sorry, I could not get a response.';

    res.json({
      reply,
      success: true,
      detectedLanguage,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: error.message,
      success: false,
    });
  }
});

export default router;  // ✅ هذا السطر مهم جداً!
