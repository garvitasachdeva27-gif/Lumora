const sarvamClient = require('../config/sarvam');

const MODEL = 'sarvam-105b'; // balanced cost/quality — see note below

// MOCK MODE: set MOCK_AI=true in .env to test the whole app without
// spending Sarvam credits. Flip it off when you're ready for real responses.
const MOCK_MODE = process.env.MOCK_AI === 'true';

async function generateResponse(messages) {
  if (MOCK_MODE) {
    return `(Mock AI response) Here's a placeholder explanation for testing. Your last message was: "${messages[messages.length - 1].content}"`;
  }

  try {
    const { data } = await sarvamClient.post('/v1/chat/completions', {
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 800,
      reasoning_effort: null, // disables "thinking mode" — saves credits & latency
    });
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Sarvam AI error:', error.response?.data || error.message);
    throw new Error('AI_SERVICE_ERROR');
  }
}

async function analyzeInteraction(messages) {
  if (MOCK_MODE) {
    return JSON.stringify({ insight: 'Mock analysis — no real credits used.' });
  }

  try {
    const { data } = await sarvamClient.post('/v1/chat/completions', {
      model: MODEL,
      messages,
      temperature: 0.3,
      max_tokens: 250, // analysis output is small — keep this tight
      reasoning_effort: null,
    });
    return data.choices[0].message.content;
  } catch (error) {
    // Analysis failing should NEVER break the user's chat experience
    console.error('Sarvam analysis error:', error.response?.data || error.message);
    return null;
  }
}

module.exports = { generateResponse, analyzeInteraction };