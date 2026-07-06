const axios = require('axios');

// One shared HTTP client for all Sarvam API calls.
// The subscription key is read from .env — never exposed to the frontend.
const sarvamClient = axios.create({
  baseURL: 'https://api.sarvam.ai',
  headers: {
    'api-subscription-key': process.env.SARVAM_API_KEY,
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

module.exports = sarvamClient;