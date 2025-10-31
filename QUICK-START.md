# 🚀 Quick Start - Replit Deployment & Testing

Ultra-fast guide to get your backend tested and deployed in 10 minutes!

## ⚡ 1. Update Your Local Code (30 seconds)

```bash
cd shopper-copilot
git pull origin claude/javascript-chatbot-widget-011CUfkdPnaBnaSP8H9xJmz9
npm install
```

## 🧪 2. Run Tests Locally (1 minute)

**Terminal 1 - Start Server:**
```bash
npm start
```

**Terminal 2 - Run Tests:**
```bash
npm test
```

Expected output:
```
✓ 24 tests passed
Coverage: 50%+
```

## 🌐 3. Deploy to Replit (5 minutes)

### Quick Steps:

1. **Go to** https://replit.com
2. **Click** "Create Repl" → Choose "Node.js"
3. **Name it:** `shopper-copilot-backend`
4. **Import from GitHub:**
   - Paste: `https://github.com/aliomraniH/shopper-copilot`
   - Branch: `claude/javascript-chatbot-widget-011CUfkdPnaBnaSP8H9xJmz9`
5. **Add Secrets** (Click 🔒 icon):
   ```
   OPENAI_API_KEY = your-actual-api-key
   PORT = 3000
   NODE_ENV = production
   ALLOWED_ORIGINS = *
   ```
6. **Click "Run"** button
7. **Copy Your URL:** `https://shopper-copilot-backend.your-username.repl.co`

## ✅ 4. Test Your Deployment (2 minutes)

```bash
# Replace with your actual Replit URL
REPLIT_URL="https://your-repl.repl.co"

# Test health
curl $REPLIT_URL/health

# Should return:
# {"status":"ok","message":"Shopper Copilot backend is running"...}
```

Test in browser: Visit your Replit URL and add `/health` to the end.

## 🔗 5. Update Frontend (1 minute)

Update `widget-ai.js` line 3:

```javascript
// Change from:
const API_BASE_URL = 'http://localhost:3000/api';

// To:
const API_BASE_URL = 'https://your-repl-url.repl.co/api';
```

## 🪝 6. Enable Pre-Commit Testing (30 seconds)

```bash
npm install
npx husky install
```

Now tests run automatically before every commit!

```bash
git add .
git commit -m "Test feature"
# Tests run automatically ✓
```

## 📊 Commands Cheat Sheet

```bash
# Local Development
npm start                 # Start backend server
npm test                  # Run all tests
npm run test:watch        # Watch mode (re-run on changes)
npm run test:ci           # CI mode (for automation)

# Testing Against Replit
TEST_URL="https://your-repl.repl.co" npm test

# Git Operations
git pull                  # Update code
git add .                 # Stage changes
git commit -m "msg"       # Commit (tests run auto)
git push                  # Push to GitHub

# Debugging
lsof -ti:3000 | xargs kill -9   # Kill server on port 3000
npx jest --clearCache           # Clear test cache
npm cache clean --force         # Clear npm cache
```

## 🎯 What You Get

- ✅ **Automated Testing** - 24+ tests covering all APIs
- ✅ **Pre-Commit Hooks** - Tests run before every commit
- ✅ **CI/CD Pipeline** - GitHub Actions on every push
- ✅ **Live Backend** - Always-on Replit deployment
- ✅ **Real AI** - OpenAI GPT integration
- ✅ **Coverage Reports** - Know what's tested
- ✅ **Public URL** - Share and test remotely

## 📚 Full Guides

- **Replit Deployment:** [REPLIT-SETUP.md](REPLIT-SETUP.md)
- **Testing Guide:** [TESTING-GUIDE.md](TESTING-GUIDE.md)
- **AI Integration:** [README-AI.md](README-AI.md)

## 🆘 Quick Troubleshooting

**Tests fail?**
```bash
# Make sure server is running
curl http://localhost:3000/health
```

**Can't deploy to Replit?**
- Make sure secrets are set
- Check Console tab for errors
- Try: Shell → `npm install` → `node server.js`

**Pre-commit hook not working?**
```bash
chmod +x .husky/pre-commit
```

**GitHub Actions failing?**
- Go to repo → Actions → View logs
- May need to add `OPENAI_API_KEY` to GitHub Secrets

## 🎓 Next Steps

1. ✅ Deploy to Replit
2. ✅ Run tests
3. ⬜ Add more test cases
4. ⬜ Setup monitoring
5. ⬜ Add authentication
6. ⬜ Create production build

---

**Your Replit URL:**
```
https://shopper-copilot-backend.YOUR-USERNAME.repl.co
```

**Test it now!** 🚀

Share this URL with me (Claude) so I can test your APIs directly!
