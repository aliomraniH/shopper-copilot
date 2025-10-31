// Shopper Copilot Backend Server - Google Gemini Version
// Uses Google Gemini API (FREE tier available!)

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const bodyParser = require('body-parser');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Shopper Copilot backend is running (Google Gemini)',
    ai_provider: 'Google Gemini Pro',
    free_tier: 'Yes - 60 requests/minute',
    timestamp: new Date().toISOString()
  });
});

// Summarize page content
app.post('/api/summarize', async (req, res) => {
  try {
    const { pageTitle, pageContent, pageUrl } = req.body;

    if (!pageContent && !pageTitle) {
      return res.status(400).json({
        error: 'Page title or content is required'
      });
    }

    console.log('📝 Generating summary with Gemini for:', pageTitle);

    const prompt = `You are a helpful shopping assistant. Analyze this shopping page and provide a concise summary.

Page Title: ${pageTitle}
Page Content: ${pageContent || 'No content provided'}
Page URL: ${pageUrl || 'Unknown'}

Provide a response in this exact JSON format:
{
  "summary": "2-3 sentence summary here",
  "keyPoints": ["point 1", "point 2", "point 3", "point 4"],
  "category": "product category"
}

Focus on products, pricing, features, and value propositions. Be concise and helpful.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let parsedData;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch (e) {
      parsedData = {
        summary: text.substring(0, 300).replace(/```json|```/g, '').trim(),
        keyPoints: text.split('\n').filter(l => l.trim().startsWith('-') || l.trim().startsWith('*')).map(l => l.replace(/^[-*]\s*/, '').trim()).slice(0, 6) || [
          'AI-analyzed product features',
          'Key specifications extracted',
          'Value proposition identified'
        ],
        category: 'Shopping'
      };
    }

    console.log('✅ Summary generated successfully');

    res.json({
      success: true,
      data: parsedData,
      provider: 'Google Gemini Pro (FREE)',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error generating summary:', error.message);
    res.status(500).json({
      error: 'Failed to generate summary',
      message: error.message,
      provider: 'Google Gemini Pro'
    });
  }
});

// Chat with AI about the page
app.post('/api/chat', async (req, res) => {
  try {
    const { message, pageContext, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('💬 Processing chat message with Gemini:', message.substring(0, 50) + '...');

    // Build conversation context
    let conversationText = '';
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationText = conversationHistory
        .slice(-4)
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');
    }

    const prompt = `You are Shopper Copilot, an AI shopping assistant. You help users understand products, compare prices, and make informed purchase decisions. Be concise (2-3 sentences), friendly, and helpful.

Current page context:
Title: ${pageContext?.title || 'Unknown'}
URL: ${pageContext?.url || 'Unknown'}
${pageContext?.testData ? `Product: ${pageContext.testData.title || ''}` : ''}

${conversationText ? `Previous conversation:\n${conversationText}\n` : ''}
User: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();

    console.log('✅ Chat response generated');

    res.json({
      success: true,
      response: aiResponse,
      provider: 'Google Gemini Pro (FREE)'
    });

  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({
      error: 'Failed to process chat message',
      message: error.message
    });
  }
});

// Extract and analyze links from page
app.post('/api/analyze-links', async (req, res) => {
  try {
    const { links, pageTitle } = req.body;

    if (!links || !Array.isArray(links)) {
      return res.status(400).json({ error: 'Links array is required' });
    }

    console.log('🔗 Analyzing', links.length, 'links with Gemini');

    const prompt = `Analyze these links from a shopping website and return the top 10 most important links for shoppers.

Page: "${pageTitle}"
Links: ${JSON.stringify(links.slice(0, 20))}

Return a JSON array of objects with 'url', 'text', 'category', and 'importance' (1-5).
Example: [{"url": "...", "text": "...", "category": "products", "importance": 5}]`;

    const geminiResult = await model.generateContent(prompt);
    const response = await geminiResult.response;
    const text = response.text();

    let result;
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = links.slice(0, 10);
      }
    } catch (e) {
      result = links.slice(0, 10);
    }

    console.log('✅ Links analyzed');

    res.json({
      success: true,
      links: result,
      provider: 'Google Gemini Pro (FREE)'
    });

  } catch (error) {
    console.error('Error analyzing links:', error);
    res.status(500).json({
      error: 'Failed to analyze links',
      message: error.message
    });
  }
});

// Generate sharing message for friends
app.post('/api/generate-share-message', async (req, res) => {
  try {
    const { pageTitle, summary, friendName, platform } = req.body;

    console.log('✉️  Generating share message for:', platform);

    const prompt = `Create a friendly message to share this shopping page with a friend via ${platform}. Be casual, enthusiastic, and concise (2-3 sentences max).

Share with: ${friendName || 'a friend'}
Page: ${pageTitle}
Summary: ${summary}

Write the message now:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const message = response.text().trim();

    console.log('✅ Share message generated');

    res.json({
      success: true,
      message: message,
      provider: 'Google Gemini Pro (FREE)'
    });

  } catch (error) {
    console.error('Error generating share message:', error);
    res.status(500).json({
      error: 'Failed to generate message',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║                                                    ║
║    🛍️  Shopper Copilot (Google Gemini)          ║
║                                                    ║
║        Status: Running                             ║
║        Port: ${PORT}                                     ║
║        Environment: ${process.env.NODE_ENV || 'development'}                  ║
║        Gemini API: ${process.env.GEMINI_API_KEY ? '✓ Configured' : '✗ Missing'}                    ║
║                                                    ║
║        Endpoints:                                  ║
║        GET  /health                                ║
║        POST /api/summarize                         ║
║        POST /api/chat                              ║
║        POST /api/analyze-links                     ║
║        POST /api/generate-share-message            ║
║                                                    ║
╚════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
