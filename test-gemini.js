// Test Gemini API directly
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGeminiAPI() {
  console.log('🧪 Testing Gemini API...\n');

  const apiKey = process.env.GEMINI_API_KEY;
  console.log(`API Key: ${apiKey?.substring(0, 20)}...${apiKey?.substring(apiKey.length - 4)}`);

  if (!apiKey) {
    console.error('❌ No API key found in .env file');
    process.exit(1);
  }

  try {
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);

    // Try gemini-pro first
    console.log('\n📝 Testing with model: gemini-pro');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const result = await model.generateContent('Say hello in one word');
    const response = await result.response;
    const text = response.text();

    console.log('✅ SUCCESS!');
    console.log('Response:', text);
    console.log('\n🎉 Gemini API is working correctly!');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);

    // Check specific error types
    if (error.message.includes('403')) {
      console.error('\n📋 Issue: API Not Enabled');
      console.error('Solution:');
      console.error('1. Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com');
      console.error('2. Click "ENABLE" button');
      console.error('3. Wait 2-3 minutes');
      console.error('4. Run this test again: node test-gemini.js');
    } else if (error.message.includes('API key')) {
      console.error('\n📋 Issue: Invalid API Key');
      console.error('Solution: Get new key from https://aistudio.google.com/app/apikey');
    } else {
      console.error('\n📋 Full error:', error);
    }

    process.exit(1);
  }
}

// Run test
testGeminiAPI();
