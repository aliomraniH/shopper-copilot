// Shopper Copilot Backend Server
// Securely handles OpenAI API calls

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const bodyParser = require('body-parser');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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
    message: 'Shopper Copilot backend is running',
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

    console.log('Generating summary for:', pageTitle);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful shopping assistant. Analyze web pages and provide concise, useful summaries focusing on products, pricing, features, and value propositions. Format your response as a JSON object with 'summary' (2-3 sentences), 'keyPoints' (array of 4-6 bullet points), and 'category' (product category)."
        },
        {
          role: "user",
          content: `Summarize this shopping page:\n\nTitle: ${pageTitle}\n\nContent: ${pageContent || 'No content provided'}\n\nURL: ${pageUrl || 'Unknown'}\n\nProvide a JSON response.`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    let result;
    try {
      result = JSON.parse(completion.choices[0].message.content);
    } catch (e) {
      // If not valid JSON, create structured response
      const content = completion.choices[0].message.content;
      result = {
        summary: content,
        keyPoints: [],
        category: 'Shopping'
      };
    }

    res.json({
      success: true,
      data: result,
      tokensUsed: completion.usage.total_tokens
    });

  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({
      error: 'Failed to generate summary',
      message: error.message
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

    console.log('Processing chat message:', message.substring(0, 50) + '...');

    // Build conversation messages
    const messages = [
      {
        role: "system",
        content: `You are Shopper Copilot, an AI shopping assistant. You help users understand products, compare prices, and make informed purchase decisions. Be concise, friendly, and helpful.

Current page context:
${pageContext ? JSON.stringify(pageContext) : 'No page context available'}`
      }
    ];

    // Add conversation history if provided
    if (conversationHistory && Array.isArray(conversationHistory)) {
      messages.push(...conversationHistory);
    }

    // Add current message
    messages.push({
      role: "user",
      content: message
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.8,
      max_tokens: 300
    });

    const response = completion.choices[0].message.content;

    res.json({
      success: true,
      response: response,
      tokensUsed: completion.usage.total_tokens
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

    console.log('Analyzing', links.length, 'links');

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are analyzing links from a shopping website. Categorize and prioritize the most important links for shoppers. Return a JSON array of objects with 'url', 'text', 'category', and 'importance' (1-5)."
        },
        {
          role: "user",
          content: `Analyze these links from "${pageTitle}":\n\n${JSON.stringify(links.slice(0, 20))}\n\nReturn top 10 most important links as JSON array.`
        }
      ],
      temperature: 0.5,
      max_tokens: 600
    });

    let result;
    try {
      result = JSON.parse(completion.choices[0].message.content);
    } catch (e) {
      result = links.slice(0, 10);
    }

    res.json({
      success: true,
      links: result,
      tokensUsed: completion.usage.total_tokens
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

    console.log('Generating share message for:', platform);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are crafting a friendly message to share a shopping page with a friend via ${platform}. Be casual, enthusiastic, and concise (2-3 sentences max).`
        },
        {
          role: "user",
          content: `Create a message to share this with ${friendName || 'a friend'}:\n\nPage: ${pageTitle}\nSummary: ${summary}`
        }
      ],
      temperature: 0.9,
      max_tokens: 150
    });

    const message = completion.choices[0].message.content;

    res.json({
      success: true,
      message: message,
      tokensUsed: completion.usage.total_tokens
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
║        🛍️  Shopper Copilot Backend Server         ║
║                                                    ║
║        Status: Running                             ║
║        Port: ${PORT}                                     ║
║        Environment: ${process.env.NODE_ENV || 'development'}                  ║
║        OpenAI: ${process.env.OPENAI_API_KEY ? '✓ Configured' : '✗ Missing'}                    ║
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
