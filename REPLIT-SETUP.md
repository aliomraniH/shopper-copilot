# 🚀 Replit Deployment & Automated Testing Guide

This guide will help you deploy the Shopper Copilot backend to Replit and set up automated testing that runs before each commit.

## 📋 Overview

**What We'll Build:**
1. Deploy backend server to Replit (free hosting)
2. Create automated test suite
3. Setup pre-commit hooks to run tests automatically
4. Configure CI/CD pipeline

**Why Replit?**
- ✅ Free hosting with public URL
- ✅ Always-on server option
- ✅ Easy environment variable management
- ✅ Built-in code editor and terminal
- ✅ Automatic HTTPS
- ✅ Easy to share and test

## 🎯 Part 1: Deploy Backend to Replit

### Step 1: Create Replit Account

1. Go to https://replit.com
2. Sign up with GitHub (recommended) or email
3. Verify your email

### Step 2: Create New Repl

1. Click **"+ Create Repl"** button
2. Select **"Node.js"** template
3. Name it: `shopper-copilot-backend`
4. Click **"Create Repl"**

### Step 3: Upload Backend Files

**Option A: Import from GitHub (Easiest)**

1. In Replit, click the three dots menu → **"Import from GitHub"**
2. Enter: `https://github.com/aliomraniH/shopper-copilot`
3. Select branch: `claude/javascript-chatbot-widget-011CUfkdPnaBnaSP8H9xJmz9`
4. Click **"Import"**

**Option B: Manual Upload**

1. Delete default `index.js` file
2. Click **"+"** next to Files
3. Upload these files:
   - `server.js`
   - `package.json`
   - `package-lock.json`

### Step 4: Configure Environment Variables (Secrets)

1. Click the **"Secrets"** tab (🔒 icon in sidebar)
2. Click **"+ New secret"**
3. Add these secrets:

```
Key: OPENAI_API_KEY
Value: your-openai-api-key-here
```

**⚠️ Important:** Replace `your-openai-api-key-here` with your actual OpenAI API key from https://platform.openai.com/api-keys

```
Key: PORT
Value: 3000
```

```
Key: NODE_ENV
Value: production
```

```
Key: ALLOWED_ORIGINS
Value: *
```

**Important:** Replit automatically loads secrets as environment variables!

### Step 5: Configure Replit

Create a `.replit` file in root directory:

```toml
run = "node server.js"
entrypoint = "server.js"

[nix]
channel = "stable-23_11"

[deployment]
run = ["node", "server.js"]
deploymentTarget = "cloudrun"

[[ports]]
localPort = 3000
externalPort = 80
```

Create a `replit.nix` file:

```nix
{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.nodePackages.npm
  ];
}
```

### Step 6: Run the Server

1. Click the **"Run"** button at top
2. Wait for installation: `npm install` runs automatically
3. Server should start and show:
   ```
   ╔════════════════════════════════════════════════════╗
   ║        🛍️  Shopper Copilot Backend Server         ║
   ║        Status: Running                             ║
   ║        Port: 3000                                  ║
   ║        OpenAI: ✓ Configured                        ║
   ╚════════════════════════════════════════════════════╝
   ```

### Step 7: Get Your Public URL

1. Look at the **"Webview"** panel (top-right)
2. Your URL will be: `https://shopper-copilot-backend.your-username.repl.co`
3. **Copy this URL** - you'll need it!

### Step 8: Test Your Deployment

Open the Console tab in Replit and run:

```bash
curl https://your-repl-url.repl.co/health
```

Should return:
```json
{"status":"ok","message":"Shopper Copilot backend is running","timestamp":"..."}
```

### Step 9: Enable Always-On (Optional)

1. Click **"Deployments"** tab
2. Click **"Deploy"**
3. This keeps your server running 24/7 (requires paid plan)
4. OR use **UptimeRobot** (free) to ping your server every 5 minutes

**Free Alternative - UptimeRobot:**
1. Go to https://uptimerobot.com
2. Sign up for free
3. Add new monitor: `https://your-repl-url.repl.co/health`
4. Set interval: 5 minutes
5. This keeps your Repl awake!

---

## 🧪 Part 2: Create Test Suite

### Step 1: Install Testing Dependencies

In Replit terminal or update `package.json`:

```bash
npm install --save-dev jest supertest
```

### Step 2: Create Test Files

We'll create tests in a `tests/` directory (I'll provide these files below).

### Step 3: Update package.json

Add test scripts:

```json
{
  "scripts": {
    "start": "node server.js",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  },
  "jest": {
    "testEnvironment": "node",
    "coveragePathIgnorePatterns": ["/node_modules/"],
    "testTimeout": 30000
  }
}
```

### Step 4: Run Tests

```bash
npm test
```

---

## 🔗 Part 3: Update Frontend to Use Replit URL

Update your frontend (`widget-ai.js`, `demo-ai.html`) to use Replit URL:

