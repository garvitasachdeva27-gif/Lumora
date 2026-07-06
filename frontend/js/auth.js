// Handles: token storage, auth state checks, and the login/register form logic.

const TOKEN_KEY = 'lumora_token';
const USER_KEY = 'lumora_user';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setAuth(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function isLoggedIn() {
  return !!getToken();
}

// Call at the top of any protected page (dashboard, learn, progress, etc.)
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
  }
}

// Call at the top of login/register pages — skip the form if already logged in
function redirectIfLoggedIn() {
  if (isLoggedIn()) {
    window.location.href = 'dashboard.html';
  }
}

function logout() {
  clearAuth();
  window.location.href = 'login.html';
}

// Wires up the login form, if present on the current page
function initLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const submitBtn = document.getElementById('submitBtn');

    if (!isValidEmail(email) || !password) {
      showToast('Please enter a valid email and password', 'error');
      return;
    }

    setButtonLoading(submitBtn, true, 'Logging in...');
    try {
      const data = await apiRequest('/auth/login', { method: 'POST', body: { email, password }, auth: false });
      setAuth(data.token, data.user);
      showToast(`Welcome back, ${data.user.name}!`, 'success');
      setTimeout(() => (window.location.href = 'dashboard.html'), 500);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setButtonLoading(submitBtn, false);
    }
  });
}

// Wires up the register form, if present on the current page
function initRegisterForm() {
  const form = document.getElementById('registerForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const submitBtn = document.getElementById('submitBtn');

    if (!name || !isValidEmail(email) || password.length < 6) {
      showToast('Please fill all fields (password: 6+ characters)', 'error');
      return;
    }

    setButtonLoading(submitBtn, true, 'Creating account...');
    try {
      const data = await apiRequest('/auth/register', { method: 'POST', body: { name, email, password }, auth: false });
      setAuth(data.token, data.user);
      showToast('Account created! Welcome to Lumora.', 'success');
      setTimeout(() => (window.location.href = 'dashboard.html'), 500);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setButtonLoading(submitBtn, false);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initLoginForm();
  initRegisterForm();
});