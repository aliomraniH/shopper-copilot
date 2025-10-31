# Shopper Copilot - AI Integration Setup

## 🤖 OpenAI Integration - Now Live!

This version of Shopper Copilot includes **real OpenAI GPT integration** for actual AI-powered summaries and intelligent chat responses.

## 🔒 Security Architecture

**Your OpenAI API key is NEVER exposed to the client!**

```
User Browser → Frontend Widget → Backend Server (port 3000) → OpenAI API
                                      ↓
                              .env file (secure)
                         OPENAI_API_KEY stored here
```

- ✅ API key stored in `.env` file (git-ignored)
- ✅ Backend server handles all OpenAI calls
- ✅ Client-side code has NO access to API key
- ✅ CORS protection on backend
- ✅ Request logging and error handling

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `express` - Web server
- `openai` - Official OpenAI SDK
- `cors` - Cross-origin support
- `dotenv` - Environment variables
- `body-parser` - Request parsing

### 2. Configure API Key

Configure your OpenAI API key in the `.env` file:

```env
OPENAI_API_KEY=your-openai-api-key-here
PORT=3000
NODE_ENV=development
```

**⚠️ Important:**
- Replace `your-openai-api-key-here` with your actual OpenAI API key
- The `.env` file is in `.gitignore` and will NOT be committed to Git
- Get your API key from: https://platform.openai.com/api-keys

### 3. Start Backend Server

```bash
npm start
```

You should see:

```
╔════════════════════════════════════════════════════╗
║        🛍️  Shopper Copilot Backend Server         ║
║        Status: Running                             ║
║        Port: 3000                                  ║
║        OpenAI: ✓ Configured                        ║
╚════════════════════════════════════════════════════╝
```

**Keep this terminal window open** - the server must stay running.

### 4. Open Demo Page

In a **new terminal window**, start the static file server:

```bash
python3 -m http.server 8080
```

Then open in your browser:

```
http://localhost:8080/demo-ai.html
```

## ✨ AI Features

### 1. Smart Chat (GPT-Powered)

Click the chat widget and ask questions:

- "What are the key features of this product?"
- "Is this a good deal?"
- "Compare this to similar products"
- "What are the pros and cons?"

The AI uses GPT-3.5-turbo to provide intelligent, context-aware responses.

### 2. AI Summary Generation

Click **"AI Summary"** quick action or the Generate button in Summary tab.

The AI will:
- Analyze the entire page content
- Extract key product features
- Identify value propositions
- Categorize the product
- Return structured JSON with summary and key points

### 3. Intelligent Link Analysis

Click **"Analyze"** to let AI:
- Identify most important links on page
- Rank them by relevance (1-5 stars)
- Categorize links (products, support, info, etc.)
- Filter out spam/irrelevant links

### 4. Smart Share Messages

When sharing with friends:
- AI generates personalized, friendly messages
- Adapts tone for different platforms (WhatsApp/Telegram/Messenger)
- Includes context about the product
- Creates engaging, natural language

## 🔌 API Endpoints

The backend server exposes these endpoints:

### GET /health

Health check endpoint:

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "message": "Shopper Copilot backend is running",
  "timestamp": "2025-10-31T20:55:47.102Z"
}
```

### POST /api/summarize

Generate AI summary of page:

```bash
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "pageTitle": "iPhone 15 Pro",
    "pageContent": "Product description...",
    "pageUrl": "https://apple.com/iphone"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "summary": "2-3 sentence summary",
    "keyPoints": ["Point 1", "Point 2", ...],
    "category": "Technology"
  },
  "tokensUsed": 234
}
```

### POST /api/chat

Chat with AI about the page:

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are the key features?",
    "pageContext": {...},
    "conversationHistory": [...]
  }'
```

Response:
```json
{
  "success": true,
  "response": "The key features include...",
  "tokensUsed": 156
}
```

### POST /api/analyze-links

AI analyzes and ranks page links:

```bash
curl -X POST http://localhost:3000/api/analyze-links \
  -H "Content-Type: application/json" \
  -d '{
    "links": [{"text": "Buy Now", "url": "..."}],
    "pageTitle": "iPhone 15 Pro"
  }'
```

### POST /api/generate-share-message

Generate friendly sharing message:

