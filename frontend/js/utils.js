// Shared helper functions used across every page.

// Shows a small toast notification in the bottom-right corner.
function showToast(message, type = 'info') {
  const colors = {
    info: 'var(--accent-primary)',
    success: 'var(--success)',
    error: 'var(--error)',
  };

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.backgroundColor = colors[type] || colors.info;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3500);
}

// Disables a button and shows a loading label — used during API calls
function setButtonLoading(button, isLoading, loadingText = 'Please wait...') {
  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.textContent = loadingText;
    button.disabled = true;
    button.classList.add('opacity-60', 'cursor-not-allowed');
  } else {
    button.textContent = button.dataset.originalText || button.textContent;
    button.disabled = false;
    button.classList.remove('opacity-60', 'cursor-not-allowed');
  }
}

// Basic email format check for client-side validation before hitting the API
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}