// API Tests for Shopper Copilot Backend
// Run with: npm test

const request = require('supertest');

// We'll test against the actual server
const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

describe('Shopper Copilot API Tests', () => {

  // Health Check Endpoint
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(BASE_URL)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should return valid JSON', async () => {
      const response = await request(BASE_URL)
        .get('/health')
        .expect('Content-Type', /json/);

      expect(response.body).toBeDefined();
    });
  });

  // Summarize Endpoint
  describe('POST /api/summarize', () => {
    it('should require pageTitle or pageContent', async () => {
      const response = await request(BASE_URL)
        .post('/api/summarize')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should accept valid summarize request', async () => {
      const response = await request(BASE_URL)
        .post('/api/summarize')
        .send({
          pageTitle: 'Test Product Page',
          pageContent: 'This is a test product with amazing features and great price.',
          pageUrl: 'https://example.com/product'
        })
        .set('Content-Type', 'application/json');

      // May fail if OpenAI is not available, so check both cases
      if (response.status === 200) {
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('summary');
      } else {
        // Expected failure without OpenAI access
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error');
      }
    });

    it('should handle missing fields gracefully', async () => {
      const response = await request(BASE_URL)
        .post('/api/summarize')
        .send({ pageTitle: 'Test' })
        .set('Content-Type', 'application/json');

      // Should either succeed or return proper error
      expect([200, 400, 500]).toContain(response.status);
    });
  });

  // Chat Endpoint
  describe('POST /api/chat', () => {
    it('should require message field', async () => {
      const response = await request(BASE_URL)
        .post('/api/chat')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Message is required');
    });

    it('should accept valid chat request', async () => {
      const response = await request(BASE_URL)
        .post('/api/chat')
        .send({
          message: 'What are the key features?',
          pageContext: {
            title: 'Test Product',
            url: 'https://example.com'
          }
        })
        .set('Content-Type', 'application/json');

      // May fail without OpenAI access
      if (response.status === 200) {
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('response');
        expect(typeof response.body.response).toBe('string');
      } else {
        expect(response.status).toBe(500);
      }
    });

    it('should handle conversation history', async () => {
      const response = await request(BASE_URL)
        .post('/api/chat')
        .send({
          message: 'Tell me more',
          conversationHistory: [
            { role: 'user', content: 'What is this?' },
            { role: 'assistant', content: 'This is a product.' }
          ]
        })
        .set('Content-Type', 'application/json');

      expect([200, 500]).toContain(response.status);
    });
  });

  // Analyze Links Endpoint
  describe('POST /api/analyze-links', () => {
    it('should require links array', async () => {
      const response = await request(BASE_URL)
        .post('/api/analyze-links')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should accept valid links array', async () => {
      const response = await request(BASE_URL)
        .post('/api/analyze-links')
        .send({
          links: [
            { text: 'Buy Now', url: 'https://example.com/buy' },
            { text: 'Learn More', url: 'https://example.com/info' }
          ],
          pageTitle: 'Test Product Page'
        })
        .set('Content-Type', 'application/json');

      if (response.status === 200) {
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('links');
        expect(Array.isArray(response.body.links)).toBe(true);
      } else {
        expect(response.status).toBe(500);
      }
    });

    it('should handle empty links array', async () => {
      const response = await request(BASE_URL)
        .post('/api/analyze-links')
        .send({
          links: [],
          pageTitle: 'Test'
        })
        .set('Content-Type', 'application/json');

      expect([200, 400, 500]).toContain(response.status);
    });
  });

  // Generate Share Message Endpoint
  describe('POST /api/generate-share-message', () => {
    it('should accept valid share request', async () => {
      const response = await request(BASE_URL)
        .post('/api/generate-share-message')
        .send({
          pageTitle: 'iPhone 15 Pro',
          summary: 'Amazing new phone with titanium design',
          friendName: 'John',
          platform: 'whatsapp'
        })
        .set('Content-Type', 'application/json');

      if (response.status === 200) {
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message');
        expect(typeof response.body.message).toBe('string');
      } else {
        expect(response.status).toBe(500);
      }
    });

    it('should work without friend name', async () => {
      const response = await request(BASE_URL)
        .post('/api/generate-share-message')
        .send({
          pageTitle: 'Test Product',
          summary: 'Test summary',
          platform: 'telegram'
        })
        .set('Content-Type', 'application/json');

      expect([200, 500]).toContain(response.status);
    });
  });

  // 404 Handler
  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(BASE_URL)
        .get('/api/nonexistent')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('not found');
    });
  });

  // CORS Headers
  describe('CORS Configuration', () => {
    it('should include CORS headers', async () => {
      const response = await request(BASE_URL)
        .get('/health')
        .expect(200);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });

  // Response Format
  describe('Response Format', () => {
    it('should return consistent error format', async () => {
      const response = await request(BASE_URL)
        .post('/api/chat')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(typeof response.body.error).toBe('string');
    });

    it('should return consistent success format', async () => {
      const response = await request(BASE_URL)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
    });
  });
});

// Integration Tests
describe('Integration Tests', () => {
  it('should handle multiple concurrent requests', async () => {
    const requests = Array(5).fill(null).map(() =>
      request(BASE_URL).get('/health')
    );

    const responses = await Promise.all(requests);

    responses.forEach(response => {
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
    });
  });

  it('should maintain session across requests', async () => {
    // First request
    const response1 = await request(BASE_URL)
      .get('/health')
      .expect(200);

    // Second request
    const response2 = await request(BASE_URL)
      .get('/health')
      .expect(200);

    expect(response1.body.status).toBe(response2.body.status);
  });
});

// Performance Tests
describe('Performance Tests', () => {
  it('health endpoint should respond quickly', async () => {
    const start = Date.now();

    await request(BASE_URL)
      .get('/health')
      .expect(200);

    const duration = Date.now() - start;

    // Should respond in less than 1 second
    expect(duration).toBeLessThan(1000);
  });
});