```bash
curl -X POST http://localhost:3000/api/generate-share-message \
  -H "Content-Type: application/json" \
  -d '{
    "pageTitle": "iPhone 15 Pro",
    "summary": "...",
    "friendName": "John",
    "platform": "whatsapp"
  }'
```

## 💰 OpenAI Costs

This integration uses `gpt-3.5-turbo` which is very affordable:

- **Input:** $0.50 per 1M tokens
- **Output:** $1.50 per 1M tokens

Typical costs per operation:
- Summary generation: ~$0.0002 (200-500 tokens)
- Chat message: ~$0.0001 (100-300 tokens)
- Link analysis: ~$0.0003 (300-600 tokens)

**Estimated cost:** About $0.01-0.02 per 100 interactions.

Monitor usage at: https://platform.openai.com/usage

## 🐛 Troubleshooting

### "Backend Not Running" Error

**Problem:** Widget shows "Offline Mode"

**Solutions:**
1. Make sure backend server is running: `npm start`
2. Check server is on port 3000: `curl http://localhost:3000/health`
3. Verify no other app is using port 3000
4. Check terminal for server errors

### "Failed to generate summary" Error

**Problem:** API calls fail with connection error

**Solutions:**
1. Verify API key is correct in `.env` file
2. Check OpenAI API status: https://status.openai.com
3. Ensure you have internet connection
4. Check OpenAI account has credits/billing setup
5. Try API key in curl:
   ```bash
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer YOUR_API_KEY"
   ```

### CORS Errors

**Problem:** Browser shows CORS policy errors

**Solutions:**
1. Make sure backend server is running
2. Check `ALLOWED_ORIGINS` in `.env` includes your frontend URL
3. Open demo page from `http://localhost:8080` (not `file://`)

### API Key Exposed Warning

**Problem:** Worried about API key security

**Solutions:**
1. ✅ API key is in `.env` file (git-ignored)
2. ✅ NEVER put API key in client-side JavaScript
3. ✅ Always use backend server for OpenAI calls
4. ✅ If key is exposed, rotate it at OpenAI dashboard immediately

## 📊 Usage Tracking

The backend logs all API calls:

```
2025-10-31T20:55:56.619Z - POST /api/summarize
Generating summary for: iPhone 15 Pro
```

Each API response includes `tokensUsed` field for tracking.

## 🔄 Development vs Production

### Development (current setup)

```env
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:8080,http://127.0.0.1:8080
```

### Production (recommended)

```env
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com
```

Additional production recommendations:
- Use `https://` for all connections
- Add rate limiting (express-rate-limit)
- Add request authentication
- Use environment-specific API keys
- Enable request logging to file
- Add monitoring (e.g., Sentry)
- Use PM2 or similar for process management

## 🎯 Next Steps

1. **Test all features** - Try chat, summary, and sharing
2. **Monitor costs** - Check OpenAI dashboard
3. **Customize prompts** - Edit system messages in `server.js`
4. **Add features:**
   - Price comparison
   - Review sentiment analysis
   - Product recommendations
   - Multi-language support
5. **Deploy to production** - Use services like:
   - Heroku
   - Railway
   - Render
   - Digital Ocean

## 📚 Files

```
shopper-copilot/
├── server.js           # Backend server with OpenAI integration
├── widget-ai.js        # Frontend widget with API calls
├── demo-ai.html        # Demo page with setup instructions
├── .env                # API keys (NOT in git)
├── .env.example        # Template for .env
├── package.json        # Node.js dependencies
└── README-AI.md        # This file
```

## 🤝 Support

- **OpenAI Issues:** https://help.openai.com
- **Backend Logs:** Check terminal where `npm start` is running
- **Frontend Errors:** Open browser console (F12)

## 🔐 Security Checklist

- [x] API key in `.env` (not in code)
- [x] `.env` in `.gitignore`
- [x] CORS configured
- [x] Input validation on backend
- [x] Error messages don't expose sensitive data
- [x] HTTPS recommended for production
- [ ] Rate limiting (add for production)
- [ ] Request authentication (add for production)

---

**You're all set!** 🎉 Enjoy your AI-powered shopping assistant!

For questions or issues, check the troubleshooting section above or review the server logs.