```javascript
// Change this:
const API_BASE_URL = 'http://localhost:3000/api';

// To this:
const API_BASE_URL = 'https://shopper-copilot-backend.your-username.repl.co/api';
```

Or make it dynamic:

```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://shopper-copilot-backend.your-username.repl.co/api'
  : 'http://localhost:3000/api';
```

---

## 🪝 Part 4: Setup Pre-Commit Testing (Git Hooks)

### Step 1: Install Husky

```bash
npm install --save-dev husky
```

### Step 2: Initialize Husky

```bash
npx husky install
```

### Step 3: Create Pre-Commit Hook

```bash
npx husky add .husky/pre-commit "npm test"
```

This creates `.husky/pre-commit` file that runs tests before every commit.

### Step 4: Make Hook Executable

```bash
chmod +x .husky/pre-commit
```

### Step 5: Test It

```bash
git add .
git commit -m "Test pre-commit hook"
```

Tests will run automatically! If tests fail, commit is blocked.

---

## 🤖 Part 5: GitHub Actions CI/CD (Automated Testing)

Create `.github/workflows/test.yml`:

```yaml
name: Test Backend

on:
  push:
    branches: [ main, claude/** ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm test
      env:
        OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}

    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage/lcov.info

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - name: Deploy to Replit
      run: echo "Deploy to Replit via webhook"
      # Add deployment script here
```

---

## 📊 Part 6: Testing Your Replit Backend

### From Your Local Machine:

```bash
# Set the Replit URL
REPLIT_URL="https://your-repl-url.repl.co"

# Test health endpoint
curl $REPLIT_URL/health

# Test summarize endpoint
curl -X POST $REPLIT_URL/api/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "pageTitle": "Test Product",
    "pageContent": "This is a test product with amazing features",
    "pageUrl": "https://example.com"
  }'

# Test chat endpoint
curl -X POST $REPLIT_URL/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are the features?",
    "pageContext": {"title": "Test Product"}
  }'
```

### Test from JavaScript:

```javascript
// In browser console or Node.js
const REPLIT_URL = 'https://your-repl-url.repl.co';

fetch(`${REPLIT_URL}/api/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Tell me about this product',
    pageContext: { title: 'iPhone 15 Pro' }
  })
})
.then(r => r.json())
.then(data => console.log(data));
```

---

## 🔒 Security Checklist for Replit

- [x] API key in Secrets (not in code)
- [x] `.env` in `.gitignore`
- [x] CORS configured properly
- [x] Rate limiting enabled (add this!)
- [x] HTTPS enabled (automatic on Replit)
- [x] Environment is production mode

---

## 💡 Tips & Best Practices

### 1. Rate Limiting

Add to `server.js`:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 2. Request Logging

```javascript
const morgan = require('morgan');
app.use(morgan('combined'));
```

### 3. Health Check Monitoring

Use UptimeRobot or Replit's built-in monitoring.

### 4. Cost Monitoring

Set up OpenAI usage alerts:
1. Go to https://platform.openai.com/account/billing/limits
2. Set monthly budget limit
3. Enable email notifications

---

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Run locally | `npm start` |
| Run tests | `npm test` |
| Deploy to Replit | Push to GitHub → Auto-deploy |
| View Replit logs | Replit Console tab |
| Update secrets | Replit → Secrets tab |
| Test endpoint | `curl https://your-repl.repl.co/health` |

---

## 📞 Troubleshooting

### Tests Won't Run

```bash
# Clear cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

### Replit Server Won't Start

1. Check Secrets are set
2. Check Console for errors
3. Try: Click "Shell" → `npm install` → `node server.js`

### CORS Errors

In `server.js`, update CORS:

```javascript
app.use(cors({
  origin: '*', // Or your specific frontend URL
  methods: ['GET', 'POST'],
  credentials: true
}));
```

### Pre-commit Hook Not Running

```bash
# Reinstall hook
rm -rf .husky
npx husky install
npx husky add .husky/pre-commit "npm test"
chmod +x .husky/pre-commit
```

---

## 🎓 Next Steps

1. ✅ Deploy to Replit
2. ✅ Create test suite
3. ✅ Setup pre-commit hooks
4. ✅ Configure GitHub Actions
5. ⬜ Add more API endpoints
6. ⬜ Implement authentication
7. ⬜ Add database (MongoDB/PostgreSQL)
8. ⬜ Create admin dashboard

---

## 📚 Resources

- Replit Docs: https://docs.replit.com
- Jest Testing: https://jestjs.io/docs/getting-started
- Husky Git Hooks: https://typicode.github.io/husky
- GitHub Actions: https://docs.github.com/actions
- OpenAI API: https://platform.openai.com/docs

---

**Your Replit URL will be:**
```
https://shopper-copilot-backend.YOUR-USERNAME.repl.co
```

**Share this URL for testing!** 🚀
