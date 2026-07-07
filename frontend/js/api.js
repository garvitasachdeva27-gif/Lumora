// Centralized API communication layer — every page routes requests through this.
// Uses the local backend during development and the deployed Render backend in production.
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'https://lumora-backend-ejuy.onrender.com/api'
  : 'https://lumora-backend-ejuy.onrender.com/api';
async function apiRequest(endpoint, { method = 'GET', body = null, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Unexpected server response');
  }

  if (!response.ok) {
    // If the token is invalid/expired, log the user out and send them to login
    if (response.status === 401) {
      clearAuth();
      window.location.href = 'login.html';
    }
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}