# Google Gemini API Setup Guide

## Why Gemini?

Google Gemini offers a **FREE tier** with generous limits:
- ✅ **60 requests/minute**
- ✅ **1,500 requests/day**
- ✅ **No credit card required**
- ✅ **No billing setup needed**

Perfect alternative if you've exceeded OpenAI credits!

## Quick Start

### Step 1: Get Your Free API Key

1. Go to **[Google AI Studio](https://aistudio.google.com/apikey)**
2. Sign in with your Google account
3. Click **"Get API Key"** or **"Create API Key"**
4. Click **"Create API key in new project"**
5. Copy the API key (starts with `AIza...`)

### Step 2: Add API Key to Your Environment

**Option A: Local Development**

Edit your `.env` file and add:

```env
GEMINI_API_KEY=AIza... (your actual key here)
```

**Option B: Replit**

1. Click the **Secrets** tab (🔒 lock icon)
2. Add a new secret:
   - Key: `GEMINI_API_KEY`
   - Value: Your API key

### Step 3: Run the Gemini Server

```bash
# Using npm script
npm run start:gemini

# Or directly
node server-gemini.js

# For development with auto-reload
npm run dev:gemini
```

You should see:

```
╔════════════════════════════════════════════════════╗
║                                                    ║
║    🛍️  Shopper Copilot (Google Gemini)          ║
║                                                    ║
║        Status: Running                             ║
║        Port: 3000                                  ║
║        Gemini API: ✓ Configured                    ║
║                                                    ║
╚════════════════════════════════════════════════════╝
```

### Step 4: Test It

```bash
# Test health check
curl http://localhost:3000/health

# Test summarize
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "pageTitle": "Apple iPhone 15",
    "pageContent": "Latest iPhone with advanced features"
  }'
```

## API Endpoints

The Gemini server has the same endpoints as the OpenAI version:

- `GET /health` - Health check
- `POST /api/summarize` - Generate page summary
- `POST /api/chat` - Chat about products
- `POST /api/analyze-links` - Analyze page links
- `POST /api/generate-share-message` - Create share messages

## Troubleshooting

### Error: "403 Forbidden"

Your API key is invalid or not properly configured.

**Solution:**
1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a new API key
3. Make sure you're in a **new project** (not an existing one with restrictions)
4. Update your `.env` file with the new key
5. Restart the server

### Error: "GEMINI_API_KEY environment variable is missing"

You haven't created the `.env` file.

**Solution:**
```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
nano .env
```

### Error: "fetch failed"

Network connectivity issue.

**Solution:**
1. Check your internet connection
2. Try again - might be temporary
3. Check if you can access: `https://generativelanguage.googleapis.com`

## Rate Limits

**Free Tier:**
- 60 requests/minute
- 1,500 requests/day

If you exceed limits, you'll get a 429 error. Wait a minute and try again.

## Comparing OpenAI vs Gemini

| Feature | OpenAI (GPT-3.5) | Google Gemini Pro |
|---------|------------------|-------------------|
| **Free Tier** | ❌ Requires billing | ✅ Fully free |
| **Credit Card** | ✅ Required | ❌ Not required |
| **Rate Limit** | Varies by plan | 60/min, 1,500/day |
| **Response Quality** | Excellent | Very Good |
| **JSON Output** | More reliable | Good with prompting |

## Which Server Should I Use?

**Use `server.js` (OpenAI) if:**
- You have OpenAI credits
- You need the most consistent JSON formatting
- You're in production with paid plan

**Use `server-gemini.js` (Gemini) if:**
- You want FREE tier
- You don't want to add a credit card
- You're testing/developing
- You exceeded OpenAI free credits

## Switching Between Servers

You can run both servers on different ports:

```bash
# Terminal 1: OpenAI on port 3000
PORT=3000 npm start

# Terminal 2: Gemini on port 3001
PORT=3001 npm run start:gemini
```

Then update your frontend to point to the desired port.

## Need Help?

- **Google AI Studio**: https://aistudio.google.com
- **Gemini API Docs**: https://ai.google.dev/docs
- **API Key Management**: https://aistudio.google.com/apikey

## Security Notes

🔒 **Important:**
- Never commit `.env` file to git (it's in `.gitignore`)
- Never share your API keys
- If exposed, regenerate your key immediately
- Each developer needs their own API key
