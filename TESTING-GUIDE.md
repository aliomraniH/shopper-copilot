# 🧪 Testing Guide for Shopper Copilot

Complete guide for running automated tests locally and on Replit.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Running Tests Locally](#running-tests-locally)
3. [Testing on Replit](#testing-on-replit)
4. [Pre-Commit Testing](#pre-commit-testing)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Test Coverage](#test-coverage)
7. [Writing New Tests](#writing-new-tests)

---

## 🚀 Quick Start

### Install Test Dependencies

```bash
npm install
```

This installs:
- `jest` - Testing framework
- `supertest` - HTTP testing library
- `husky` - Git hooks manager

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests for CI

```bash
npm run test:ci
```

---

## 💻 Running Tests Locally

### 1. Start the Backend Server

**Terminal 1:**
```bash
npm start
```

Wait for:
```
╔════════════════════════════════════════════════════╗
║        🛍️  Shopper Copilot Backend Server         ║
║        Status: Running                             ║
║        Port: 3000                                  ║
╚════════════════════════════════════════════════════╝
```

### 2. Run Tests

**Terminal 2:**
```bash
npm test
```

### 3. View Results

Tests will output:
```
PASS tests/api.test.js
  Shopper Copilot API Tests
    GET /health
      ✓ should return health status (45ms)
      ✓ should return valid JSON (12ms)
    POST /api/summarize
      ✓ should require pageTitle or pageContent (23ms)
      ✓ should accept valid summarize request (2341ms)
    ...

Test Suites: 1 passed, 1 total
Tests:       24 passed, 24 total
Time:        8.231s
```

### 4. View Coverage Report

Open `coverage/lcov-report/index.html` in your browser:

```bash
# Mac
open coverage/lcov-report/index.html

# Linux
xdg-open coverage/lcov-report/index.html

# Windows
start coverage/lcov-report/index.html
```

---

## 🌐 Testing on Replit

### Deploy to Replit First

Follow [REPLIT-SETUP.md](REPLIT-SETUP.md) to deploy.

### Test Against Replit URL

```bash
# Set Replit URL
export TEST_URL="https://shopper-copilot-backend.your-username.repl.co"

# Run tests
npm test
```

### Test Specific Endpoints

```bash
REPLIT_URL="https://your-repl.repl.co"

# Health check
curl $REPLIT_URL/health

# Summarize
curl -X POST $REPLIT_URL/api/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "pageTitle": "iPhone 15 Pro",
    "pageContent": "Amazing features...",
    "pageUrl": "https://apple.com"
  }'

# Chat
curl -X POST $REPLIT_URL/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are the features?",
    "pageContext": {"title": "iPhone 15 Pro"}
  }'
```

### Automated Testing from Replit

In Replit Console:

```bash
# Run tests on Replit
npm test

# Watch mode
npm run test:watch

# CI mode (for automation)
npm run test:ci
```

---

## 🪝 Pre-Commit Testing

Tests run automatically before each commit!

### How It Works

1. You run `git commit`
2. Husky pre-commit hook triggers
3. Tests run automatically
4. If tests pass → commit succeeds ✅
5. If tests fail → commit blocked ❌

### Example

```bash
git add .
git commit -m "Add new feature"

# Output:
🧪 Running tests before commit...

PASS tests/api.test.js
  ✓ All tests passed

✅ All tests passed! Proceeding with commit...
[main a1b2c3d] Add new feature
```

### Skip Pre-Commit Tests (Not Recommended)

```bash
git commit -m "Quick fix" --no-verify
```

**⚠️ Warning:** Only skip in emergencies!

### Disable Pre-Commit Testing

```bash
# Remove hook
rm .husky/pre-commit

# Or set environment variable
export HUSKY=0
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

### Automatic Testing on Push

Every time you push to GitHub:

1. ✅ Tests run automatically
2. ✅ Multiple Node.js versions tested
3. ✅ Coverage report generated
4. ✅ Security scan performed
5. ✅ Results visible in GitHub

### View Test Results

1. Go to your GitHub repo
2. Click **"Actions"** tab
3. See test runs and results

### GitHub Actions Workflow

Located at `.github/workflows/test.yml`

Runs on:
- Every push to `main` or `claude/**` branches
- Every pull request

### Set Up GitHub Secrets

1. Go to GitHub repo → **Settings** → **Secrets**
2. Add `OPENAI_API_KEY` (for integration tests)
3. Optionally add `SNYK_TOKEN` (for security scanning)

---

## 📊 Test Coverage

### Current Coverage Targets

```javascript
{
  branches: 50%,
  functions: 50%,
  lines: 50%,
  statements: 50%
}
```

### View Coverage

```bash
npm test

# Coverage summary printed to console
# Detailed report: coverage/lcov-report/index.html
```

### Improve Coverage

1. Identify uncovered lines in report
2. Write tests for those lines
3. Run `npm test` to verify
4. Commit when coverage improves

---

## ✍️ Writing New Tests

### Test Structure

```javascript
describe('Feature Name', () => {
  it('should do something', async () => {
    const response = await request(BASE_URL)
      .get('/endpoint')
      .expect(200);

    expect(response.body).toHaveProperty('field');
  });
});
```

### Example: Testing New Endpoint

```javascript
// tests/api.test.js

describe('POST /api/new-feature', () => {
  it('should require parameter', async () => {
    const response = await request(BASE_URL)
      .post('/api/new-feature')
      .send({})
      .expect(400);

    expect(response.body.error).toContain('required');
  });

  it('should process valid request', async () => {
    const response = await request(BASE_URL)
      .post('/api/new-feature')
      .send({ param: 'value' })
      .expect(200);

    expect(response.body.success).toBe(true);
  });
});
```

### Test Best Practices

1. **One assertion per test** (when possible)
2. **Clear test names** - describe what's being tested
3. **Arrange-Act-Assert** pattern
4. **Test edge cases** - empty inputs, invalid data
5. **Mock external services** - don't rely on OpenAI in tests
6. **Clean up after tests** - restore state

### Running Individual Tests

```bash
# Run specific test file
npm test tests/api.test.js

# Run tests matching pattern
npm test -- --testNamePattern="health"

# Run with coverage for specific file
npm test -- --coverage --collectCoverageFrom="server.js"
```

---

## 🐛 Troubleshooting

### Tests Won't Run

```bash
# Clear Jest cache
npx jest --clearCache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Server Not Starting

```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9

# Start server
npm start
```

### Tests Timeout

Increase timeout in `jest.config.js`:

```javascript
module.exports = {
  testTimeout: 60000 // 60 seconds
};
```

Or in individual test:

```javascript
it('slow test', async () => {
  // test code
}, 60000); // 60 second timeout
```

### OpenAI Tests Fail

OpenAI tests may fail without API access:

```javascript
// tests/api.test.js
if (response.status === 200) {
  // Test success case
  expect(response.body.success).toBe(true);
} else {
  // Expected failure without OpenAI
  expect(response.status).toBe(500);
}
```

### Coverage Too Low

```bash
# Identify uncovered lines
npm test -- --coverage

# View detailed report
open coverage/lcov-report/index.html

# Focus on specific files
npm test -- --coverage --collectCoverageFrom="server.js"
```

---

## 📈 Monitoring Test Results

### Local Development

```bash
# Run tests in watch mode
npm run test:watch

# Re-run on file changes
# Press 'a' to run all tests
# Press 'f' to run only failed tests
# Press 'p' to filter by filename
```

### Replit Dashboard

View in Replit Console:
- Test output
- Server logs
- Error messages

### GitHub Actions

View in GitHub:
- Actions tab → Workflow runs
- Pull requests → Checks
- Commit status badges

---

## 🎯 Test Checklist

Before committing:

- [ ] All tests pass locally
- [ ] Coverage meets thresholds
- [ ] New features have tests
- [ ] Edge cases covered
- [ ] Integration tests pass
- [ ] No console errors
- [ ] Pre-commit hook works

Before deploying to Replit:

- [ ] All tests pass on Replit
- [ ] Environment variables set
- [ ] Health endpoint responds
- [ ] OpenAI integration works
- [ ] CORS configured correctly

---

## 📚 Additional Resources

- Jest Documentation: https://jestjs.io/docs/getting-started
- Supertest Guide: https://github.com/ladjs/supertest
- Husky Setup: https://typicode.github.io/husky
- GitHub Actions: https://docs.github.com/actions
- Test Coverage: https://istanbul.js.org/

---

## 🆘 Getting Help

If tests fail or you need help:

1. Check error messages carefully
2. Review server logs
3. Run tests in verbose mode: `npm test -- --verbose`
4. Check Replit console for deployment issues
5. Review GitHub Actions logs for CI failures

---

**Happy Testing! 🧪✨**

Keep those tests green! 🟢
